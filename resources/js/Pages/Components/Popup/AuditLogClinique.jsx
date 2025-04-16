import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { createAuditLogCliniques } from '../../../Redux/auditLogCliniques/auditLogCliniqueSlice';
import { X } from 'lucide-react';

function AuditLogClinique({ onClose }) {
    const dispatch = useDispatch();
    const [logs, setLogs] = useState([{
        action: '',
        description: '',
        user_id: '',
        date_action: '',
        type_action: ''
    }]);

    const handleAddField = () => {
        setLogs([...logs, {
            action: '',
            description: '',
            user_id: '',
            date_action: '',
            type_action: ''
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...logs];
        updated[index][field] = value;
        setLogs(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...logs];
        updated.splice(index, 1);
        setLogs(updated);
    };

    const handleSubmit = () => {
        const isValid = logs.every(log => 
            log.action !== '' && 
            log.description !== '' &&
            log.user_id !== '' &&
            log.date_action !== '' &&
            log.type_action !== ''
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        dispatch(createAuditLogCliniques(logs))
            .unwrap()
            .then(() => {
                Swal.fire('Succès', 'Logs d\'audit ajoutés avec succès.', 'success');
                setLogs([{
                    action: '',
                    description: '',
                    user_id: '',
                    date_action: '',
                    type_action: ''
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
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les Logs d'Audit</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {logs.map((log, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {logs.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                        <input
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={log.action}
                            onChange={(e) => handleChange(index, 'action', e.target.value)}
                            placeholder="Entrez l\'action effectuée"
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={log.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                            placeholder="Entrez la description de l\'action"
                            rows='3'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Utilisateur</label>
                        <input
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={log.user_id}
                            onChange={(e) => handleChange(index, 'user_id', e.target.value)}
                            placeholder="Entrez l\'ID de l\'utilisateur"
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de l'action</label>
                        <input
                            type="datetime-local"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={log.date_action}
                            onChange={(e) => handleChange(index, 'date_action', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type d'action</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={log.type_action}
                            onChange={(e) => handleChange(index, 'type_action', e.target.value)}
                        >
                            <option value="">Sélectionnez un type d'action</option>
                            <option value="creation">Création</option>
                            <option value="modification">Modification</option>
                            <option value="suppression">Suppression</option>
                            <option value="connexion">Connexion</option>
                            <option value="deconnexion">Déconnexion</option>
                        </select>
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter un autre log
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

export default AuditLogClinique; 