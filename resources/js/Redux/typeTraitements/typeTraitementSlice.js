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
    async (typeTraitements, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/type-traitements', { types: typeTraitements });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateTypeTraitements = createAsyncThunk(
    'typeTraitements/updateTypeTraitements',
    async (typeTraitements, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/type-traitements', { types: typeTraitements });
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
            const response = await axiosInstance.delete('/type-traitements', { data: { ids } });
            return response.data;
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
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteTypeTraitements.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            });
    },
});

export default typeTraitementSlice.reducer;
