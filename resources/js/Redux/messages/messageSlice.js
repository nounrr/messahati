import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all messages
export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async () => {
        const response = await axiosInstance.get('/messages');
        return response.data;
    }
);

// Create new messages
export const createMessages = createAsyncThunk(
    'messages/createMessages',
    async (messages, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/messages', { messages });
            return messages;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update existing messages
export const updateMessages = createAsyncThunk(
    'messages/updateMessages',
    async (messages, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/messages', { messages });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete messages
export const deleteMessages = createAsyncThunk(
    'messages/deleteMessages',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/messages', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Export messages
export const exportMessages = createAsyncThunk(
    'messages/exportMessages',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/messages/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'messages.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Import messages
export const importMessages = createAsyncThunk(
    'messages/importMessages',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/messages/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createMessages.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(createMessages.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })
            .addCase(updateMessages.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteMessages.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            })
            .addCase(importMessages.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            });
    },
});

export default messageSlice.reducer; 