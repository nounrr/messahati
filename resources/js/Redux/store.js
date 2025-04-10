import { configureStore } from '@reduxjs/toolkit';
import departementReducer from './departements/departementSlice';
import cliniqueReducer from './cliniques/cliniqueSlice';
import serviceReducer from './services/serviceSlice';

const store = configureStore({
    reducer: {
        departements: departementReducer,
        cliniques: cliniqueReducer,
        services: serviceReducer,
    },
});

export default store;
