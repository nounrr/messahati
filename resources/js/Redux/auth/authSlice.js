import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// ✅ 1. Vérifier si l'utilisateur est connecté
export const fetchAuthUser = createAsyncThunk(
    'auth/fetchAuthUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/user');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Non authentifié');
        }
    }
);

// ✅ 2. Déconnexion
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            // 1. Supprimer le token du localStorage
            localStorage.removeItem('auth_token');
            
            // 2. Réinitialiser l'état de l'authentification
            dispatch(resetAuth());
            
            // 3. Effectuer la requête pour la déconnexion via la route web
            await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                credentials: 'same-origin'
            });
            
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Erreur lors de la déconnexion');
        }
    }
);

// Slice d'authentification
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('auth_token') || null,
        status: 'idle',
        error: null,
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('auth_token', action.payload);
        },
        clearToken: (state) => {
            state.token = null;
            state.user = null;
            state.status = 'idle';
            localStorage.removeItem('auth_token');
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = 'succeeded';
        },
        resetAuth: (state) => {
            state.user = null;
            state.token = null;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('auth_token');
        },
        resetStatus: (state) => {
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuthUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAuthUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(fetchAuthUser.rejected, (state, action) => {
                state.status = 'failed';
                state.user = null;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.status = 'idle';
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { setToken, clearToken, setUser, resetAuth, resetStatus } = authSlice.actions;

export default authSlice.reducer;
