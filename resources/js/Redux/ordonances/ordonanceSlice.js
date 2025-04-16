import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchOrdonances = createAsyncThunk(
    'ordonances/fetchOrdonances',
    async () => {
        const response = await axiosInstance.get('/ordonances');
        return response.data;
    }
);

export const createOrdonances = createAsyncThunk(
    'ordonances/createOrdonances',
    async (ordonances, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/ordonances', { ordonnances: ordonances });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateOrdonances = createAsyncThunk(
    'ordonances/updateOrdonances',
    async (ordonances, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/ordonances', { ordonnances: ordonances });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteOrdonances = createAsyncThunk(
    'ordonances/deleteOrdonances', 
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/ordonances', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const ordonanceSlice = createSlice({
    name: 'ordonances',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrdonances.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrdonances.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchOrdonances.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createOrdonances.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(updateOrdonances.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteOrdonances.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            });
    },
});

export default ordonanceSlice.reducer;
