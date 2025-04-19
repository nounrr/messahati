import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function RequireAuth({ children }) {
    const { user, status } = useSelector(state => state.auth);

    useEffect(() => {
        // Ne rediriger que si l'authentification a échoué ou si l'utilisateur n'est pas authentifié
        if (status === 'failed' || (status === 'succeeded' && !user)) {
            router.get('/login');
        }
    }, [status, user]);

    // Afficher un indicateur de chargement ou rien pendant la vérification
    if (status === 'loading' || status === 'idle') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Si non authentifié, ne rien afficher (la redirection sera gérée par useEffect)
    if (!user) {
        return null;
    }

    // Si authentifié, afficher le contenu dans AuthenticatedLayout
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
} 