import '../css/app.css';
import '../css/extra.css';
import './bootstrap';
import 'react-quill/dist/quill.snow.css';
import "jsvectormap/dist/css/jsvectormap.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-modal-video/css/modal-video.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RouteScrollToTop from './helper/RouteScrollToTop';
import MasterLayout from './masterLayout/MasterLayout';
import { Provider } from 'react-redux';
import store from './Redux/store';
import AuthProvider from './AuthProvider';
import AuthenticatedLayout from './Layouts/AuthenticatedLayout';
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <Provider store={store}>
        <BrowserRouter>
        <App {...props} />

        </BrowserRouter>

        </Provider>
    
    );
    },
    progress: {
        color: '#4B5563',
    },
});