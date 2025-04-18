import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Actions asynchrones
export const fetchReclamations = createAsyncThunk(
    'reclamations/fetchReclamations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/reclamations');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createReclamation = createAsyncThunk(
    'reclamations/createReclamation',
    async (reclamationData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/reclamations', reclamationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateReclamation = createAsyncThunk(
    'reclamations/updateReclamation',
    async ({ id, ...reclamationData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/reclamations/${id}`, reclamationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteReclamation = createAsyncThunk(
    'reclamations/deleteReclamation',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/reclamations/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Export reclamations
export const exportReclamations = createAsyncThunk(
    'reclamations/exportReclamations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/reclamations/export', {
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
            return rejectWithValue(error.response.data);
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
            const response = await axios.post('/reclamations/import', formData, {
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