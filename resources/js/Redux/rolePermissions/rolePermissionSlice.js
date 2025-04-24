import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all users
export const fetchUsers = createAsyncThunk(
    'rolePermissions/fetchUsers',
    async () => {
        const response = await axiosInstance.get('/users');
        return response.data;
    }
);

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

// Delete role
export const deleteRole = createAsyncThunk(
    'rolePermissions/deleteRole',
    async (id) => {
        const response = await axiosInstance.delete(`/roles/${id}`);
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

// Remove role from user
export const removeRoleFromUser = createAsyncThunk(
    'rolePermissions/removeRoleFromUser',
    async ({ userId, role }) => {
        const response = await axiosInstance.post('/remove-role', { user_id: userId, role });
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

// Fetch user roles
export const fetchUserRoles = createAsyncThunk(
    'rolePermissions/fetchUserRoles',
    async (userId) => {
        const response = await axiosInstance.get(`/api/users/${userId}/roles`);
        return response.data;
    }
);

// Fetch user permissions
export const fetchUserPermissions = createAsyncThunk(
    'rolePermissions/fetchUserPermissions',
    async (userId) => {
        const response = await axiosInstance.get(`/user-permissions/${userId}`);
        return { userId, permissions: response.data };
    }
);

const rolePermissionSlice = createSlice({
    name: 'rolePermissions',
    initialState: {
        roles: [],
        permissions: [],
        userRoles: {}, // Nouveau state pour stocker les rôles par utilisateur
        userPermissions: {}, // Nouveau state pour stocker les permissions par utilisateur
        users: [], // Add users to the state
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
            // Fetch users
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
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
            // Delete role
            .addCase(deleteRole.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const deletedId = action.payload?.id || action.meta?.arg;
                state.roles = state.roles.filter(role => role.id !== deletedId);
            })
            .addCase(deleteRole.rejected, (state, action) => {
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
            // Remove role from user
            .addCase(removeRoleFromUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeRoleFromUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Update the userRoles state if needed
                if (action.payload.user_id && action.payload.role) {
                    const userId = action.payload.user_id;
                    const roleToRemove = action.payload.role;
                    if (state.userRoles[userId]) {
                        state.userRoles[userId] = state.userRoles[userId].filter(
                            role => role.name !== roleToRemove
                        );
                    }
                }
            })
            .addCase(removeRoleFromUser.rejected, (state, action) => {
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
            })
            // Fetch user roles
            .addCase(fetchUserRoles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserRoles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userRoles[action.payload.user_id] = action.payload.roles;
            })
            .addCase(fetchUserRoles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Fetch user permissions
            .addCase(fetchUserPermissions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserPermissions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userPermissions[action.payload.userId] = action.payload.permissions;
            })
            .addCase(fetchUserPermissions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { clearError } = rolePermissionSlice.actions;

export default rolePermissionSlice.reducer; 