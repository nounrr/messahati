import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

// Actions asynchrones
export const fetchReclamations = createAsyncThunk(
    'reclamations/fetchReclamations',
    async (params = {}, { rejectWithValue, getState }) => {
        try {
            const { userId } = params; // Récupérer l'ID utilisateur s'il est fourni
            console.log('Fetching reclamations with userId:', userId);

            // Construire l'URL avec les paramètres si nécessaire
            let url = '/reclamations';
            // if (userId) {
            //     url += `?user_id=${userId}`;
            // }

            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Une erreur est survenue' });
        }
    }
);

export const createReclamation = createAsyncThunk(
    'reclamations/createReclamation',
    async (reclamationData, { rejectWithValue, getState }) => {
        try {
            console.log('Sending reclamation with auth user from Redux');
            const response = await axiosInstance.post('/reclamations', reclamationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Une erreur est survenue' });
        }
    }
);

export const updateReclamation = createAsyncThunk(
    'reclamations/updateReclamation',
    async ({ id, ...reclamationData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/reclamations/${id}`, reclamationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Une erreur est survenue' });
        }
    }
);

export const deleteReclamation = createAsyncThunk(
    'reclamations/deleteReclamation',
    async (id, { rejectWithValue }) => {
        try {
            // Vérifier que l'ID est bien formaté (nombre ou chaîne)
            if (id === null || id === undefined || typeof id === 'object') {
                throw new Error('ID de réclamation invalide');
            }
            
            console.log('Deleting reclamation with ID:', id);
            await axiosInstance.delete(`/reclamations/${id}`);
            return id;
        } catch (error) {
            console.error('Error deleting reclamation:', error);
            return rejectWithValue(error.response?.data || { message: 'Une erreur est survenue lors de la suppression' });
        }
    }
);

// Export reclamations
export const exportReclamations = createAsyncThunk(
    'reclamations/exportReclamations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/reclamations/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'reclamations.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Une erreur est survenue' });
        }
    }
);

// Import reclamations
export const importReclamations = createAsyncThunk(
    'reclamations/importReclamations',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/reclamations/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Une erreur est survenue' });
        }
    }
);

// Slice
const reclamationSlice = createSlice({
    name: 'reclamations',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch reclamations
            .addCase(fetchReclamations.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchReclamations.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchReclamations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Une erreur est survenue';
            })
            // Create reclamation
            .addCase(createReclamation.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Update reclamation
            .addCase(updateReclamation.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete reclamation
            .addCase(deleteReclamation.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            // Import reclamations
            .addCase(importReclamations.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            });
    }
});

export default reclamationSlice.reducer; 