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
import { Provider } from 'react-redux';
import store from './Redux/store';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    resolve: async (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx');
        const resolvedPage = await resolvePageComponent(`./Pages/${name}.jsx`, pages);

        // Ici, on récupère bien le composant
        const page = resolvedPage.default ?? resolvedPage;

        // Si aucun layout défini, on applique AuthenticatedLayout
        if (!page.layout) {
            page.layout = (pageContent) => (
                <AuthenticatedLayout>{pageContent}</AuthenticatedLayout>
            );
        }

        return page;
    },

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <Provider store={store}>
                <App {...props} />
            </Provider>
        );
    },

    progress: {
        color: '#4B5563',
    },
});
