import '../css/app.css';
import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotificationHandler from './components/NotificationHandler';
import TestNotification from './components/TestNotification';
import Chat from './components/Chat';

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
            <Router>
                <div>
                    <NotificationHandler />
                    <Routes>
                        <Route path="/test-notifications" element={<TestNotification />} />
                        <Route path="/chat/:userId" element={<Chat />} />
                        <Route path="/" element={<div>Accueil</div>} />
                    </Routes>
                </div>
            </Router>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
