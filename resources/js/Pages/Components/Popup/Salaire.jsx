import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createSalaires, updateSalaires } from '../../../Redux/salaires/salaireSlice';
import { fetchUsers } from '../../../Redux/users/userSlice';
import { X } from 'lucide-react';

function Salaire({ onClose, salaire = null }) {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.items);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [salaires, setSalaires] = useState([{
        user_id: '',
        montant: '',
        primes: '',
        date: '',
        statut: 'en_attente'
    }]);

    // Liste des mois pour le sélecteur
    const mois = [
        { value: '01', label: 'Janvier' },
        { value: '02', label: 'Février' },
        { value: '03', label: 'Mars' },
        { value: '04', label: 'Avril' },
        { value: '05', label: 'Mai' },
        { value: '06', label: 'Juin' },
        { value: '07', label: 'Juillet' },
        { value: '08', label: 'Août' },
        { value: '09', label: 'Septembre' },
        { value: '10', label: 'Octobre' },
        { value: '11', label: 'Novembre' },
        { value: '12', label: 'Décembre' }
    ];

    // Générer les années (de l'année actuelle à 5 ans en arrière)
    const currentYear = new Date().getFullYear();
    const annees = Array.from({ length: 6 }, (_, i) => currentYear - i);

    useEffect(() => {
        dispatch(fetchUsers());
        
        // Si on est en mode édition, initialiser avec les données du salaire
        if (salaire) {
            const date = new Date(salaire.date);
            setSalaires([{
                id: salaire.id,
                user_id: salaire.user_id || '',
                montant: salaire.montant || '',
                primes: salaire.primes || '',
                date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
                statut: salaire.statut || 'en_attente'
            }]);
        }
    }, [dispatch, salaire]);

    const handleAddField = () => {
        if (salaire) return; // Désactiver l'ajout en mode édition
        setSalaires([...salaires, {
            user_id: '',
            montant: '',
            primes: '',
            date: '',
            statut: 'en_attente'
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...salaires];
        updated[index][field] = value;
        setSalaires(updated);
    };

    const handleRemoveField = (index) => {
        if (salaire) return; // Désactiver la suppression en mode édition
        const updated = [...salaires];
        updated.splice(index, 1);
        setSalaires(updated);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        
        const isValid = salaires.every(salaire => 
            salaire.user_id !== '' && 
            salaire.montant !== '' &&
            salaire.primes !== '' &&
            salaire.date !== ''
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            // Formater les dates pour inclure le jour (01) avant l'envoi
            const formattedSalaires = salaires.map(s => ({
                ...s,
                date: `${s.date}-01` // Ajouter le jour 01 à la date
            }));

            if (salaire) {
                // Mode édition - Envoyer dans le format attendu par le contrôleur
                await dispatch(updateSalaires({
                    salaires: [{
                        id: salaire.id,
                        ...formattedSalaires[0]
                    }]
                })).unwrap();
                Swal.fire('Succès', 'Salaire modifié avec succès.', 'success');
            } else {
                // Mode création
                await dispatch(createSalaires({ salaires: formattedSalaires })).unwrap();
                Swal.fire('Succès', 'Salaires ajoutés avec succès.', 'success');
            }
            onClose();
        } catch (error) {
            console.error('Erreur:', error);
            Swal.fire('Erreur', error.message || 'Une erreur s\'est produite.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <button 
                onClick={onClose} 
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                disabled={isSubmitting}
            >
                <X size={22} />
            </button>
            <div className='text-center mb-6'>
                <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-4 w-28 h-auto' />
                <h4 className='text-2xl font-semibold mb-1'>
                    {salaire ? 'Modifier le salaire' : 'Ajoutez les Salaires'}
                </h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {salaires.map((s, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {!salaire && salaires.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                            disabled={isSubmitting}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employé</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={s.user_id}
                            onChange={(e) => handleChange(index, 'user_id', e.target.value)}
                            required
                            disabled={isSubmitting}
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
                            value={s.montant}
                            onChange={(e) => handleChange(index, 'montant', e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primes</label>
                        <input
                            type="number"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={s.primes}
                            onChange={(e) => handleChange(index, 'primes', e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date (Mois/Année)</label>
                        <div className="flex space-x-2">
                            <select
                                className='w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={s.date ? s.date.split('-')[1] : ''}
                                onChange={(e) => {
                                    const year = s.date ? s.date.split('-')[0] : new Date().getFullYear();
                                    handleChange(index, 'date', `${year}-${e.target.value}`);
                                }}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">Mois</option>
                                {mois.map((mois) => (
                                    <option key={mois.value} value={mois.value}>
                                        {mois.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                className='w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={s.date ? s.date.split('-')[0] : ''}
                                onChange={(e) => {
                                    const month = s.date ? s.date.split('-')[1] : '01';
                                    handleChange(index, 'date', `${e.target.value}-${month}`);
                                }}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">Année</option>
                                {annees.map((annee) => (
                                    <option key={annee} value={annee}>
                                        {annee}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex justify-between mt-4">
                {!salaire && (
                    <button
                        onClick={handleAddField}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        disabled={isSubmitting}
                    >
                        Ajouter un autre salaire
                    </button>
                )}
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Enregistrement...' : (salaire ? 'Modifier' : 'Enregistrer')}
                </button>
            </div>
        </div>
    );
}

export default Salaire; 