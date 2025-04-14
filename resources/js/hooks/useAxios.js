import axios from 'axios';
import { useCallback } from 'react';

const axiosInstance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const useAxios = () => {
    const request = useCallback(async (method, url, data = null) => {
        try {
            const response = await axiosInstance({ method, url, data });
            return response.data;
        } catch (error) {
            // Gérer les erreurs ici
            throw error;
        }
    }, []);

    return { request };
};
