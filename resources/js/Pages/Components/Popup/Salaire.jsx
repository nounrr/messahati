import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createSalaires } from '../../../Redux/salaires/salaireSlice';
import { fetchUsers } from '../../../Redux/users/userSlice';
import { X } from 'lucide-react';

function Salaire({ onClose }) {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.users);
    const [salaires, setSalaires] = useState([{
        user_id: '',
        montant: '',
        date_paiement: '',
        periode: '',
        statut: 'en_attente'
    }]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleAddField = () => {
        setSalaires([...salaires, {
            user_id: '',
            montant: '',
            date_paiement: '',
            periode: '',
            statut: 'en_attente'
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...salaires];
        updated[index][field] = value;
        setSalaires(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...salaires];
        updated.splice(index, 1);
        setSalaires(updated);
    };

    const handleSubmit = () => {
        const isValid = salaires.every(salaire => 
            salaire.user_id !== '' && 
            salaire.montant !== '' &&
            salaire.date_paiement !== '' &&
            salaire.periode !== ''
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        dispatch(createSalaires(salaires))
            .unwrap()
            .then(() => {
                Swal.fire('Succès', 'Salaires ajoutés avec succès.', 'success');
                setSalaires([{
                    user_id: '',
                    montant: '',
                    date_paiement: '',
                    periode: '',
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
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les Salaires</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {salaires.map((salaire, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {salaires.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employé</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={salaire.user_id}
                            onChange={(e) => handleChange(index, 'user_id', e.target.value)}
                        >
                            <option value="">Sélectionnez un employé</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                        <input
                            type="number"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={salaire.montant}
                            onChange={(e) => handleChange(index, 'montant', e.target.value)}
                            placeholder='Entrez le montant du salaire'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de paiement</label>
                        <input
                            type="date"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={salaire.date_paiement}
                            onChange={(e) => handleChange(index, 'date_paiement', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
                        <input
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={salaire.periode}
                            onChange={(e) => handleChange(index, 'periode', e.target.value)}
                            placeholder='Entrez la période (ex: Janvier 2024)'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={salaire.statut}
                            onChange={(e) => handleChange(index, 'statut', e.target.value)}
                        >
                            <option value="en_attente">En attente</option>
                            <option value="paye">Payé</option>
                            <option value="annule">Annulé</option>
                        </select>
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter un autre salaire
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

export default Salaire; 