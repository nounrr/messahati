import { configureStore } from '@reduxjs/toolkit';
import departementReducer from './departements/departementSlice';
import cliniqueReducer from './cliniques/cliniqueSlice';
import serviceReducer from './services/serviceSlice';
import typeTraitementReducer from './typeTraitements/typeTraitementSlice';
import typePartenaireReducer from './typePartenaires/typePartenaireSlice';
import traitementReducer from './traitements/traitementSlice';
import rendezvousReducer from './rendezvous/rendezvousSlice';
import paymentReducer from './payments/paymentSlice';
import partenaireReducer from './partenaires/partenaireSlice';
import ordonanceReducer from './ordonances/ordonanceSlice';
import userReducer from './users/userSlice';
import medicamentReducer from './medicaments/medicamentSlice';
import typeCertificatReducer from './typeCertificats/typeCertificatSlice';
import tacheReducer from './taches/tacheSlice';
import salaireReducer from './salaires/salaireSlice';
import reclamationReducer from './reclamations/reclamationSlice';
import notificationReducer from './notifications/notificationSlice';
import mutuelReducer from './mutuels/mutuelSlice';
import feedbackReducer from './feedbacks/feedbackSlice';
import typeMedicamentReducer from './typeMedicaments/typeMedicamentSlice';
import permissionReducer from './permissions/permissionSlice';
import roleReducer from './roles/roleSlice';
import modelPermissionReducer from './modelPermissions/modelPermissionSlice';
import chatReducer from './chat/chatSlice';
import authReducer from './auth/authSlice';
import chargeReducer from './charges/chargeSlice';

const store = configureStore({
    reducer: {
        departements: departementReducer,
        cliniques: cliniqueReducer,
        services: serviceReducer,
        typeTraitements: typeTraitementReducer,
        typePartenaires: typePartenaireReducer,
        traitements: traitementReducer,
        rendezvous: rendezvousReducer,
        payments: paymentReducer,
        partenaires: partenaireReducer,
        ordonances: ordonanceReducer,
        users: userReducer,
        medicaments: medicamentReducer,
        typeCertificats: typeCertificatReducer,
        taches: tacheReducer,
        salaires: salaireReducer,
        reclamations: reclamationReducer,
        notifications: notificationReducer,
        mutuels: mutuelReducer,
        feedbacks: feedbackReducer,
        typeMedicaments: typeMedicamentReducer,
        permissions: permissionReducer,
        roles: roleReducer,
        modelPermissions: modelPermissionReducer,
        chat: chatReducer,
        auth: authReducer,
        charges: chargeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
});

export default store;
