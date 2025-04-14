import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { createNotifications } from '../../../Redux/notifications/notificationSlice';
import { X } from 'lucide-react';

function Notification({ onClose }) {
    const dispatch = useDispatch();
    const [notifications, setNotifications] = useState([{
        titre: '',
        message: '',
        type: 'info',
        statut: 'non_lu'
    }]);

    const handleAddField = () => {
        setNotifications([...notifications, {
            titre: '',
            message: '',
            type: 'info',
            statut: 'non_lu'
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...notifications];
        updated[index][field] = value;
        setNotifications(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...notifications];
        updated.splice(index, 1);
        setNotifications(updated);
    };

    const handleSubmit = () => {
        const isValid = notifications.every(notification => 
            notification.titre !== '' && 
            notification.message !== '' &&
            notification.type !== ''
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        dispatch(createNotifications(notifications))
            .unwrap()
            .then(() => {
                Swal.fire('Succès', 'Notifications créées avec succès.', 'success');
                setNotifications([{
                    titre: '',
                    message: '',
                    type: 'info',
                    statut: 'non_lu'
                }]);
                onClose();
            })
            .catch((error) => {
                console.error('Erreur:', error);
                Swal.fire('Erreur', 'Une erreur s\'est produite.', 'error');
            });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
                <X size={22} />
            </button>
            <div className='text-center mb-6'>
                <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-4 w-28 h-auto' />
                <h4 className='text-2xl font-semibold mb-1'>Créez des Notifications</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {notifications.map((notification, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {notifications.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                        <input
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={notification.titre}
                            onChange={(e) => handleChange(index, 'titre', e.target.value)}
                            placeholder='Entrez le titre de la notification'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={notification.message}
                            onChange={(e) => handleChange(index, 'message', e.target.value)}
                            placeholder='Entrez le message de la notification'
                            rows='4'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={notification.type}
                            onChange={(e) => handleChange(index, 'type', e.target.value)}
                        >
                            <option value="info">Information</option>
                            <option value="success">Succès</option>
                            <option value="warning">Avertissement</option>
                            <option value="error">Erreur</option>
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={notification.statut}
                            onChange={(e) => handleChange(index, 'statut', e.target.value)}
                        >
                            <option value="non_lu">Non lu</option>
                            <option value="lu">Lu</option>
                        </select>
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter une autre notification
                </button>
                <button
                    className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleSubmit}
                >
                    Enregistrer
                </button>
            </div>
        </div>
    );
}

export default Notification; 