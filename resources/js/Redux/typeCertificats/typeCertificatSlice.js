import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all type certificats
export const fetchTypeCertificats = createAsyncThunk(
    'typeCertificats/fetchTypeCertificats',
    async () => {
        const response = await axiosInstance.get('/type-certificats');
        return response.data;
    }
);

// Create new type certificats
export const createTypeCertificats = createAsyncThunk(
    'typeCertificats/createTypeCertificats',
    async (typeCertificats, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            typeCertificats.forEach((typeCertificat, index) => {
                Object.entries(typeCertificat).forEach(([key, value]) => {
                    if (key === 'image' && value instanceof File) {
                        formData.append(`typeCertificats[${index}][image]`, value);
                    } else {
                        formData.append(`typeCertificats[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.post('/type-certificats', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update existing type certificats
export const updateTypeCertificats = createAsyncThunk(
    'typeCertificats/updateTypeCertificats',
    async (typeCertificats, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            typeCertificats.forEach((typeCertificat, index) => {
                Object.entries(typeCertificat).forEach(([key, value]) => {
                    if (key === 'image' && value instanceof File) {
                        formData.append(`typeCertificats[${index}][image]`, value);
                    } else {
                        formData.append(`typeCertificats[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.put('/type-certificats', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete type certificats
export const deleteTypeCertificats = createAsyncThunk(
    'typeCertificats/deleteTypeCertificats',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/type-certificats', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Export type certificats
export const exportTypeCertificats = createAsyncThunk(
    'typeCertificats/exportTypeCertificats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/type-certificats/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'type-certificats.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Import type certificats
export const importTypeCertificats = createAsyncThunk(
    'typeCertificats/importTypeCertificats',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/type-certificats/import', formData, {
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

const typeCertificatSlice = createSlice({
    name: 'typeCertificats',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTypeCertificats.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTypeCertificats.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTypeCertificats.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createTypeCertificats.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(createTypeCertificats.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })
            .addCase(updateTypeCertificats.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteTypeCertificats.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            })
            .addCase(importTypeCertificats.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            });
    },
});

export default typeCertificatSlice.reducer; 