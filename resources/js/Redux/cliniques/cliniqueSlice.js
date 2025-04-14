import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchCliniques = createAsyncThunk(
    'cliniques/fetchCliniques',
    async () => {
        const response = await axiosInstance.get('/cliniques');
        return response.data;
    }
);

export const createCliniques = createAsyncThunk(
    'cliniques/createCliniques',
    async (cliniques, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            cliniques.forEach((clinique, index) => {
                Object.entries(clinique).forEach(([key, value]) => {
                    if (key === 'logo' && value instanceof File) {
                        formData.append(`cliniques[${index}][logo]`, value);
                    } else {
                        formData.append(`cliniques[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.post('/cliniques', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateCliniques = createAsyncThunk(
    'cliniques/updateCliniques',
    async (cliniques, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            cliniques.forEach((clinique, index) => {
                Object.entries(clinique).forEach(([key, value]) => {
                    if (key === 'logo' && value instanceof File) {
                        formData.append(`cliniques[${index}][logo]`, value);
                    } else {
                        formData.append(`cliniques[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.post('/cliniques/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteCliniques = createAsyncThunk(
    'cliniques/deleteCliniques',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/cliniques', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const cliniqueSlice = createSlice({
    name: 'cliniques',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCliniques.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCliniques.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchCliniques.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(createCliniques.fulfilled, (state, action) => {
                if (Array.isArray(action.payload)) {
                    state.items = [...state.items, ...action.payload];
                } else if (action.payload) {
                    state.items.push(action.payload);
                }
            })
            .addCase(createCliniques.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })

            .addCase(updateCliniques.fulfilled, (state, action) => {
                const updatedItems = Array.isArray(action.payload) ? action.payload : [action.payload];
                updatedItems.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })

            .addCase(deleteCliniques.fulfilled, (state, action) => {
                const deletedIds = Array.isArray(action.payload?.ids) ? action.payload.ids : [];
                state.items = state.items.filter((item) => !deletedIds.includes(item.id));
            });
    },
});

export default cliniqueSlice.reducer;
