import axios from 'axios';
import { useCallback } from 'react';

const axiosInstance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
});

// Intercepteur pour ajouter le token d'authentification
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Si le token est invalide ou expiré
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const useAxios = () => {
    const request = useCallback(async (method, url, data = null) => {
        try {
            const response = await axiosInstance({
                method,
                url,
                data,
                validateStatus: function (status) {
                    return status >= 200 && status < 500; // Accepter toutes les réponses sauf les erreurs serveur
                }
            });

            if (response.status >= 400) {
                throw new Error(response.data.message || 'Une erreur est survenue');
            }

            return response.data;
        } catch (error) {
            if (error.response) {
                console.error('Erreur de réponse:', error.response.data);
                console.error('Status:', error.response.status);
                console.error('Headers:', error.response.headers);
            } else if (error.request) {
                console.error('Erreur de requête:', error.request);
            } else {
                console.error('Erreur:', error.message);
            }
            throw error;
        }
    }, []);

    return { request };
};