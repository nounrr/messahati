import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all départements
export const fetchDepartements = createAsyncThunk(
    'departements/fetchDepartements',
    async () => {
        const response = await axiosInstance.get('/departements');
        return response.data;
    }
);

// Create new départements
export const createDepartements = createAsyncThunk(
    'departements/createDepartements',
    async (departements, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            departements.forEach((departement, index) => {
                formData.append(`departements[${index}][nom]`, departement.nom);
                formData.append(`departements[${index}][description]`, departement.description || '');
                if (departement.image instanceof File) {
                    formData.append(`departements[${index}][image]`, departement.image);
                }
            });

            const response = await axiosInstance.post('/departements', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update existing départements
export const updateDepartements = createAsyncThunk(
    'departements/updateDepartements',
    async (departements, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            departements.forEach((departement, index) => {
                Object.entries(departement).forEach(([key, value]) => {
                    if (key === 'image' && value instanceof File) {
                        formData.append(`departements[${index}][image]`, value);
                    } else {
                        formData.append(`departements[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.post('/departements/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete départements
export const deleteDepartements = createAsyncThunk(
    'departements/deleteDepartements',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/departements', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Export départements
export const exportDepartements = createAsyncThunk(
    'departements/exportDepartements',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/departements/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'departements.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Import départements
export const importDepartements = createAsyncThunk(
    'departements/importDepartements',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/departements/import', formData, {
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

const departementSlice = createSlice({
    name: 'departements',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepartements.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDepartements.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchDepartements.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // ✅ On ajoute manuellement les départements qu'on a envoyés
            .addCase(createDepartements.fulfilled, (state, action) => {
                // Handle both array and single object responses
                if (Array.isArray(action.payload)) {
                    state.items = [...state.items, ...action.payload];
                } else if (action.payload) {
                    state.items.push(action.payload);
                }
            })
            .addCase(createDepartements.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })

            .addCase(updateDepartements.fulfilled, (state, action) => {
                const updatedItems = Array.isArray(action.payload) ? action.payload : [action.payload];
                updatedItems.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })

            .addCase(deleteDepartements.fulfilled, (state, action) => {
                const deletedIds = Array.isArray(action.payload?.ids) ? action.payload.ids : [];
                state.items = state.items.filter((item) => !deletedIds.includes(item.id));
            })

            .addCase(importDepartements.fulfilled, (state, action) => {
                if (Array.isArray(action.payload)) {
                    state.items = [...state.items, ...action.payload];
                } else if (action.payload) {
                    state.items.push(action.payload);
                }
            });
    },
});

export default departementSlice.reducer;
