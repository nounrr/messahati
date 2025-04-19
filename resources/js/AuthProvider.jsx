import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAuthUser } from './Redux/auth/authSlice';
import AuthInitializer from './Components/Auth/AuthInitializer';
import RequireAuth from './Components/Auth/RequireAuth';
import GuestLayout from './Layouts/GuestLayout';

// Liste des chemins qui ne nécessitent pas d'authentification
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAuthUser());
    }, [dispatch]);

    // Vérifier si le chemin actuel est public
    const isPublicPath = PUBLIC_PATHS.includes(window.location.pathname);

    return (
        <AuthInitializer>
            {isPublicPath ? (
                <GuestLayout>{children}</GuestLayout>
            ) : (
                <RequireAuth>{children}</RequireAuth>
            )}
        </AuthInitializer>
    );
};

export default AuthProvider;
