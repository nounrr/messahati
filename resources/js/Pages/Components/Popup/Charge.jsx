import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createCharges, updateCharges } from '../../../Redux/charges/chargeSlice';
import { fetchPartenaires } from '../../../Redux/partenaires/partenaireSlice';
import { X } from 'lucide-react';

function Charge({ onClose, charge = null }) {
    const dispatch = useDispatch();
    const partenaires = useSelector((state) => state.partenaires.items);
    const [charges, setCharges] = useState([{
        nom: '',
        prix_unitaire: '',
        quantite: '',
        partenaire_id: '',
        status: 'en_attente'
    }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialiser les données si on est en mode édition
    useEffect(() => {
        if (charge) {
            setCharges([{
                id: charge.id,
                nom: charge.nom || '',
                prix_unitaire: charge.prix_unitaire || '',
                quantite: charge.quantite || '',
                partenaire_id: charge.partenaire_id || '',
                status: charge.status || 'en_attente'
            }]);
        }
    }, [charge]);

    useEffect(() => {
        dispatch(fetchPartenaires());
    }, [dispatch]);

    const handleAddField = () => {
        setCharges([...charges, {
            nom: '',
            prix_unitaire: '',
            quantite: '',
            partenaire_id: '',
            status: 'en_attente'
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...charges];
        updated[index][field] = value;
        setCharges(updated);
    };

    const handleRemoveField = (index) => {
        if (charges.length === 1) {
            Swal.fire('Attention', 'Vous devez garder au moins une charge.', 'warning');
            return;
        }
        const updated = [...charges];
        updated.splice(index, 1);
        setCharges(updated);
    };

    const validateCharges = () => {
        const errors = [];
        charges.forEach((charge, index) => {
            if (!charge.nom.trim()) {
                errors.push(`Le nom est requis pour la charge ${index + 1}`);
            }
            if (!charge.prix_unitaire || charge.prix_unitaire <= 0) {
                errors.push(`Le prix unitaire doit être supérieur à 0 pour la charge ${index + 1}`);
            }
            if (!charge.quantite || charge.quantite <= 0) {
                errors.push(`La quantité doit être supérieure à 0 pour la charge ${index + 1}`);
            }
            if (!charge.partenaire_id) {
                errors.push(`Le partenaire est requis pour la charge ${index + 1}`);
            }
        });
        return errors;
    };

    const handleSubmit = async () => {
        const errors = validateCharges();
        if (errors.length > 0) {
            Swal.fire('Erreur de validation', errors.join('<br>'), 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            let result;
            
            if (charge) {
                // Mode édition - mise à jour
                result = await dispatch(updateCharges(charges)).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'Succès',
                    text: 'Charge mise à jour avec succès.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                // Mode création
                result = await dispatch(createCharges(charges)).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'Succès',
                    text: 'Charges ajoutées avec succès.',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            // Réinitialiser le formulaire
            setCharges([{
                nom: '',
                prix_unitaire: '',
                quantite: '',
                partenaire_id: '',
                status: 'en_attente'
            }]);
            
            // Fermer le popup
            onClose();
        } catch (error) {
            console.error('Erreur:', error);
            Swal.fire('Erreur', error.message || 'Une erreur s\'est produite lors de l\'enregistrement.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative my-8">
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                    disabled={isSubmitting}
                >
                    <X size={22} />
                </button>
                <div className='text-center mb-6'>
                    <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-4 w-28 h-auto' />
                    <h4 className='text-2xl font-semibold mb-1'>{charge ? 'Modifier la Charge' : 'Ajoutez les Charges'}</h4>
                    <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
                </div>

                {charges.map((charge, index) => (
                    <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                        {charges.length > 1 && (
                            <button
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveField(index)}
                                disabled={isSubmitting}
                            >
                                <X size={18} />
                            </button>
                        )}
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input
                                type="text"
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={charge.nom}
                                onChange={(e) => handleChange(index, 'nom', e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix Unitaire</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={charge.prix_unitaire}
                                onChange={(e) => handleChange(index, 'prix_unitaire', e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                            <input
                                type="number"
                                min="1"
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={charge.quantite}
                                onChange={(e) => handleChange(index, 'quantite', e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Partenaire</label>
                            <select
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={charge.partenaire_id}
                                onChange={(e) => handleChange(index, 'partenaire_id', e.target.value)}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">Sélectionnez un partenaire</option>
                                {partenaires.map((partenaire) => (
                                    <option key={partenaire.id} value={partenaire.id}>
                                        {partenaire.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={charge.status}
                                onChange={(e) => handleChange(index, 'status', e.target.value)}
                                disabled={isSubmitting}
                            >
                                <option value="en_attente">En attente</option>
                                <option value="paye">Payé</option>
                                <option value="annule">Annulé</option>
                            </select>
                        </div>
                    </div>
                ))}

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    {!charge && (
                        <button
                            className='bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={handleAddField}
                            disabled={isSubmitting}
                        >
                            Ajouter une autre charge
                        </button>
                    )}
                    <button
                        className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Enregistrement...' : charge ? 'Modifier' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Charge; 