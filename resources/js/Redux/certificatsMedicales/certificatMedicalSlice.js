import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all medical certificates
export const fetchCertificatsMedicales = createAsyncThunk(
    'certificatsMedicales/fetchCertificatsMedicales',
    async () => {
        const response = await axiosInstance.get('/certificats-medicaux');
        return response.data;
    }
);

// Create new medical certificates
export const createCertificatsMedicale = createAsyncThunk(
    'certificatsMedicales/createCertificatsMedicale',
    async (certificats, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            certificats.forEach((certificat, index) => {
                Object.entries(certificat).forEach(([key, value]) => {
                    formData.append(`certificats[${index}][${key}]`, value);
                });
            });

            const response = await axiosInstance.post('/certificats-medicaux', formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update a medical certificate
export const updateCertificatMedical = createAsyncThunk(
    'certificatsMedicales/updateCertificatMedical',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/certificats-medicaux/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete a medical certificate
export const deleteCertificatMedical = createAsyncThunk(
    'certificatsMedicales/deleteCertificatMedical',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/certificats-medicaux/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    certificatsMedicales: [],
    status: 'idle',
    error: null
};

const certificatMedicalSlice = createSlice({
    name: 'certificatsMedicales',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all medical certificates
            .addCase(fetchCertificatsMedicales.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCertificatsMedicales.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.certificatsMedicales = action.payload;
            })
            .addCase(fetchCertificatsMedicales.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Create new medical certificates
            .addCase(createCertificatsMedicale.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createCertificatsMedicale.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.certificatsMedicales.push(...action.payload);
            })
            .addCase(createCertificatsMedicale.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Update a medical certificate
            .addCase(updateCertificatMedical.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateCertificatMedical.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.certificatsMedicales.findIndex(cert => cert.id === action.payload.id);
                if (index !== -1) {
                    state.certificatsMedicales[index] = action.payload;
                }
            })
            .addCase(updateCertificatMedical.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Delete a medical certificate
            .addCase(deleteCertificatMedical.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteCertificatMedical.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.certificatsMedicales = state.certificatsMedicales.filter(
                    cert => cert.id !== action.payload
                );
            })
            .addCase(deleteCertificatMedical.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default certificatMedicalSlice.reducer; 