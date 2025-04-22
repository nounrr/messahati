import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react/dist/iconify.js';
import axiosInstance from '../../utils/axiosInstance';

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axiosInstance.get('/notifications');
            setNotifications(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications:', error);
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axiosInstance.post(`/notifications/${notificationId}/mark-as-read`);
            // Mettre à jour la liste des notifications
            setNotifications(notifications.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, read_at: new Date().toISOString() }
                    : notification
            ));
        } catch (error) {
            console.error('Erreur lors du marquage de la notification:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await axiosInstance.delete(`/notifications/${notificationId}`);
            // Supprimer la notification de la liste
            setNotifications(notifications.filter(notification => notification.id !== notificationId));
        } catch (error) {
            console.error('Erreur lors de la suppression de la notification:', error);
        }
    };

    if (loading) {
        return (
            <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="card h-100 radius-12 overflow-hidden">
            <div className="card-header bg-white border-bottom-0 p-24">
                <h5 className="mb-0">Notifications</h5>
            </div>
            <div className="card-body p-0">
                {notifications.length === 0 ? (
                    <div className="text-center p-4">
                        <p className="text-muted mb-0">Aucune notification</p>
                    </div>
                ) : (
                    <div className="list-group list-group-flush">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`list-group-item list-group-item-action ${
                                    !notification.read_at ? 'bg-light' : ''
                                }`}
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">{notification.data.title}</h6>
                                        <p className="mb-1 text-muted">{notification.data.message}</p>
                                        <small className="text-muted">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </small>
                                    </div>
                                    <div className="d-flex gap-2">
                                        {!notification.read_at && (
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                <Icon icon="solar:check-circle-outline" />
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => deleteNotification(notification.id)}
                                        >
                                            <Icon icon="solar:trash-bin-trash-outline" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationList; 