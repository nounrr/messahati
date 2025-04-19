import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

/* ────────────────────────────────────────────────────────────── */
/*  THUNKS                                                        */
/* ────────────────────────────────────────────────────────────── */

// Vérifie la session courante (GET /user → Breeze)
// Renvoie 401 si non connecté
export const fetchAuthUser = createAsyncThunk(
  'auth/fetchAuthUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/user');
      return data;                          // { id, name, email, … }
    } catch {
      return rejectWithValue('Non authentifié');
    }
  }
);

// Déconnexion (POST /logout)
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post('/logout');
      dispatch(resetAuth());
      return null;
    } catch {
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
    status: 'idle',     // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    resetAuth: state => {
      state.user   = null;
      state.status = 'idle';
      state.error  = null;
    },
    resetStatus: state => { state.status = 'idle'; },
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = 'succeeded';
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAuthUser.pending,   s => { s.status = 'loading'; })
      .addCase(fetchAuthUser.fulfilled, (s,a)=>{ s.status='succeeded'; s.user=a.payload; })
      .addCase(fetchAuthUser.rejected,  (s,a)=>{ s.status='failed'; s.user=null; s.error=a.payload; })
      .addCase(logout.fulfilled,        s => { s.user=null; s.status='idle'; })
      .addCase(logout.rejected,         (s,a)=>{ s.error=a.payload; });
  }
});

export const { resetAuth, resetStatus, setUser } = authSlice.actions;
export default authSlice.reducer;
