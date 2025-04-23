import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchOrdonances = createAsyncThunk(
    'ordonances/fetchOrdonances',
    async () => {
        const response = await axiosInstance.get('/api/ordonances');
        return response.data;
    }
);

export const createOrdonance = createAsyncThunk(
    'ordonances/createOrdonance',
    async (ordonance) => {
        const response = await axiosInstance.post('/api/ordonances', ordonance);
        return response.data;
    }
);

export const updateOrdonance = createAsyncThunk(
    'ordonances/updateOrdonance',
    async ({ id, data }) => {
        const response = await axiosInstance.put(`/api/ordonances/${id}`, data);
        return response.data;
    }
);

export const deleteOrdonance = createAsyncThunk(
    'ordonances/deleteOrdonance',
    async (id) => {
        await axiosInstance.delete(`/api/ordonances/${id}`);
        return id;
    }
);

const ordonanceSlice = createSlice({
    name: 'ordonances',
    initialState: {
        items: [],
        status: 'idle',
        error: null
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
            .addCase(createOrdonance.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateOrdonance.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteOrdonance.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    }
});

export default ordonanceSlice.reducer;
