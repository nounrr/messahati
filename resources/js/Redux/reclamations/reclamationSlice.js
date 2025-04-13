import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all reclamations
export const fetchReclamations = createAsyncThunk(
    'reclamations/fetchReclamations',
    async () => {
        const response = await axiosInstance.get('/reclamations');
        return response.data;
    }
);

// Create new reclamations
export const createReclamations = createAsyncThunk(
    'reclamations/createReclamations',
    async (reclamations, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            reclamations.forEach((reclamation, index) => {
                Object.entries(reclamation).forEach(([key, value]) => {
                    if (key === 'image' && value instanceof File) {
                        formData.append(`reclamations[${index}][image]`, value);
                    } else {
                        formData.append(`reclamations[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.post('/reclamations', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update existing reclamations
export const updateReclamations = createAsyncThunk(
    'reclamations/updateReclamations',
    async (reclamations, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            reclamations.forEach((reclamation, index) => {
                Object.entries(reclamation).forEach(([key, value]) => {
                    if (key === 'image' && value instanceof File) {
                        formData.append(`reclamations[${index}][image]`, value);
                    } else {
                        formData.append(`reclamations[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.put('/reclamations', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete reclamations
export const deleteReclamations = createAsyncThunk(
    'reclamations/deleteReclamations',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/reclamations', { data: { ids } });
            return response.data;
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
            const response = await axiosInstance.post('/reclamations/import', formData, {
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

const reclamationSlice = createSlice({
    name: 'reclamations',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReclamations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchReclamations.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchReclamations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createReclamations.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(createReclamations.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })
            .addCase(updateReclamations.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteReclamations.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            })
            .addCase(importReclamations.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            });
    },
});

export default reclamationSlice.reducer; 