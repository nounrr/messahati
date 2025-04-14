import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchTraitements = createAsyncThunk(
    'traitements/fetchTraitements',
    async () => {
        const response = await axiosInstance.get('/traitements');
        return response.data;
    }
);

export const createTraitements = createAsyncThunk(
    'traitements/createTraitements',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/traitements', data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateTraitements = createAsyncThunk(
    'traitements/updateTraitements',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/traitements', data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteTraitements = createAsyncThunk(
    'traitements/deleteTraitements',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/traitements', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const traitementSlice = createSlice({
    name: 'traitements',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTraitements.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTraitements.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTraitements.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createTraitements.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(updateTraitements.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteTraitements.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            });
    },
});

export default traitementSlice.reducer;