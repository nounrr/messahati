import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all mutuels
export const fetchMutuels = createAsyncThunk(
    'mutuels/fetchMutuels',
    async () => {
        const response = await axiosInstance.get('/mutuels');
        return response.data;
    }
);

// Create new mutuels
export const createMutuels = createAsyncThunk(
    'mutuels/createMutuels',
    async (mutuels, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            mutuels.forEach((mutuel, index) => {
                Object.entries(mutuel).forEach(([key, value]) => {
                    if (key === 'image' && value instanceof File) {
                        formData.append(`mutuels[${index}][image]`, value);
                    } else {
                        formData.append(`mutuels[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.post('/mutuels', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update existing mutuels
export const updateMutuels = createAsyncThunk(
    'mutuels/updateMutuels',
    async ({ updates }, { rejectWithValue }) => {
        try {
            const mutuel = updates[0];
            const response = await axiosInstance.put(`/mutuels/${mutuel.id}`, {
                nom_mutuel: mutuel.nom_mutuel
            });
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw error;
            }
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete mutuels
export const deleteMutuels = createAsyncThunk(
    'mutuels/deleteMutuels',
    async (ids, { rejectWithValue }) => {
        try {
            await axiosInstance.delete('/mutuels', { data: { ids } });
            return { ids }; // Retourner les IDs pour le reducer
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Export mutuels
export const exportMutuels = createAsyncThunk(
    'mutuels/exportMutuels',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/mutuels/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'mutuels.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Import mutuels
export const importMutuels = createAsyncThunk(
    'mutuels/importMutuels',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/mutuels/import', formData, {
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

const mutuelSlice = createSlice({
    name: 'mutuels',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMutuels.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMutuels.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchMutuels.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createMutuels.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(createMutuels.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })
            .addCase(updateMutuels.fulfilled, (state, action) => {
                const updatedMutuel = action.payload;
                const index = state.items.findIndex((item) => item.id === updatedMutuel.id);
                if (index !== -1) {
                    state.items[index] = updatedMutuel;
                }
            })
            .addCase(deleteMutuels.fulfilled, (state, action) => {
                const idsToDelete = action.payload.ids;
                state.items = state.items.filter(item => !idsToDelete.includes(item.id));
            })
            .addCase(importMutuels.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            });
    },
});

export default mutuelSlice.reducer; 