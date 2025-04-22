import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Configuration d'Axios
const axiosInstance = axios.create({
    baseURL: '/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    withCredentials: true
});

// Thunks
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/notifications');
            return response.data;
        } catch (error) {
            console.error('Erreur détaillée:', error.response);
            return rejectWithValue(error.response?.data || 'Erreur lors de la récupération des notifications');
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId, { rejectWithValue }) => {
        try {
            await axiosInstance.put(`/notifications/${notificationId}/mark-as-read`);
            return notificationId;
        } catch (error) {
            console.error('Erreur détaillée:', error.response);
            return rejectWithValue(error.response?.data || 'Erreur lors du marquage de la notification');
        }
    }
);

export const deleteNotification = createAsyncThunk(
    'notifications/delete',
    async (notificationId, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/notifications/${notificationId}`);
            return notificationId;
        } catch (error) {
            console.error('Erreur détaillée:', error.response);
            return rejectWithValue(error.response?.data || 'Erreur lors de la suppression de la notification');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchNotifications
            .addCase(fetchNotifications.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // markNotificationAsRead
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const notification = state.items.find(item => item.id === action.payload);
                if (notification) {
                    notification.statut = true;
                }
            })
            // deleteNotification
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    }
});

export default notificationSlice.reducer; 