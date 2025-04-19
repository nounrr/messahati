import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAuthUser } from './Redux/auth/authSlice';
import axios from 'axios';

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Get CSRF cookie first
                await axios.get('/sanctum/csrf-cookie');
                // Then attempt to fetch the authenticated user
                dispatch(fetchAuthUser());
            } catch (error) {
                console.error('Error initializing authentication:', error);
            }
        };
        
        initAuth();
    }, [dispatch]);

    return children;
};

export default AuthProvider;
