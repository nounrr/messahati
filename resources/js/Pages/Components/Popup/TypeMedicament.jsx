import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { createTypeMedicament, updateTypeMedicament, fetchTypeMedicaments } from '../../../Redux/typeMedicaments/typeMedicamentSlice';
import { X } from 'lucide-react';

function TypeMedicament({ onClose, typeMedicament = null }) {
    const dispatch = useDispatch();
    const [typeMedicaments, setTypeMedicaments] = useState([{ nom: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialiser les données si on est en mode édition
    useEffect(() => {
        if (typeMedicament) {
            setTypeMedicaments([{
                id: typeMedicament.id,
                nom: typeMedicament.nom || '',
                description: typeMedicament.description || ''
            }]);
        }
    }, [typeMedicament]);

    const handleAddField = () => {
        setTypeMedicaments([...typeMedicaments, { nom: '' }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...typeMedicaments];
        updated[index][field] = value;
        setTypeMedicaments(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...typeMedicaments];
        updated.splice(index, 1);
        setTypeMedicaments(updated);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        
        const isValid = typeMedicaments.every(type => type.nom.trim() !== '');
        if (!isValid) {
            Swal.fire('Erreur', 'Chaque type de médicament doit avoir un libellé.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            if (typeMedicament) {
                // Mode modification - Format attendu par le contrôleur
                await dispatch(updateTypeMedicament({ 
                    id: typeMedicament.id, 
                    typeMedicamentData: {
                        typemedicaments: [{
                            id: typeMedicament.id,
                            nom: typeMedicaments[0].nom,
                            description: typeMedicaments[0].description
                        }]
                    }
                })).unwrap();
                
                // Rafraîchir les données après la mise à jour
                await dispatch(fetchTypeMedicaments());
                
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'Le type de médicament a été modifié avec succès.'
                });
            } else {
                // Mode création
                await dispatch(createTypeMedicament({ typemedicaments: typeMedicaments })).unwrap();
                
                // Rafraîchir les données après la création
                await dispatch(fetchTypeMedicaments());
                
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'Les types de médicaments ont été créés avec succès.'
                });
            }
            
            // Fermer le modal après un court délai
            setTimeout(() => {
                onClose();
            }, 500);
        } catch (error) {
            console.error('Erreur lors de l\'opération:', error);
            
            // Afficher un message d'erreur plus détaillé
            let errorMessage = 'Une erreur est survenue lors de l\'opération.';
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Erreur !',
                text: errorMessage
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
                    {typeMedicament ? 'Modifier le type de médicament' : 'Ajoutez les différents Types de Médicaments'}
                </h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {typeMedicaments.map((type, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {typeMedicaments.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                            disabled={isSubmitting}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Libellé</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Libellé'
                            value={type.nom}
                            onChange={(e) => handleChange(index, 'nom', e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Description du type de médicament'
                            rows="3"
                            value={type.description || ''}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                {!typeMedicament && (
                    <button
                        className='bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition'
                        onClick={handleAddField}
                        disabled={isSubmitting}
                    >
                        Ajouter un autre type de médicament
                    </button>
                )}
                <button
                    className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Traitement en cours...' : (typeMedicament ? 'Modifier' : 'Enregistrer')}
                </button>
            </div>
        </div>
    );
}

export default TypeMedicament; 