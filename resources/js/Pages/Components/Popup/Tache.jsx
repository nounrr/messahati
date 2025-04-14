import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createTaches } from '../../../Redux/taches/tacheSlice';
import { fetchUsers } from '../../../Redux/users/userSlice';
import { X } from 'lucide-react';

function Tache({ onClose }) {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.users);
    const [taches, setTaches] = useState([{
        title: '',
        user_id: '',
        description: '',
        status: false,
        priority: 'medium',
        date_debut: '',
        date_fin: ''
    }]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleAddField = () => {
        setTaches([...taches, {
            title: '',
            user_id: '',
            description: '',
            status: false,
            priority: 'medium',
            date_debut: '',
            date_fin: ''
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...taches];
        updated[index][field] = value;
        setTaches(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...taches];
        updated.splice(index, 1);
        setTaches(updated);
    };

    const handleSubmit = () => {
        const isValid = taches.every(tache => 
            tache.title.trim() !== '' && 
            tache.user_id !== '' &&
            tache.date_debut !== ''
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        dispatch(createTaches(taches))
            .unwrap()
            .then(() => {
                Swal.fire('Succès', 'Tâches ajoutées avec succès.', 'success');
                setTaches([{
                    title: '',
                    user_id: '',
                    description: '',
                    status: false,
                    priority: 'medium',
                    date_debut: '',
                    date_fin: ''
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
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les Tâches</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {taches.map((tache, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {taches.length > 1 && (
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
                            type='text'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Titre de la tâche'
                            value={tache.title}
                            onChange={(e) => handleChange(index, 'title', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigné à</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={tache.user_id}
                            onChange={(e) => handleChange(index, 'user_id', e.target.value)}
                        >
                            <option value="">Sélectionnez un utilisateur</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Description de la tâche'
                            rows="3"
                            value={tache.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                        ></textarea>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={tache.priority}
                            onChange={(e) => handleChange(index, 'priority', e.target.value)}
                        >
                            <option value="low">Basse</option>
                            <option value="medium">Moyenne</option>
                            <option value="high">Haute</option>
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                checked={tache.status}
                                onChange={(e) => handleChange(index, 'status', e.target.checked)}
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                                Tâche terminée
                            </label>
                        </div>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                        <input
                            type='date'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={tache.date_debut}
                            onChange={(e) => handleChange(index, 'date_debut', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                        <input
                            type='date'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={tache.date_fin}
                            onChange={(e) => handleChange(index, 'date_fin', e.target.value)}
                        />
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter une autre tâche
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

export default Tache; 