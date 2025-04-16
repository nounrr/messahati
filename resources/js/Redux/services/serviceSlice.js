import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async () => {
        const response = await axiosInstance.get('/services');
        return response.data;
    }
);

export const createServices = createAsyncThunk(
    'services/createServices',
    async (services, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/services', { services });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateServices = createAsyncThunk(
    'services/updateServices',
    async (services, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/services', { services });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteServices = createAsyncThunk(
    'services/deleteServices',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/services', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const serviceSlice = createSlice({
    name: 'services',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createServices.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(updateServices.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteServices.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            });
    },
});

export default serviceSlice.reducer;
