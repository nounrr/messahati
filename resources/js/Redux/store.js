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
    },
});

export default store;
