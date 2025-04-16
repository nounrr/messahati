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
            await axiosInstance.post('/charges', { charges });
            return charges;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update existing charges
export const updateCharges = createAsyncThunk(
    'charges/updateCharges',
    async (charges, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/charges', { charges });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete charges
export const deleteCharges = createAsyncThunk(
    'charges/deleteCharges',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/charges', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
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
            return rejectWithValue(error.response.data);
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
            })
            .addCase(fetchCharges.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCharges.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createCharges.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(createCharges.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })
            .addCase(updateCharges.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteCharges.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            })
            .addCase(importCharges.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            });
    },
});

export default chargeSlice.reducer; 