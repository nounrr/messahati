import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchPayments = createAsyncThunk(
    'payments/fetchPayments',
    async () => {
        const response = await axiosInstance.get('/payments');
        return response.data;
    }
);

export const createPayments = createAsyncThunk(
    'payments/createPayments',
    async (payments, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/payments', { payments });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updatePayments = createAsyncThunk(
    'payments/updatePayments',
    async (payments, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/payments', { payments });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deletePayments = createAsyncThunk(
    'payments/deletePayments',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/payments', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const paymentSlice = createSlice({
    name: 'payments',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createPayments.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(updatePayments.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deletePayments.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            });
    },
});

export default paymentSlice.reducer;