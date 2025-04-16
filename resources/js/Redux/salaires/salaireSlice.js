import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all salaires
export const fetchSalaires = createAsyncThunk(
    'salaires/fetchSalaires',
    async () => {
        const response = await axiosInstance.get('/salaires');
        return response.data;
    }
);

// Create new salaires
export const createSalaires = createAsyncThunk(
    'salaires/createSalaires',
    async (salaires, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/salaires', { salaires });
            return salaires;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update existing salaires
export const updateSalaires = createAsyncThunk(
    'salaires/updateSalaires',
    async (salaires, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/salaires', { salaires });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete salaires
export const deleteSalaires = createAsyncThunk(
    'salaires/deleteSalaires',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/salaires', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Export salaires
export const exportSalaires = createAsyncThunk(
    'salaires/exportSalaires',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/salaires/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'salaires.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Import salaires
export const importSalaires = createAsyncThunk(
    'salaires/importSalaires',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/salaires/import', formData, {
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

const salaireSlice = createSlice({
    name: 'salaires',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSalaires.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSalaires.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchSalaires.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createSalaires.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(createSalaires.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })
            .addCase(updateSalaires.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteSalaires.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            })
            .addCase(importSalaires.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            });
    },
});

export default salaireSlice.reducer; 