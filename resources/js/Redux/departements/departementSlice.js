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
            await axiosInstance.post('/departements', { departements });
            return departements; // 👈 Retourne les départements qu’on vient d’envoyer
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
            const response = await axiosInstance.put('/departements', { departements });
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
                state.items = action.payload;
            })
            .addCase(fetchDepartements.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // ✅ On ajoute manuellement les départements qu'on a envoyés
            .addCase(createDepartements.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(createDepartements.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })

            .addCase(updateDepartements.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })

            .addCase(deleteDepartements.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            })

            .addCase(importDepartements.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            });
    },
});

export default departementSlice.reducer;
