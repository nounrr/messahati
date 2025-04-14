import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all attachements
export const fetchAttachements = createAsyncThunk(
    'attachements/fetchAttachements',
    async () => {
        const response = await axiosInstance.get('/attachements');
        return response.data;
    }
);

// Create new attachements
export const createAttachements = createAsyncThunk(
    'attachements/createAttachements',
    async (attachements, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/attachements', { attachements });
            return attachements;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update existing attachements
export const updateAttachements = createAsyncThunk(
    'attachements/updateAttachements',
    async (attachements, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/attachements', { attachements });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete attachements
export const deleteAttachements = createAsyncThunk(
    'attachements/deleteAttachements',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/attachements', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Export attachements
export const exportAttachements = createAsyncThunk(
    'attachements/exportAttachements',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/attachements/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'attachements.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Import attachements
export const importAttachements = createAsyncThunk(
    'attachements/importAttachements',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/attachements/import', formData, {
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

const attachementSlice = createSlice({
    name: 'attachements',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAttachements.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAttachements.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchAttachements.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createAttachements.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(createAttachements.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })
            .addCase(updateAttachements.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteAttachements.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            })
            .addCase(importAttachements.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            });
    },
});

export default attachementSlice.reducer; 