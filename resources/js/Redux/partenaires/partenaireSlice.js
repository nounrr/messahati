import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchPartenaires = createAsyncThunk(
    'partenaires/fetchPartenaires',
    async () => {
        const response = await axiosInstance.get('/partenaires');
        return response.data;
    }
);

export const createPartenaire = createAsyncThunk(
    'partenaires/createPartenaire',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/partenaires', data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updatePartenaire = createAsyncThunk(
    'partenaires/updatePartenaire',
    async (partenaire, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/partenaires/${partenaire.id}`, { partenaire });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deletePartenaire = createAsyncThunk(
    'partenaires/deletePartenaire',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/partenaires/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const partenaireSlice = createSlice({
    name: 'partenaires',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPartenaires.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPartenaires.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchPartenaires.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createPartenaire.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updatePartenaire.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deletePartenaire.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload.id);
            });
    },
});

export default partenaireSlice.reducer;
