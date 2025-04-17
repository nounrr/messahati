import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Actions asynchrones
export const fetchTypePartenaires = createAsyncThunk(
    'typePartenaires/fetchAll',
    async () => {
        const response = await axios.get('/api/type-partenaires');
        return response.data;
    }
);

export const createTypePartenaire = createAsyncThunk(
    'typePartenaires/create',
    async (typePartenaire) => {
        const response = await axios.post('/api/type-partenaires', typePartenaire);
        return response.data;
    }
);

export const updateTypePartenaire = createAsyncThunk(
    'typePartenaires/update',
    async (typePartenaire) => {
        // Formatage des données pour correspondre à ce qu'attend le contrôleur
        const formattedData = {
            types: [{
                id: typePartenaire.id,
                nom: typePartenaire.nom,
                description: typePartenaire.description
            }]
        };
        
        const response = await axios.put(`/api/type-partenaires/${typePartenaire.id}`, formattedData);
        return response.data;
    }
);

export const deleteTypePartenaires = createAsyncThunk(
    'typePartenaires/delete',
    async (ids) => {
        // Si un seul ID est fourni, supprimer directement
        if (ids.length === 1) {
            const response = await axios.delete(`/api/type-partenaires/${ids[0]}`);
            return { ids };
        }
        
        // Sinon, utiliser une approche différente pour supprimer plusieurs éléments
        const promises = ids.map(id => axios.delete(`/api/type-partenaires/${id}`));
        await Promise.all(promises);
        return { ids };
    }
);

const typePartenaireSlice = createSlice({
    name: 'typePartenaires',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        lastUpdated: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchTypePartenaires.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTypePartenaires.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchTypePartenaires.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Create
            .addCase(createTypePartenaire.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createTypePartenaire.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Si l'API renvoie un tableau de types créés
                if (Array.isArray(action.payload)) {
                    state.items = [...state.items, ...action.payload];
                } else {
                    // Si l'API renvoie un seul type créé
                    state.items.push(action.payload);
                }
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(createTypePartenaire.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Update
            .addCase(updateTypePartenaire.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateTypePartenaire.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Rafraîchir les données après la mise à jour
                // Nous ne pouvons pas mettre à jour directement car le format de réponse est différent
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(updateTypePartenaire.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Delete
            .addCase(deleteTypePartenaires.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteTypePartenaires.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = state.items.filter(item => !action.payload.ids.includes(item.id));
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(deleteTypePartenaires.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default typePartenaireSlice.reducer;
