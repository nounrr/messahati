import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchTypePartenaires = createAsyncThunk(
    'typePartenaires/fetchTypePartenaires',
    async () => {
        const response = await axiosInstance.get('/type-partenaires');
        return response.data;
    }
);

export const createTypePartenaires = createAsyncThunk(
    'typePartenaires/createTypePartenaires',
    async (typePartenaires, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/type-partenaires', { types: typePartenaires });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateTypePartenaires = createAsyncThunk(
    'typePartenaires/updateTypePartenaires',
    async (typePartenaires, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/type-partenaires', { types: typePartenaires });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteTypePartenaires = createAsyncThunk(
    'typePartenaires/deleteTypePartenaires',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/type-partenaires', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const typePartenaireSlice = createSlice({
    name: 'typePartenaires',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTypePartenaires.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTypePartenaires.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchTypePartenaires.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createTypePartenaires.fulfilled, (state, action) => {
                if (Array.isArray(action.payload)) {
                    state.items = [...state.items, ...action.payload];
                } else if (action.payload) {
                    state.items.push(action.payload);
                }
            })
            .addCase(updateTypePartenaires.fulfilled, (state, action) => {
                const updatedItems = Array.isArray(action.payload) ? action.payload : [action.payload];
                updatedItems.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteTypePartenaires.fulfilled, (state, action) => {
                const deletedIds = Array.isArray(action.payload?.ids) ? action.payload.ids : [];
                state.items = state.items.filter((item) => !deletedIds.includes(item.id));
            });
    },
});

export default typePartenaireSlice.reducer;
