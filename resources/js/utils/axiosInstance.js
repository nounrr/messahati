import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api', // URL de base pour toutes les requêtes
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteurs pour gérer les erreurs globales ou ajouter des tokens
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Gérer les erreurs globales ici
        return Promise.reject(error);
    }
);

export default axiosInstance;
