import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
            '@components': path.resolve(__dirname, './resources/js/Pages/Components'),
        },
    },
    server: {
        hmr: {
            host: 'localhost',
        },
        watch: {
            usePolling: true,
        },
    },
    optimizeDeps: {
        include: [
            '@iconify/react',
            '@inertiajs/react',
            'flowbite-react',
            'axios',
            'react',
            'react-dom',
            'react-router-dom',
            'bootstrap',
            'laravel-vite-plugin/inertia-helpers'
        ],
        exclude: ['@iconify/react/dist/iconify.js']
    },
    build: {
        commonjsOptions: {
            include: [/node_modules/],
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['react', 'react-dom', 'react-router-dom'],
                    'ui': ['flowbite-react', '@iconify/react'],
                    'bootstrap': ['bootstrap'],
                    'inertia': ['@inertiajs/react', 'laravel-vite-plugin/inertia-helpers']
                }
            }
        }
    },
    css: {
        preprocessorOptions: {
            css: {
                additionalData: `@import "jsvectormap/dist/css/jsvectormap.min.css";`
            }
        }
    }
});
