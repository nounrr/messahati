import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all users with their permissions
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async () => {
        const response = await axiosInstance.get('/users');
        return response.data;
    }
);

// Fetch users by role
export const fetchUsersByRole = createAsyncThunk(
    'users/fetchUsersByRole',
    async (role) => {
        const response = await axiosInstance.get(`/users/role/${role}`);
        return response.data;
    }
);

// Create new users
export const createUsers = createAsyncThunk(
    'users/createUsers',
    async (users, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            users.forEach((user, index) => {
                Object.entries(user).forEach(([key, value]) => {
                    if (key === 'photo' && value instanceof File) {
                        formData.append(`users[${index}][photo]`, value);
                    } else {
                        formData.append(`users[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.post('/users', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update existing users
export const updateUsers = createAsyncThunk(
    'users/updateUsers',
    async (users, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('users', JSON.stringify(users));

            // Ajouter la photo si elle existe
            if (users[0].photo instanceof File) {
                formData.append('users[0][photo]', users[0].photo);
            }

            const response = await axiosInstance.post('/users/update', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete users
export const deleteUsers = createAsyncThunk(
    'users/deleteUsers',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/users', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Export users
export const exportUsers = createAsyncThunk(
    'users/exportUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/users/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'users.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Import users
export const importUsers = createAsyncThunk(
    'users/importUsers',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/users/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Change password
export const changePassword = createAsyncThunk(
    'users/changePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            // Vérifier si le token existe
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue({ message: 'Session expirée. Veuillez vous reconnecter.' });
            }

            // Vérifier si le token est valide
            const response = await axiosInstance.post('/users/change-password', {
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
                confirm_password: passwordData.confirm_password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            // Gérer les erreurs d'authentification
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                return rejectWithValue({ message: 'Session expirée. Veuillez vous reconnecter.' });
            }
            
            // Gérer les autres erreurs
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data);
            }
            
            return rejectWithValue({ message: 'Une erreur est survenue lors du changement de mot de passe' });
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchUsersByRole.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(createUsers.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(createUsers.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })
            .addCase(updateUsers.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteUsers.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            })
            .addCase(importUsers.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                // Handle successful password change
                state.status = 'succeeded';
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to change password';
            });
    },
});

export default userSlice.reducer; 