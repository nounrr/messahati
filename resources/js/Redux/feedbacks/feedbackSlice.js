import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Actions asynchrones
export const fetchFeedbacks = createAsyncThunk(
    'feedbacks/fetchFeedbacks',
    async () => {
        const response = await axiosInstance.get('/feedbacks');
        return response.data;
    }
);

export const createFeedback = createAsyncThunk(
    'feedbacks/createFeedback',
    async (feedbackData, { rejectWithValue }) => {
        try {
            // Check if feedbackData is already an array
            const dataToSend = Array.isArray(feedbackData) 
                ? { feedbacks: feedbackData } 
                : { feedbacks: [feedbackData] };
                
            const response = await axiosInstance.post('/feedbacks', dataToSend);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateFeedback = createAsyncThunk(
    'feedbacks/updateFeedback',
    async ({ id, ...feedbackData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/feedbacks/${id}`, feedbackData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteFeedback = createAsyncThunk(
    'feedbacks/deleteFeedback',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/feedbacks/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
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
                state.items.push(...action.payload);
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