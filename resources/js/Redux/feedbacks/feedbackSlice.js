import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Actions asynchrones
export const fetchFeedbacks = createAsyncThunk(
    'feedbacks/fetchFeedbacks',
    async () => {
        const response = await axios.get('/api/feedbacks');
        return response.data;
    }
);

export const createFeedback = createAsyncThunk(
    'feedbacks/createFeedback',
    async (feedbackData) => {
        const response = await axios.post('/api/feedbacks', feedbackData);
        return response.data;
    }
);

export const updateFeedback = createAsyncThunk(
    'feedbacks/updateFeedback',
    async ({ id, ...feedbackData }) => {
        const response = await axios.put(`/api/feedbacks/${id}`, feedbackData);
        return response.data;
    }
);

export const deleteFeedback = createAsyncThunk(
    'feedbacks/deleteFeedback',
    async (id) => {
        await axios.delete(`/api/feedbacks/${id}`);
        return id;
    }
);

// Slice
const feedbackSlice = createSlice({
    name: 'feedbacks',
    initialState: {
        items: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch feedbacks
            .addCase(fetchFeedbacks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFeedbacks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchFeedbacks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Create feedback
            .addCase(createFeedback.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Update feedback
            .addCase(updateFeedback.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete feedback
            .addCase(deleteFeedback.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    }
});

export default feedbackSlice.reducer; 