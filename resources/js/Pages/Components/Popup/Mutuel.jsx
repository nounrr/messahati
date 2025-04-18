import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createMutuels, updateMutuels, fetchMutuels } from '../../../Redux/mutuels/mutuelSlice';
import Swal from 'sweetalert2';
import { X } from 'lucide-react';

const Mutuel = ({ onClose, mutuel = null }) => {
    const dispatch = useDispatch();
    const [mutuels, setMutuels] = useState([{ nom_mutuel: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (mutuel) {
            setMutuels([{
                id: mutuel.id,
                nom_mutuel: mutuel.nom_mutuel || ''
            }]);
        }
    }, [mutuel]);

    const handleAddField = () => {
        setMutuels([...mutuels, { nom_mutuel: '' }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...mutuels];
        updated[index][field] = value;
        setMutuels(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...mutuels];
        updated.splice(index, 1);
        setMutuels(updated);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        
        const isValid = mutuels.every(mutuel => mutuel.nom_mutuel.trim() !== '');
        if (!isValid) {
            Swal.fire('Erreur', 'Chaque mutuelle doit avoir un nom.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            if (mutuel) {
                // Mode modification
                await dispatch(updateMutuels({ 
                    updates: [{
                        id: mutuels[0].id, 
                        nom_mutuel: mutuels[0].nom_mutuel
                    }]
                })).unwrap();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'La mutuelle a été modifiée avec succès.'
                });
                
                // Rafraîchir les données après la mise à jour
                await dispatch(fetchMutuels());
            } else {
                // Mode création
                await dispatch(createMutuels(mutuels)).unwrap();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'Les mutuelles ont été créées avec succès.'
                });
                
                // Rafraîchir les données après la création
                await dispatch(fetchMutuels());
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
        <div className="relative bg-white rounded-xl shadow-lg p-6">
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
                    {mutuel ? 'Modifier la mutuelle' : 'Ajoutez les différentes Mutuelles'}
                </h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {mutuels.map((mutuel, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {mutuels.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                            disabled={isSubmitting}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la mutuelle *</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Nom de la mutuelle'
                            value={mutuel.nom_mutuel}
                            onChange={(e) => handleChange(index, 'nom_mutuel', e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                {!mutuel && (
                    <button
                        className='bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition'
                        onClick={handleAddField}
                        disabled={isSubmitting}
                    >
                        Ajouter une autre mutuelle
                    </button>
                )}
                <button
                    className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Traitement en cours...' : (mutuel ? 'Modifier' : 'Enregistrer')}
                </button>
            </div>
        </div>
    );
};

export default Mutuel; 