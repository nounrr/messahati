import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createFeedback } from '../../../Redux/feedbacks/feedbackSlice';
import { fetchUsers } from '../../../Redux/users/userSlice';
import { X } from 'lucide-react';

function Feedback({ onClose }) {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.items);
    const [feedbacks, setFeedbacks] = useState([{
        user_id: '',
        titre: '',
        contenu: '',
        note: 5,
        statut: 'en_attente'
    }]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleAddField = () => {
        setFeedbacks([...feedbacks, {
            user_id: '',
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
        const updated = [...feedbacks];
        updated.splice(index, 1);
        setFeedbacks(updated);
    };

    const handleSubmit = () => {
        const isValid = feedbacks.every(feedback => 
            feedback.user_id !== '' && 
            feedback.titre !== '' &&
            feedback.contenu !== ''
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        dispatch(createFeedback(feedbacks))
            .unwrap()
            .then(() => {
                Swal.fire('Succès', 'Feedbacks ajoutés avec succès.', 'success');
                setFeedbacks([{
                    user_id: '',
                    titre: '',
                    contenu: '',
                    note: 5,
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
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les Feedbacks</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {feedbacks.map((feedback, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {feedbacks.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={feedback.user_id}
                            onChange={(e) => handleChange(index, 'user_id', e.target.value)}
                        >
                            <option value="">Sélectionnez un utilisateur</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                        <input
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={feedback.titre}
                            onChange={(e) => handleChange(index, 'titre', e.target.value)}
                            placeholder='Entrez le titre du feedback'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={feedback.contenu}
                            onChange={(e) => handleChange(index, 'contenu', e.target.value)}
                            placeholder='Entrez le contenu du feedback'
                            rows='4'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            className='w-full'
                            value={feedback.note}
                            onChange={(e) => handleChange(index, 'note', parseInt(e.target.value))}
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
                            value={feedback.statut}
                            onChange={(e) => handleChange(index, 'statut', e.target.value)}
                        >
                            <option value="en_attente">En attente</option>
                            <option value="traite">Traité</option>
                            <option value="ignore">Ignoré</option>
                        </select>
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter un autre feedback
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

export default Feedback; 