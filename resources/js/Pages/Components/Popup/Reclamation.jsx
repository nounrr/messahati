import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createReclamations } from '../../../Redux/reclamations/reclamationSlice';
import { fetchUsers } from '../../../Redux/users/userSlice';
import { X } from 'lucide-react';

function Reclamation({ onClose }) {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.items);
    const [reclamations, setReclamations] = useState([{
        user_id: '',
        titre: '',
        description: '',
        statut: 'en_attente'
    }]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleAddField = () => {
        setReclamations([...reclamations, {
            user_id: '',
            titre: '',
            description: '',
            statut: 'en_attente'
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...reclamations];
        updated[index][field] = value;
        setReclamations(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...reclamations];
        updated.splice(index, 1);
        setReclamations(updated);
    };

    const handleSubmit = () => {
        const isValid = reclamations.every(reclamation => 
            reclamation.user_id !== '' && 
            reclamation.titre !== '' &&
            reclamation.description !== ''
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        dispatch(createReclamations(reclamations))
            .unwrap()
            .then(() => {
                Swal.fire('Succès', 'Réclamations ajoutées avec succès.', 'success');
                setReclamations([{
                    user_id: '',
                    titre: '',
                    description: '',
                    statut: 'en_attente'
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
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les Réclamations</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {reclamations.map((reclamation, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {reclamations.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={reclamation.user_id}
                            onChange={(e) => handleChange(index, 'user_id', e.target.value)}
                            required
                        >
                            <option value="">Sélectionnez un utilisateur</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.roles?.[0]?.name || 'Sans rôle'})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={reclamation.titre}
                            onChange={(e) => handleChange(index, 'titre', e.target.value)}
                            placeholder='Entrez le titre de la réclamation'
                            required
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={reclamation.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                            placeholder='Entrez la description de la réclamation'
                            rows='4'
                            required
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                checked={reclamation.statut === 'traité'}
                                onChange={(e) => handleChange(index, 'statut', e.target.checked ? 'traité' : 'en_attente')}
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                                Réclamation traitée
                            </label>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter une autre réclamation
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

export default Reclamation; 