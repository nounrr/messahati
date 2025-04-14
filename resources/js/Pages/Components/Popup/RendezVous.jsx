import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createRendezVous } from '../../../Redux/rendezvous/rendezVousSlice';
import { fetchUsers } from '../../../Redux/users/userSlice';
import { fetchDepartements } from '../../../Redux/departements/departementSlice';
import { fetchTraitements } from '../../../Redux/traitements/traitementSlice';
import { X } from 'lucide-react';

function RendezVous({ onClose }) {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.items);
    const departements = useSelector((state) => state.departements.items);
    const traitements = useSelector((state) => state.traitements.items);
    const [rendezVous, setRendezVous] = useState([{
        patient_id: '',
        docteur_id: '',
        departement_id: '',
        traitement_id: '',
        date_heure: '',
        statut: false
    }]);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchDepartements());
        dispatch(fetchTraitements());
    }, [dispatch]);

    const handleAddField = () => {
        setRendezVous([...rendezVous, {
            patient_id: '',
            docteur_id: '',
            departement_id: '',
            traitement_id: '',
            date_heure: '',
            statut: false
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...rendezVous];
        updated[index][field] = value;
        setRendezVous(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...rendezVous];
        updated.splice(index, 1);
        setRendezVous(updated);
    };

    const handleSubmit = () => {
        const isValid = rendezVous.every(rdv => 
            rdv.patient_id !== '' && 
            rdv.docteur_id !== '' &&
            rdv.departement_id !== '' &&
            rdv.traitement_id !== '' &&
            rdv.date_heure !== ''
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        dispatch(createRendezVous(rendezVous))
            .unwrap()
            .then(() => {
                Swal.fire('Succès', 'Rendez-vous ajoutés avec succès.', 'success');
                setRendezVous([{
                    patient_id: '',
                    docteur_id: '',
                    departement_id: '',
                    traitement_id: '',
                    date_heure: '',
                    statut: false
                }]);
                onClose();
            })
            .catch((error) => {
                console.error('Erreur:', error);
                Swal.fire('Erreur', 'Une erreur s\'est produite.', 'error');
            });
    };

    // Filtrer les utilisateurs pour n'avoir que les patients et les docteurs
    const patients = users.filter(user => user.role === 'patient');
    const docteurs = users.filter(user => user.role === 'docteur');

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
                <X size={22} />
            </button>
            <div className='text-center mb-6'>
                <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-4 w-28 h-auto' />
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les Rendez-vous</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {rendezVous.map((rdv, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {rendezVous.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={rdv.patient_id}
                            onChange={(e) => handleChange(index, 'patient_id', e.target.value)}
                        >
                            <option value="">Sélectionnez un patient</option>
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Docteur</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={rdv.docteur_id}
                            onChange={(e) => handleChange(index, 'docteur_id', e.target.value)}
                        >
                            <option value="">Sélectionnez un docteur</option>
                            {docteurs.map((docteur) => (
                                <option key={docteur.id} value={docteur.id}>
                                    {docteur.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={rdv.departement_id}
                            onChange={(e) => handleChange(index, 'departement_id', e.target.value)}
                        >
                            <option value="">Sélectionnez un département</option>
                            {departements.map((departement) => (
                                <option key={departement.id} value={departement.id}>
                                    {departement.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Traitement</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={rdv.traitement_id}
                            onChange={(e) => handleChange(index, 'traitement_id', e.target.value)}
                        >
                            <option value="">Sélectionnez un traitement</option>
                            {traitements.map((traitement) => (
                                <option key={traitement.id} value={traitement.id}>
                                    {traitement.description}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date et heure</label>
                        <input
                            type='datetime-local'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={rdv.date_heure}
                            onChange={(e) => handleChange(index, 'date_heure', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                checked={rdv.statut}
                                onChange={(e) => handleChange(index, 'statut', e.target.checked)}
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                                Rendez-vous confirmé
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
                    Ajouter un autre rendez-vous
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

export default RendezVous; 