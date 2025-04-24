
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, logout, resetAuth } from '../Redux/auth/authSlice';
import ChatMainLayer from '@/Pages/Components/Chat/ChatMainLayer';
import NotificationComponent from '../Pages/Components/NotificationComponent';
import { Icon } from '@iconify/react';
import { fetchNotifications, initializePusher, addNotification } from '@/Redux/notifications/notificationSlice';
import MasterLayout from '@/masterLayout/MasterLayout';

export default function AuthenticatedLayout({ header, children }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { auth } = usePage().props;
    const [showNotifications, setShowNotifications] = useState(false);
    const { items: notifications } = useSelector((state) => state.notifications);

     // Initialiser Pusher et charger les notifications
     useEffect(() => {
        if (user) {
            // Charger les notifications existantes
            dispatch(fetchNotifications());

            // Initialiser Pusher
            dispatch(initializePusher(user.id));

            // Écouter les nouvelles notifications
            if (window.Echo) {
                window.Echo.private(`notifications.${user.id}`)
                    .listen('NotificationCreated', (e) => {
                        dispatch(addNotification(e.notification));
                    });
            }

            // Cleanup
            return () => {
                if (window.Echo) {
                    window.Echo.leave(`notifications.${user.id}`);
                }
            };
        }
    }, [dispatch, user]);
    // Synchroniser l'utilisateur Inertia avec Redux
    useEffect(() => {
        if (auth && auth.user && !user) {
            dispatch(setUser(auth.user));
        }
    }, [auth, dispatch, user]);

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // Fonction pour gérer la déconnexion
    const handleLogout = async (e) => {
        e.preventDefault();
        
        try {
            // 1. Nettoyage Redux et localStorage
            dispatch(resetAuth());
            
            // 2. Déconnexion Laravel via Inertia
            await router.post(route('logout'));
            
            // 3. Forcer la réinitialisation du status
            dispatch({ type: 'auth/resetStatus' });
            
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
         
<MasterLayout>
            <main>{children}</main>
            </MasterLayout>
            {/* Chat component */}
            <ChatMainLayer />
        </div>
    );
}
