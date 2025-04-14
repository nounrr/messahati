import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all notifications
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async () => {
        const response = await axiosInstance.get('/notifications');
        return response.data;
    }
);

// Create new notifications
export const createNotifications = createAsyncThunk(
    'notifications/createNotifications',
    async (notifications, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            notifications.forEach((notification, index) => {
                Object.entries(notification).forEach(([key, value]) => {
                    if (key === 'image' && value instanceof File) {
                        formData.append(`notifications[${index}][image]`, value);
                    } else {
                        formData.append(`notifications[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.post('/notifications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update existing notifications
export const updateNotifications = createAsyncThunk(
    'notifications/updateNotifications',
    async (notifications, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            notifications.forEach((notification, index) => {
                Object.entries(notification).forEach(([key, value]) => {
                    if (key === 'image' && value instanceof File) {
                        formData.append(`notifications[${index}][image]`, value);
                    } else {
                        formData.append(`notifications[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.put('/notifications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete notifications
export const deleteNotifications = createAsyncThunk(
    'notifications/deleteNotifications',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/notifications', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Export notifications
export const exportNotifications = createAsyncThunk(
    'notifications/exportNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/notifications/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'notifications.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Import notifications
export const importNotifications = createAsyncThunk(
    'notifications/importNotifications',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/notifications/import', formData, {
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

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createNotifications.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(createNotifications.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })
            .addCase(updateNotifications.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteNotifications.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            })
            .addCase(importNotifications.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            });
    },
});

export default notificationSlice.reducer; 