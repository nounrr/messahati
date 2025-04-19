import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthUser } from '@/Redux/auth/authSlice';

export default function AuthInitializer({ children }) {
    const dispatch = useDispatch();
    const { status } = useSelector(state => state.auth);

    // Vérifier l'authentification au montage du composant
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAuthUser());
        }
    }, []);

    return children;
} 