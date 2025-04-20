import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchTypeTraitements = createAsyncThunk(
    'typeTraitements/fetchTypeTraitements',
    async () => {
        const response = await axiosInstance.get('/type-traitements');
        return response.data;
    }
);

export const createTypeTraitements = createAsyncThunk(
    'typeTraitements/createTypeTraitements',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/type-traitements', data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateTypeTraitements = createAsyncThunk(
    'typeTraitements/updateTypeTraitements',
    async (data, { rejectWithValue }) => {
        try {
            const { id, ...updateData } = data;
            const response = await axiosInstance.put(`/type-traitements/${id}`, updateData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteTypeTraitements = createAsyncThunk(
    'typeTraitements/deleteTypeTraitements',
    async (ids, { rejectWithValue }) => {
        try {
            // Supposons que nous recevons un tableau avec un seul ID
            const id = ids[0];
            const response = await axiosInstance.delete(`/type-traitements/${id}`);
            return { ids };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const typeTraitementSlice = createSlice({
    name: 'typeTraitements',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTypeTraitements.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTypeTraitements.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTypeTraitements.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createTypeTraitements.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(updateTypeTraitements.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteTypeTraitements.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            });
    },
});

export default typeTraitementSlice.reducer;
