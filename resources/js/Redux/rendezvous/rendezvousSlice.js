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
    async (rdvData, { rejectWithValue }) => {
        try {
            // Vérifications minimales
            if (!rdvData.patient_id && !rdvData.newPatient) {
                throw new Error('Un patient doit être spécifié (existant ou nouveau)');
            }
            
            // Liste des champs obligatoires
            const requiredFields = ['date_heure', 'departement_id', 'docteur_id'];
            for (const field of requiredFields) {
                if (rdvData[field] === undefined || rdvData[field] === null || rdvData[field] === '') {
                    throw new Error(`Le champ ${field} est obligatoire`);
                }
            }
            
            // 1. Créer le traitement d'abord si nécessaire
            if (rdvData.nouveau_traitement) {
                console.log('Création d\'un nouveau traitement...');
                
                // S'assurer que les dates sont bien définies
                if (!rdvData.nouveau_traitement.date_debut || !rdvData.nouveau_traitement.date_fin) {
                    // Si les dates ne sont pas définies, utiliser la date du rendez-vous
                    const rendezVousDate = rdvData.date_heure.split('T')[0];
                    rdvData.nouveau_traitement.date_debut = rendezVousDate;
                    rdvData.nouveau_traitement.date_fin = rendezVousDate;
                }
                
                // Vérification des champs requis pour le traitement
                const traitementData = {
                    typetraitement_id: rdvData.nouveau_traitement.typetraitement_id,
                    description: rdvData.nouveau_traitement.description || 'Rendez-vous médical',
                    date_debut: rdvData.nouveau_traitement.date_debut,
                    date_fin: rdvData.nouveau_traitement.date_fin
                };
                
                console.log('Données du traitement à créer:', traitementData);
                
                try {
                    const traitementResponse = await axiosInstance.post('/traitements', {
                        traitements: [traitementData]
                    });
                    
                    console.log('Traitement créé avec succès:', traitementResponse.data);
                    
                    // Associer le nouveau traitement au rendez-vous
                    if (traitementResponse.data && traitementResponse.data.length > 0) {
                        rdvData.traitement_id = traitementResponse.data[0].id;
                    }
                    
                    // Supprimer l'objet nouveau_traitement pour ne pas l'envoyer au backend
                    delete rdvData.nouveau_traitement;
                } catch (traitementError) {
                    console.error('Erreur lors de la création du traitement:', traitementError);
                    
                    let errorMessage = 'Erreur lors de la création du traitement';
                    if (traitementError.response?.data?.message) {
                        errorMessage = traitementError.response.data.message;
                    }
                    
                    return rejectWithValue({
                        message: errorMessage,
                        error: traitementError.response?.data || traitementError.message
                    });
                }
            }
            
            // Préparation des données pour le rendez-vous
            // Copier les données pour ne pas modifier l'objet original
            const rdvToSend = { ...rdvData };
            
            // 2. Créer le rendez-vous après avoir créé le traitement
            const formattedData = {
                rendez_vous: [rdvToSend]
            };
            
            console.log('Données à envoyer au backend pour le rendez-vous:', formattedData);
            
            const response = await axiosInstance.post('/rendez-vous', formattedData);
            console.log('Réponse du backend:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur détaillée:', error);
            if (error.response) {
                console.error('Données d\'erreur du serveur:', error.response.data);
                console.error('Statut HTTP:', error.response.status);
                console.error('Headers:', error.response.headers);
            } else if (error.request) {
                console.error('Requête sans réponse:', error.request);
            } else {
                console.error('Message d\'erreur:', error.message);
            }
            return rejectWithValue(error.response?.data || { message: error.message });
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