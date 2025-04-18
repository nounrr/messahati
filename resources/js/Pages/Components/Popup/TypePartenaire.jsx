import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createTypePartenaire, updateTypePartenaire, fetchTypePartenaires } from '../../../Redux/typePartenaires/typePartenaireSlice';
import Swal from 'sweetalert2';
import { X } from 'lucide-react';

const TypePartenaire = ({ onClose, typePartenaire = null }) => {
    const dispatch = useDispatch();
    const [typePartenaires, setTypePartenaires] = useState([{
        nom: '', 
        description: '' 
    }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (typePartenaire) {
            setTypePartenaires([{
                id: typePartenaire.id,
                nom: typePartenaire.nom || '',
                description: typePartenaire.description || ''
            }]);
        }
    }, [typePartenaire]);

    const handleAddField = () => {
        setTypePartenaires([...typePartenaires, { 
            nom: '', 
            description: '' 
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...typePartenaires];
        updated[index][field] = value;
        setTypePartenaires(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...typePartenaires];
        updated.splice(index, 1);
        setTypePartenaires(updated);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        
        const isValid = typePartenaires.every(type => type.nom.trim() !== '');
        if (!isValid) {
            Swal.fire('Erreur', 'Chaque type de partenaire doit avoir un nom.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            if (typePartenaire) {
                
                // Mode modification - Format attendu par le contrôleur
                await dispatch(updateTypePartenaire({ 
                    types: [{
                        id: typePartenaires[0].id, 
                        nom: typePartenaires[0].nom,
                        description: typePartenaires[0].description
                    }]
                })).unwrap();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'Le type de partenaire a été modifié avec succès.'
                });
                
                // Rafraîchir les données après la mise à jour
                await dispatch(fetchTypePartenaires());
            } else {
                // Mode création
                await dispatch(createTypePartenaire({ 
                    types: typePartenaires 
                })).unwrap();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'Les types de partenaires ont été créés avec succès.'
                });
                
                // Rafraîchir les données après la création
                await dispatch(fetchTypePartenaires());
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
                    {typePartenaire ? 'Modifier le type de partenaire' : 'Ajoutez les différents Types de Partenaires'}
                </h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {typePartenaires.map((type, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {typePartenaires.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                            disabled={isSubmitting}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Nom du type de partenaire'
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
                            placeholder='Description du type de partenaire'
                            rows="3"
                            value={type.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                {!typePartenaire && (
                    <button
                        className='bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition'
                        onClick={handleAddField}
                        disabled={isSubmitting}
                    >
                        Ajouter un autre type de partenaire
                    </button>
                )}
                <button
                    className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Traitement en cours...' : (typePartenaire ? 'Modifier' : 'Enregistrer')}
                </button>
            </div>
        </div>
    );
};

export default TypePartenaire; 