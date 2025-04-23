import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Récupérer toutes les permissions attribuées aux utilisateurs
export const fetchModelPermissions = createAsyncThunk(
    'modelPermissions/fetchModelPermissions',
    async () => {
        const response = await axiosInstance.get('/api/model-permissions');
        return response.data;
    }
);

// Récupérer les permissions d'un utilisateur spécifique
export const fetchUserModelPermissions = createAsyncThunk(
    'modelPermissions/fetchUserModelPermissions',
    async (userId) => {
        const response = await axiosInstance.get(`/api/model-permissions/user/${userId}`);
        return { userId, permissions: response.data };
    }
);

// Attribuer une permission à un utilisateur
export const assignPermissionToUser = createAsyncThunk(
    'modelPermissions/assignPermissionToUser',
    async ({ userId, permissionId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/api/model-permissions', {
                model_id: userId,
                permission_id: permissionId,
                model_type: 'App\\Models\\User'
            });
            return { userId, permissionId, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Retirer une permission d'un utilisateur
export const removePermissionFromUser = createAsyncThunk(
    'modelPermissions/removePermissionFromUser',
    async ({ userId, permissionId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/api/model-permissions', {
                data: {
                    model_id: userId,
                    permission_id: permissionId,
                    model_type: 'App\\Models\\User'
                }
            });
            return { userId, permissionId };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const modelPermissionSlice = createSlice({
    name: 'modelPermissions',
    initialState: {
        items: [],
        userPermissions: {}, // structure: { userId: [permissionIds] }
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Cas pour fetchModelPermissions
            .addCase(fetchModelPermissions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchModelPermissions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
                
                // Organiser les permissions par utilisateur
                action.payload.forEach(item => {
                    if (item.model_type === 'App\\Models\\User') {
                        if (!state.userPermissions[item.model_id]) {
                            state.userPermissions[item.model_id] = [];
                        }
                        state.userPermissions[item.model_id].push(item.permission_id);
                    }
                });
            })
            .addCase(fetchModelPermissions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            
            // Cas pour fetchUserModelPermissions
            .addCase(fetchUserModelPermissions.fulfilled, (state, action) => {
                const { userId, permissions } = action.payload;
                state.userPermissions[userId] = permissions.map(p => p.permission_id);
            })
            
            // Cas pour assignPermissionToUser
            .addCase(assignPermissionToUser.fulfilled, (state, action) => {
                const { userId, permissionId } = action.payload;
                if (!state.userPermissions[userId]) {
                    state.userPermissions[userId] = [];
                }
                if (!state.userPermissions[userId].includes(permissionId)) {
                    state.userPermissions[userId].push(permissionId);
                }
                
                // Ajouter à la liste complète si nécessaire
                state.items.push({
                    model_id: userId,
                    permission_id: permissionId,
                    model_type: 'App\\Models\\User'
                });
            })
            
            // Cas pour removePermissionFromUser
            .addCase(removePermissionFromUser.fulfilled, (state, action) => {
                const { userId, permissionId } = action.payload;
                if (state.userPermissions[userId]) {
                    state.userPermissions[userId] = state.userPermissions[userId]
                        .filter(id => id !== permissionId);
                }
                
                // Retirer de la liste complète
                state.items = state.items.filter(item => 
                    !(item.model_id === userId && 
                      item.permission_id === permissionId && 
                      item.model_type === 'App\\Models\\User')
                );
            });
    },
});

export default modelPermissionSlice.reducer; 