import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    fetchNotifications,
    markNotificationAsRead,
    deleteNotification
} from '@/Redux/notifications/notificationSlice';

const NotificationLayer = () => {
    const dispatch = useDispatch();
    const { items: notifications, status, error } = useSelector((state) => state.notifications);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                await dispatch(fetchNotifications()).unwrap();
            } catch (error) {
                console.error('Erreur lors du chargement des notifications:', error);
                if (error?.message === 'Unauthenticated.') {
                    toast.error('Veuillez vous connecter pour voir vos notifications');
                    // Rediriger vers la page de connexion si nécessaire
                    // window.location.href = '/login';
                } else {
                    toast.error('Erreur lors du chargement des notifications');
                }
            }
        };

        loadNotifications();
    }, [dispatch]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await dispatch(markNotificationAsRead(notificationId)).unwrap();
            toast.success('Notification marquée comme lue');
        } catch (error) {
            console.error('Erreur lors du marquage de la notification:', error);
            if (error?.message === 'Unauthenticated.') {
                toast.error('Veuillez vous connecter pour marquer la notification comme lue');
                // Rediriger vers la page de connexion si nécessaire
                // window.location.href = '/login';
            } else {
                toast.error('Erreur lors du marquage de la notification');
            }
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            await dispatch(deleteNotification(notificationId)).unwrap();
            toast.success('Notification supprimée');
        } catch (error) {
            console.error('Erreur lors de la suppression de la notification:', error);
            if (error?.message === 'Unauthenticated.') {
                toast.error('Veuillez vous connecter pour supprimer la notification');
                // Rediriger vers la page de connexion si nécessaire
                // window.location.href = '/login';
            } else {
                toast.error('Erreur lors de la suppression de la notification');
            }
        }
    };

    return (
        <div className="card h-100 p-0 radius-12 overflow-hidden">
            <div className="card-body p-40">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-0">Notifications</h3>
                </div>

                {status === 'loading' ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                    </div>
                ) : (
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="alert alert-info">
                                Aucune notification pour le moment
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div key={notification.id} className="notification-item p-3 border-bottom">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="mb-1">{notification.type}</h5>
                                            <p className="mb-1">{notification.message}</p>
                                            <small className="text-muted">
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </small>
                                        </div>
                                        <div className="d-flex gap-2">
                                            {!notification.statut && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    Marquer comme lu
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteNotification(notification.id)}
                                                className="btn btn-sm btn-outline-danger"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationLayer;