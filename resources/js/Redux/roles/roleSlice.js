import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all roles
export const fetchAllRoles = createAsyncThunk(
    'roles/fetchAllRoles',
    async () => {
        const response = await axiosInstance.get('/roles');
        console.log("Fetched roles with permissions:", response.data);
        return response.data;
    }
);

// Create new role
export const createRole = createAsyncThunk(
    'roles/createRole',
    async (roleData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/roles', roleData);
            return response.data.role;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update role
export const updateRole = createAsyncThunk(
    'roles/updateRole',
    async ({ id, roleData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/roles/${id}`, roleData);
            return response.data.role;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete role
export const deleteRole = createAsyncThunk(
    'roles/deleteRole',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/roles/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Assign role to user
export const assignRoleToUser = createAsyncThunk(
    'roles/assignRoleToUser',
    async ({ userId, role }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/assign-role', {
                user_id: userId,
                role: role
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Remove role from user
export const removeRoleFromUser = createAsyncThunk(
    'roles/removeRoleFromUser',
    async ({ userId, role }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/remove-role', {
                user_id: userId,
                role: role
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const roleSlice = createSlice({
    name: 'roles',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllRoles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllRoles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchAllRoles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                const index = state.items.findIndex(role => role.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.items = state.items.filter(role => role.id !== action.payload);
            })
            .addCase(assignRoleToUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(removeRoleFromUser.fulfilled, (state) => {
                state.status = 'succeeded';
            });
    },
});

export default roleSlice.reducer; 