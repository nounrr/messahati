import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all roles
export const fetchRoles = createAsyncThunk(
    'rolePermissions/fetchRoles',
    async () => {
        const response = await axiosInstance.get('/roles');
        return response.data;
    }
);

// Create new role
export const createRole = createAsyncThunk(
    'rolePermissions/createRole',
    async (roleData) => {
        const response = await axiosInstance.post('/roles', roleData);
        return response.data;
    }
);

// Update role
export const updateRole = createAsyncThunk(
    'rolePermissions/updateRole',
    async ({ id, roleData }) => {
        const response = await axiosInstance.put(`/roles/${id}`, roleData);
        return response.data;
    }
);

// Fetch all permissions
export const fetchPermissions = createAsyncThunk(
    'rolePermissions/fetchPermissions',
    async () => {
        const response = await axiosInstance.get('/permissions');
        return response.data;
    }
);

// Assign role to user
export const assignRoleToUser = createAsyncThunk(
    'rolePermissions/assignRoleToUser',
    async ({ userId, role }) => {
        const response = await axiosInstance.post('/assign-role', { user_id: userId, role });
        return response.data;
    }
);

// Assign permission to user
export const assignPermissionToUser = createAsyncThunk(
    'rolePermissions/assignPermissionToUser',
    async ({ userId, permission }) => {
        const response = await axiosInstance.post('/assign-permission', { user_id: userId, permission });
        return response.data;
    }
);

const rolePermissionSlice = createSlice({
    name: 'rolePermissions',
    initialState: {
        roles: [],
        permissions: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch roles
            .addCase(fetchRoles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.roles = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Create role
            .addCase(createRole.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.roles.push(action.payload.role);
            })
            .addCase(createRole.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Update role
            .addCase(updateRole.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.roles.findIndex(role => role.id === action.payload.role.id);
                if (index !== -1) {
                    state.roles[index] = action.payload.role;
                }
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Fetch permissions
            .addCase(fetchPermissions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPermissions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.permissions = action.payload;
            })
            .addCase(fetchPermissions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Assign role to user
            .addCase(assignRoleToUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(assignRoleToUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(assignRoleToUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Assign permission to user
            .addCase(assignPermissionToUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(assignPermissionToUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(assignPermissionToUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { clearError } = rolePermissionSlice.actions;

export default rolePermissionSlice.reducer; 