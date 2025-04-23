import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all permissions
export const fetchAllPermissions = createAsyncThunk(
    'permissions/fetchAllPermissions',
    async () => {
        const response = await axiosInstance.get('/permissions');
        return response.data;
    }
);

// Update role permissions
export const updateRolePermissions = createAsyncThunk(
    'permissions/updateRolePermissions',
    async ({ roleId, permissions }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/roles/${roleId}/permissions`, {
                permissions
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Assign permission to user
export const assignPermissionToUser = createAsyncThunk(
    'permissions/assignPermissionToUser',
    async ({ userId, permission }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/assign-permission', {
                user_id: userId,
                permission: permission
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Get user permissions
export const getUserPermissions = createAsyncThunk(
    'permissions/getUserPermissions',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/user-permissions/${userId}`);
            return { userId, permissions: response.data.permissions };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const permissionSlice = createSlice({
    name: 'permissions',
    initialState: {
        items: [],
        userPermissions: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPermissions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllPermissions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchAllPermissions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateRolePermissions.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(assignPermissionToUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(getUserPermissions.fulfilled, (state, action) => {
                const { userId, permissions } = action.payload;
                state.userPermissions[userId] = permissions;
            });
    },
});

export default permissionSlice.reducer; 