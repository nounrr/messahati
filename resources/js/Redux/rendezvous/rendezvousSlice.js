import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchRendezVous = createAsyncThunk(
    'rendezvous/fetchRendezVous',
    async () => {
        const response = await axiosInstance.get('/rendez-vous');
        return response.data;
    }
);

export const createRendezVous = createAsyncThunk(
    'rendezvous/createRendezVous',
    async (rendezVous, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/rendez-vous', { rendez_vous: rendezVous });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateRendezVous = createAsyncThunk(
    'rendezvous/updateRendezVous',
    async (updates, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/rendez-vous', { updates });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteRendezVous = createAsyncThunk(
    'rendezvous/deleteRendezVous',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/rendez-vous', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const rendezvousSlice = createSlice({
    name: 'rendezvous',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRendezVous.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRendezVous.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchRendezVous.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createRendezVous.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(updateRendezVous.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteRendezVous.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            });
    },
});

export default rendezvousSlice.reducer;