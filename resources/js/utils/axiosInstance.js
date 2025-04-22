import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
});

// Intercepteur pour ajouter le token à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    // Récupérer le token du localStorage
    const token = localStorage.getItem('token');
    
    // Si le token existe, l'ajouter aux headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ajouter le token CSRF si disponible
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Supprimer le token
      localStorage.removeItem('token');
      
      // Rediriger vers la page de connexion
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
