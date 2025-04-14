import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all taches
export const fetchTaches = createAsyncThunk(
    'taches/fetchTaches',
    async () => {
        const response = await axiosInstance.get('/taches');
        return response.data;
    }
);

// Create new taches
export const createTaches = createAsyncThunk(
    'taches/createTaches',
    async (taches, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            taches.forEach((tache, index) => {
                Object.entries(tache).forEach(([key, value]) => {
                    if (key === 'image' && value instanceof File) {
                        formData.append(`taches[${index}][image]`, value);
                    } else {
                        formData.append(`taches[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.post('/taches', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update existing taches
export const updateTaches = createAsyncThunk(
    'taches/updateTaches',
    async (taches, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            taches.forEach((tache, index) => {
                Object.entries(tache).forEach(([key, value]) => {
                    if (key === 'image' && value instanceof File) {
                        formData.append(`taches[${index}][image]`, value);
                    } else {
                        formData.append(`taches[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.put('/taches', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete taches
export const deleteTaches = createAsyncThunk(
    'taches/deleteTaches',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/taches', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Export taches
export const exportTaches = createAsyncThunk(
    'taches/exportTaches',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/taches/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'taches.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Import taches
export const importTaches = createAsyncThunk(
    'taches/importTaches',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/taches/import', formData, {
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

const tacheSlice = createSlice({
    name: 'taches',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTaches.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTaches.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTaches.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createTaches.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(createTaches.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })
            .addCase(updateTaches.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteTaches.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            })
            .addCase(importTaches.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            });
    },
});

export default tacheSlice.reducer; 