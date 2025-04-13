import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all audit log cliniques
export const fetchAuditLogCliniques = createAsyncThunk(
    'auditLogCliniques/fetchAuditLogCliniques',
    async () => {
        const response = await axiosInstance.get('/audit-log-cliniques');
        return response.data;
    }
);

// Create new audit log cliniques
export const createAuditLogCliniques = createAsyncThunk(
    'auditLogCliniques/createAuditLogCliniques',
    async (auditLogCliniques, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/audit-log-cliniques', { auditLogCliniques });
            return auditLogCliniques;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update existing audit log cliniques
export const updateAuditLogCliniques = createAsyncThunk(
    'auditLogCliniques/updateAuditLogCliniques',
    async (auditLogCliniques, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/audit-log-cliniques', { auditLogCliniques });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete audit log cliniques
export const deleteAuditLogCliniques = createAsyncThunk(
    'auditLogCliniques/deleteAuditLogCliniques',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/audit-log-cliniques', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Export audit log cliniques
export const exportAuditLogCliniques = createAsyncThunk(
    'auditLogCliniques/exportAuditLogCliniques',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/audit-log-cliniques/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'audit-log-cliniques.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Import audit log cliniques
export const importAuditLogCliniques = createAsyncThunk(
    'auditLogCliniques/importAuditLogCliniques',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/audit-log-cliniques/import', formData, {
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

const auditLogCliniqueSlice = createSlice({
    name: 'auditLogCliniques',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuditLogCliniques.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAuditLogCliniques.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchAuditLogCliniques.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createAuditLogCliniques.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(createAuditLogCliniques.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })
            .addCase(updateAuditLogCliniques.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteAuditLogCliniques.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            })
            .addCase(importAuditLogCliniques.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            });
    },
});

export default auditLogCliniqueSlice.reducer; 