import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationAsRead, deleteNotification } from '../Redux/notifications/notificationSlice';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const NotificationComponent = ({ onClose }) => {
    const dispatch = useDispatch();
    const { items: notifications, status, error } = useSelector((state) => state.notifications);
    const user = useSelector((state) => state.auth.user);
    const containerRef = useRef(null);

    // Charger les notifications au montage du composant
    useEffect(() => {
        if (user) {
            dispatch(fetchNotifications());
        }
    }, [dispatch, user]);

    // Fermer le composant si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await dispatch(markNotificationAsRead(notificationId)).unwrap();
            toast.success('Notification marquée comme lue');
        } catch (error) {
            toast.error('Erreur lors du marquage de la notification');
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await dispatch(deleteNotification(notificationId)).unwrap();
            toast.success('Notification supprimée');
        } catch (error) {
            toast.error('Erreur lors de la suppression de la notification');
        }
    };

    if (status === 'loading') {
        return (
            <div className="notification-container" ref={containerRef}>
                <div className="notification-header">
                    <h5>Notifications</h5>
                    <button 
                        onClick={onClose}
                        className="btn btn-sm btn-link text-muted p-0"
                    >
                        <Icon icon="solar:close-circle-outline" className="h-5 w-5" />
                    </button>
                </div>
                <div className="notification-list">
                    <div className="text-center p-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        toast.error('Erreur lors du chargement des notifications');
        return null;
    }

    return (
        <div className="notification-container" ref={containerRef}>
            <div className="notification-header">
                <h5>Notifications</h5>
                <div className="d-flex align-items-center">
                    <span className="badge bg-primary me-2">{notifications.length}</span>
                    <button 
                        onClick={onClose}
                        className="btn btn-sm btn-link text-muted p-0"
                    >
                        <Icon icon="solar:close-circle-outline" className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div className="notification-list">
                {notifications.length === 0 ? (
                    <div className="notification-empty">
                        <Icon icon="solar:bell-off-outline" className="notification-icon" />
                        <p>Aucune notification</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div 
                            key={notification.id} 
                            className={`notification-item ${!notification.statut ? 'unread' : ''}`}
                        >
                            <div className="notification-content">
                                <div className="notification-title">
                                    <Icon 
                                        icon={
                                            notification.type === 'success' ? 'solar:check-circle-outline' :
                                            notification.type === 'warning' ? 'solar:warning-outline' :
                                            notification.type === 'error' ? 'solar:danger-triangle-outline' :
                                            'solar:info-circle-outline'
                                        } 
                                        className={`notification-icon ${notification.type}`}
                                    />
                                    <div>
                                        <h6 className="mb-1">{notification.message}</h6>
                                        <small className="notification-time">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </small>
                                    </div>
                                </div>
                                <div className="notification-actions">
                                    {!notification.statut && (
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleMarkAsRead(notification.id)}
                                        >
                                            <Icon icon="solar:check-circle-outline" />
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(notification.id)}
                                    >
                                        <Icon icon="solar:trash-bin-trash-outline" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationComponent; 