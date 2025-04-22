import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

/* ────────────────────────────────────────────────────────────── */
/*  THUNKS                                                        */
/* ────────────────────────────────────────────────────────────── */

// Vérifie la session courante
export const fetchAuthUser = createAsyncThunk(
    'auth/fetchAuthUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Non authentifié');
            }

            const response = await axiosInstance.get('/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
            }
            return rejectWithValue('Non authentifié');
        }
    }
);

// Déconnexion
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axiosInstance.post('/logout', {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
            }
            localStorage.removeItem('token');
            dispatch(resetAuth());
            return null;
        } catch (error) {
            return rejectWithValue('Erreur lors de la déconnexion');
        }
    }
);

/* ────────────────────────────────────────────────────────────── */
/*  SLICE                                                         */
/* ────────────────────────────────────────────────────────────── */

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        role: null,
        status: 'idle',     // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {
        resetAuth: state => {
            state.user   = null;
            state.role   = null;
            state.status = 'idle';
            state.error  = null;
        },
        resetStatus: state => { state.status = 'idle'; },
        setUser: (state, action) => {
            state.user = action.payload;
            state.role = action.payload?.role || null;
            state.status = 'succeeded';
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAuthUser.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchAuthUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.role = action.payload?.role || null;
            })
            .addCase(fetchAuthUser.rejected, (state, action) => {
                state.status = 'failed';
                state.user = null;
                state.role = null;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, state => {
                state.user = null;
                state.role = null;
                state.status = 'idle';
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { resetAuth, resetStatus, setUser } = authSlice.actions;
export default authSlice.reducer;
