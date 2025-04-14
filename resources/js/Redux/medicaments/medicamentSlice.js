import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all medicaments
export const fetchMedicaments = createAsyncThunk(
    'medicaments/fetchMedicaments',
    async () => {
        const response = await axiosInstance.get('/medicaments');
        return response.data;
    }
);

// Create new medicaments
export const createMedicaments = createAsyncThunk(
    'medicaments/createMedicaments',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/medicaments', data.medicaments, {
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

// Update existing medicaments
export const updateMedicaments = createAsyncThunk(
    'medicaments/updateMedicaments',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            
            if (Array.isArray(data.medicaments)) {
                data.medicaments.forEach((medicament, index) => {
                    Object.keys(medicament).forEach(key => {
                        if (key === 'image' && medicament[key]) {
                            formData.append(`medicaments[${index}][${key}]`, medicament[key]);
                        } else {
                            formData.append(`medicaments[${index}][${key}]`, medicament[key]);
                        }
                    });
                });
            } else {
                // Fallback for backward compatibility
                data.forEach((medicament, index) => {
                    Object.keys(medicament).forEach(key => {
                        if (key === 'image' && medicament[key]) {
                            formData.append(`medicaments[${index}][${key}]`, medicament[key]);
                        } else {
                            formData.append(`medicaments[${index}][${key}]`, medicament[key]);
                        }
                    });
                });
            }
            
            const response = await axiosInstance.put('/medicaments', formData, {
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

// Delete medicaments
export const deleteMedicaments = createAsyncThunk(
    'medicaments/deleteMedicaments',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/medicaments', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Export medicaments
export const exportMedicaments = createAsyncThunk(
    'medicaments/exportMedicaments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/medicaments/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'medicaments.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Import medicaments
export const importMedicaments = createAsyncThunk(
    'medicaments/importMedicaments',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/medicaments/import', formData, {
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

const medicamentSlice = createSlice({
    name: 'medicaments',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMedicaments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMedicaments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchMedicaments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createMedicaments.fulfilled, (state, action) => {
                if (Array.isArray(action.payload)) {
                    state.items = [...state.items, ...action.payload];
                } else if (action.payload) {
                    state.items.push(action.payload);
                }
            })
            .addCase(createMedicaments.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })
            .addCase(updateMedicaments.fulfilled, (state, action) => {
                const updatedItems = Array.isArray(action.payload) ? action.payload : [action.payload];
                updatedItems.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteMedicaments.fulfilled, (state, action) => {
                const deletedIds = Array.isArray(action.payload?.ids) ? action.payload.ids : [];
                state.items = state.items.filter((item) => !deletedIds.includes(item.id));
            })
            .addCase(importMedicaments.fulfilled, (state, action) => {
                if (Array.isArray(action.payload)) {
                    state.items = [...state.items, ...action.payload];
                } else if (action.payload) {
                    state.items.push(action.payload);
                }
            });
    },
});

export default medicamentSlice.reducer; 