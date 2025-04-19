import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',              // ou '' si vos routes API ne sont pas préfixées
  withCredentials: true,        // ↔︎ envoie / reçoit le cookie de session
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

// Ajoute automatiquement le token CSRF fourni par Blade
axiosInstance.interceptors.request.use(config => {
  const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
  if (csrf) config.headers['X-CSRF-TOKEN'] = csrf;
  return config;
});

export default axiosInstance;
