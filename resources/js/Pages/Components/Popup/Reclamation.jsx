import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createReclamation, updateReclamation } from '@/Redux/reclamations/reclamationSlice';
import Swal from 'sweetalert2';

const Reclamation = ({ reclamation, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        sujet: '',
        description: '',
        statut: 'en_attente'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (reclamation) {
            setFormData({
                sujet: reclamation.sujet || '',
                description: reclamation.description || '',
                statut: reclamation.statut || 'en_attente'
            });
        }
    }, [reclamation]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (reclamation) {
                await dispatch(updateReclamation({ id: reclamation.id, ...formData })).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'La réclamation a été mise à jour avec succès.',
                });
            } else {
                await dispatch(createReclamation(formData)).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'La réclamation a été créée avec succès.',
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {reclamation ? 'Modifier la réclamation' : 'Nouvelle réclamation'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sujet
                        </label>
                        <input
                            type="text"
                            name="sujet"
                            value={formData.sujet}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Statut
                        </label>
                        <select
                            name="statut"
                            value={formData.statut}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="en_attente">En attente</option>
                            <option value="en_cours">En cours</option>
                            <option value="resolu">Résolu</option>
                            <option value="rejete">Rejeté</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md disabled:opacity-50"
                        >
                            {isSubmitting ? 'Enregistrement...' : (reclamation ? 'Mettre à jour' : 'Créer')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Reclamation; 