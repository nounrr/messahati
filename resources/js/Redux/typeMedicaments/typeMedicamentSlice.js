import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create async thunks for API calls
export const fetchTypeMedicaments = createAsyncThunk(
    'typeMedicaments/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/type-medicaments');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createTypeMedicament = createAsyncThunk(
    'typeMedicaments/create',
    async (typeMedicamentData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/type-medicaments', typeMedicamentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateTypeMedicament = createAsyncThunk(
    'typeMedicaments/update',
    async ({ id, typeMedicamentData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/type-medicaments/${id}`, typeMedicamentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteTypeMedicament = createAsyncThunk(
    'typeMedicaments/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/type-medicaments/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    typeMedicaments: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    loading: false,
};

const typeMedicamentSlice = createSlice({
    name: 'typeMedicaments',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all type medicaments
            .addCase(fetchTypeMedicaments.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
            })
            .addCase(fetchTypeMedicaments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.typeMedicaments = Array.isArray(action.payload) ? action.payload : [];
                state.loading = false;
            })
            .addCase(fetchTypeMedicaments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.loading = false;
            })
            // Create type medicament
            .addCase(createTypeMedicament.pending, (state) => {
                state.loading = true;
            })
            .addCase(createTypeMedicament.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    if (Array.isArray(action.payload)) {
                        state.typeMedicaments = [...state.typeMedicaments, ...action.payload];
                    } else {
                        state.typeMedicaments.push(action.payload);
                    }
                }
            })
            .addCase(createTypeMedicament.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update type medicament
            .addCase(updateTypeMedicament.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTypeMedicament.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    const index = state.typeMedicaments.findIndex(
                        (type) => type.id === action.payload.id
                    );
                    if (index !== -1) {
                        state.typeMedicaments[index] = action.payload;
                    }
                }
            })
            .addCase(updateTypeMedicament.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete type medicament
            .addCase(deleteTypeMedicament.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteTypeMedicament.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.typeMedicaments = state.typeMedicaments.filter(
                        (type) => type.id !== action.payload
                    );
                }
            })
            .addCase(deleteTypeMedicament.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = typeMedicamentSlice.actions;

export default typeMedicamentSlice.reducer; 