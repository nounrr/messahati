import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createOrdonances } from '../../../Redux/ordonances/ordonanceSlice';
import { fetchTraitements } from '../../../Redux/traitements/traitementSlice';
import { fetchMedicaments } from '../../../Redux/medicaments/medicamentSlice';
import { X } from 'lucide-react';

function Ordonnance({ onClose }) {
    const dispatch = useDispatch();
    const { traitements } = useSelector((state) => state.traitements);
    const { medicaments } = useSelector((state) => state.medicaments);
    const [ordonances, setOrdonances] = useState([{
        description: '',
        date_emission: '',
        traitement_id: '',
        medicaments: []
    }]);

    useEffect(() => {
        dispatch(fetchTraitements());
        dispatch(fetchMedicaments());
    }, [dispatch]);

    const handleAddField = () => {
        setOrdonances([...ordonances, {
            description: '',
            date_emission: '',
            traitement_id: '',
            medicaments: []
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...ordonances];
        updated[index][field] = value;
        setOrdonances(updated);
    };

    const handleMedicamentChange = (index, medicamentId) => {
        const updated = [...ordonances];
        const medicaments = updated[index].medicaments;
        
        if (medicaments.includes(medicamentId)) {
            updated[index].medicaments = medicaments.filter(id => id !== medicamentId);
        } else {
            updated[index].medicaments = [...medicaments, medicamentId];
        }
        
        setOrdonances(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...ordonances];
        updated.splice(index, 1);
        setOrdonances(updated);
    };

    const handleSubmit = () => {
        const isValid = ordonnances.every(ordonance => 
            ordonnance.traitement_id !== '' && 
            ordonnance.date_emission !== '' &&
            ordonnance.medicaments.length > 0
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires et sélectionner au moins un médicament.', 'error');
            return;
        }

        dispatch(createOrdonances(ordonances))
            .unwrap()
            .then(() => {
                Swal.fire('Succès', 'Ordonnances ajoutées avec succès.', 'success');
                setOrdonances([{
                    description: '',
                    date_emission: '',
                    traitement_id: '',
                    medicaments: []
                }]);
                onClose();
            })
            .catch((error) => {
                console.error('Erreur:', error);
                Swal.fire('Erreur', "Une erreur s\'est produite.", 'error');
            });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
                <X size={22} />
            </button>
            <div className='text-center mb-6'>
                <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-4 w-28 h-auto' />
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les Ordonnances</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {ordonances.map((ordonance, index) => (
                
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {ordonances.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Traitement associé</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={ordonance.traitement_id}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Médicaments</label>
                        <div className="grid grid-cols-2 gap-2">
                            {medicaments.map((medicament) => (
                                <div key={medicament.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`medicament-${medicament.id}-${index}`}
                                        checked={ordonance.medicaments.includes(medicament.id)}
                                        onChange={() => handleMedicamentChange(index, medicament.id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={`medicament-${medicament.id}-${index}`} className="ml-2 text-sm text-gray-700">
                                        {medicament.nom}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder="Description de l\'ordonnance"
                            rows="3"
                            value={ordonance.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                        ></textarea>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date d'émission</label>
                        <input
                            type='date'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={ordonance.date_emission}
                            onChange={(e) => handleChange(index, 'date_emission', e.target.value)}
                        />
                    </div>
                </div>    
                
                
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter une autre ordonnance
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

export default Ordonnance; 