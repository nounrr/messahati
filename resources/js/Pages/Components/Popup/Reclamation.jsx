import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReclamation, updateReclamation } from '@/Redux/reclamations/reclamationSlice';
import Swal from 'sweetalert2';
import { X } from 'lucide-react';

const Reclamation = ({ reclamation, onClose }) => {
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reclamations, setReclamations] = useState([{
        titre: reclamation?.titre || '',
        description: reclamation?.description || '',
        statut: 'en_attente'
    }]);

    const handleAddField = () => {
        if (reclamation) return; // Désactiver l'ajout en mode édition
        setReclamations([...reclamations, {
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
        if (reclamation) return; // Désactiver la suppression en mode édition
        const updated = [...reclamations];
        updated.splice(index, 1);
        setReclamations(updated);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        const isValid = reclamations.every(rec => 
            rec.titre && rec.description
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            if (reclamation) {
                await dispatch(updateReclamation({ 
                    id: reclamation.id, 
                    ...reclamations[0] 
                })).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'La réclamation a été mise à jour avec succès.',
                });
            } else {
                await dispatch(createReclamation(reclamations)).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'Les réclamations ont été créées avec succès.',
                });
            }
            onClose();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur !',
                text: error.message || 'Une erreur est survenue lors de l\'opération.',
            });
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
                    {reclamation ? 'Modifier la réclamation' : 'Ajouter des réclamations'}
                </h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {reclamations.map((rec, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {!reclamation && reclamations.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                            disabled={isSubmitting}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sujet
                        </label>
                        <input
                            type="text"
                            value={rec.titre}
                            onChange={(e) => handleChange(index, 'titre', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={rec.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                {!reclamation && (
                    <button
                        className='bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition'
                        onClick={handleAddField}
                        disabled={isSubmitting}
                    >
                        Ajouter une autre réclamation
                    </button>
                )}
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                    {isSubmitting ? 'Traitement en cours...' : (reclamation ? 'Modifier' : 'Enregistrer')}
                </button>
            </div>
        </div>
    );
};

export default Reclamation; 