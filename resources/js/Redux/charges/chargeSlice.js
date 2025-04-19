import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all charges
export const fetchCharges = createAsyncThunk(
    'charges/fetchCharges',
    async () => {
        const response = await axiosInstance.get('/charges');
        return response.data;
    }
);

// Create new charges
export const createCharges = createAsyncThunk(
    'charges/createCharges',
    async (charges, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/charges', { charges });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Erreur lors de la création des charges' });
        }
    }
);

// Update existing charges
export const updateCharges = createAsyncThunk(
    'charges/updateCharges',
    async (charges, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/charges', { updates: charges });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Erreur lors de la mise à jour des charges' });
        }
    }
);

// Delete charges
export const deleteCharges = createAsyncThunk(
    'charges/deleteCharges',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/charges', { data: { ids } });
            return { ids };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Erreur lors de la suppression des charges' });
        }
    }
);

// Export charges
export const exportCharges = createAsyncThunk(
    'charges/exportCharges',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/charges/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'charges.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Erreur lors de l\'exportation des charges' });
        }
    }
);

// Import charges
export const importCharges = createAsyncThunk(
    'charges/importCharges',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/charges/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Erreur lors de l\'importation des charges' });
        }
    }
);

export const deleteCharge = createAsyncThunk(
    'charges/deleteCharge',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/api/charges/bulk', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const chargeSlice = createSlice({
    name: 'charges',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCharges.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCharges.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCharges.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createCharges.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createCharges.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = [...state.items, ...action.payload];
            })
            .addCase(createCharges.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Erreur lors de la création';
            })
            .addCase(updateCharges.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateCharges.fulfilled, (state, action) => {
                state.status = 'succeeded';
                action.payload.forEach(updatedCharge => {
                    const index = state.items.findIndex(item => item.id === updatedCharge.id);
                    if (index !== -1) {
                        state.items[index] = updatedCharge;
                    }
                });
            })
            .addCase(updateCharges.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Erreur lors de la mise à jour';
            })
            .addCase(deleteCharges.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteCharges.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = state.items.filter(item => !action.payload.ids.includes(item.id));
            })
            .addCase(deleteCharges.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Erreur lors de la suppression';
            })
            .addCase(importCharges.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            });
    },
});

export default chargeSlice.reducer; 