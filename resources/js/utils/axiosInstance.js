import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api',  
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // ← important pour envoyer les cookies de session Laravel
});

// Intercepteur pour ajouter le token d'authentification aux requêtes
axiosInstance.interceptors.request.use(
    (config) => {
        // Récupérer le token depuis le localStorage
        const token = localStorage.getItem('auth_token');
        
        // Si le token existe, l'ajouter aux headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
