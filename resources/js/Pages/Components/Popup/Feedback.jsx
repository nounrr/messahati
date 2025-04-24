import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createFeedback, updateFeedback } from '../../../Redux/feedbacks/feedbackSlice';
import { X, Star } from 'lucide-react';
import { Icon } from '@iconify/react';

function Feedback({ onClose, feedback = null }) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbacks, setFeedbacks] = useState([{
        contenu: feedback?.contenu || '',
        rating: feedback?.rating || 5
    }]);

    const handleAddField = () => {
        if (feedback) return; // Désactiver l'ajout en mode édition
        setFeedbacks([...feedbacks, {
            contenu: '',
            rating: 5
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...feedbacks];
        updated[index][field] = value;
        setFeedbacks(updated);
    };

    // Fonction pour définir la note directement
    const handleSetRating = (index, rating) => {
        handleChange(index, 'rating', rating);
    };

    const handleRemoveField = (index) => {
        if (feedback) return; // Désactiver la suppression en mode édition
        const updated = [...feedbacks];
        updated.splice(index, 1);
        setFeedbacks(updated);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (!user || !user.id) {
            Swal.fire('Erreur', 'Vous devez être connecté pour ajouter un feedback.', 'error');
            return;
        }

        const isValid = feedbacks.every(item => 
            item.contenu && 
            item.contenu.trim() !== '' &&
            item.rating
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            if (feedback) {
                await dispatch(updateFeedback({
                    id: feedback.id,
                    ...feedbacks[0]
                })).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'Le feedback a été modifié avec succès.'
                });
            } else {
                // Ensure all entries have the required fields
                const validatedFeedbacks = feedbacks.map(item => ({
                    contenu: item.contenu.trim(),
                    rating: item.rating || 5,
                    user_id: user.id  // Include the user ID from Redux
                }));
                
                await dispatch(createFeedback(validatedFeedbacks)).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'Les feedbacks ont été créés avec succès.'
                });
            }
            onClose();
        } catch (error) {
            console.error('Erreur:', error);
            let errorMessage = 'Une erreur est survenue lors de l\'opération.';
            
            // Check if there are validation errors
            if (error.errors && Object.keys(error.errors).length > 0) {
                errorMessage = Object.values(error.errors).flat().join('\n');
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
                    {feedback ? 'Modifier le feedback' : 'Ajouter des feedbacks'}
                </h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {feedbacks.map((item, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {!feedback && feedbacks.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                            disabled={isSubmitting}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={item.contenu}
                            onChange={(e) => handleChange(index, 'contenu', e.target.value)}
                            placeholder='Entrez le contenu du feedback'
                            rows='4'
                            disabled={isSubmitting}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                        <div className="flex justify-center items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleSetRating(index, star)}
                                    className="focus:outline-none transition-colors duration-200"
                                    disabled={isSubmitting}
                                    title={`${star} étoile${star > 1 ? 's' : ''}`}
                                >
                                    <Icon 
                                        icon={star <= item.rating ? "material-symbols:star" : "material-symbols:star-outline"}
                                        className={`text-3xl ${star <= item.rating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-500`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="text-center mt-2 text-sm text-gray-600">
                            {item.rating} sur 5
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                {!feedback && (
                    <button
                        className='bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition'
                        onClick={handleAddField}
                        disabled={isSubmitting}
                    >
                        Ajouter un autre feedback
                    </button>
                )}
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                    {isSubmitting ? 'Traitement en cours...' : (feedback ? 'Modifier' : 'Enregistrer')}
                </button>
            </div>
        </div>
    );
}

export default Feedback; 