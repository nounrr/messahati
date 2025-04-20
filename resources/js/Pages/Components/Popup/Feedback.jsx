import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { createFeedback, updateFeedback } from '../../../Redux/feedbacks/feedbackSlice';
import { X } from 'lucide-react';

function Feedback({ onClose, feedback = null }) {
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbacks, setFeedbacks] = useState([{
        titre: feedback?.titre || '',
        contenu: feedback?.contenu || '',
        note: feedback?.note || 5,
        statut: feedback?.statut || 'en_attente'
    }]);

    const handleAddField = () => {
        if (feedback) return; // Désactiver l'ajout en mode édition
        setFeedbacks([...feedbacks, {
            titre: '',
            contenu: '',
            note: 5,
            statut: 'en_attente'
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...feedbacks];
        updated[index][field] = value;
        setFeedbacks(updated);
    };

    const handleRemoveField = (index) => {
        if (feedback) return; // Désactiver la suppression en mode édition
        const updated = [...feedbacks];
        updated.splice(index, 1);
        setFeedbacks(updated);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        const isValid = feedbacks.every(item => 
            item.titre && 
            item.contenu
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
                await dispatch(createFeedback(feedbacks)).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'Les feedbacks ont été créés avec succès.'
                });
            }
            onClose();
        } catch (error) {
            console.error('Erreur:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur !',
                text: error.message || 'Une erreur est survenue lors de l\'opération.'
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                        <input
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={item.titre}
                            onChange={(e) => handleChange(index, 'titre', e.target.value)}
                            placeholder='Entrez le titre du feedback'
                            disabled={isSubmitting}
                            required
                        />
                    </div>
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
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            className='w-full'
                            value={item.note}
                            onChange={(e) => handleChange(index, 'note', parseInt(e.target.value))}
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5</span>
                        </div>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={item.statut}
                            onChange={(e) => handleChange(index, 'statut', e.target.value)}
                            disabled={isSubmitting}
                        >
                            <option value="en_attente">En attente</option>
                            <option value="traite">Traité</option>
                            <option value="ignore">Ignoré</option>
                        </select>
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