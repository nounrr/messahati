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
    },
});

export default store;
