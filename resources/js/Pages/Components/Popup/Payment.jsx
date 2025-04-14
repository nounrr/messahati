import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { createPayments } from '../../../Redux/payments/paymentSlice';
import { X } from 'lucide-react';

function Payment({ onClose }) {
    const dispatch = useDispatch();
    const [payments, setPayments] = useState([{
        montant: '',
        date_paiement: '',
        mode_paiement: '',
        reference: '',
        description: '',
        statut: 'en_attente'
    }]);

    const handleAddField = () => {
        setPayments([...payments, {
            montant: '',
            date_paiement: '',
            mode_paiement: '',
            reference: '',
            description: '',
            statut: 'en_attente'
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...payments];
        updated[index][field] = value;
        setPayments(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...payments];
        updated.splice(index, 1);
        setPayments(updated);
    };

    const handleSubmit = () => {
        const isValid = payments.every(payment => 
            payment.montant !== '' && 
            payment.date_paiement !== '' &&
            payment.mode_paiement !== '' &&
            payment.reference !== ''
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        dispatch(createPayments(payments))
            .unwrap()
            .then(() => {
                Swal.fire('Succès', 'Paiements ajoutés avec succès.', 'success');
                setPayments([{
                    montant: '',
                    date_paiement: '',
                    mode_paiement: '',
                    reference: '',
                    description: '',
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
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les Paiements</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {payments.map((payment, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {payments.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                        <input
                            type="number"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={payment.montant}
                            onChange={(e) => handleChange(index, 'montant', e.target.value)}
                            placeholder='Entrez le montant'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de paiement</label>
                        <input
                            type="date"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={payment.date_paiement}
                            onChange={(e) => handleChange(index, 'date_paiement', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={payment.mode_paiement}
                            onChange={(e) => handleChange(index, 'mode_paiement', e.target.value)}
                        >
                            <option value="">Sélectionnez un mode de paiement</option>
                            <option value="especes">Espèces</option>
                            <option value="carte">Carte bancaire</option>
                            <option value="virement">Virement</option>
                            <option value="cheque">Chèque</option>
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
                        <input
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={payment.reference}
                            onChange={(e) => handleChange(index, 'reference', e.target.value)}
                            placeholder='Entrez la référence du paiement'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={payment.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                            placeholder='Entrez une description'
                            rows='3'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={payment.statut}
                            onChange={(e) => handleChange(index, 'statut', e.target.value)}
                        >
                            <option value="en_attente">En attente</option>
                            <option value="valide">Validé</option>
                            <option value="annule">Annulé</option>
                        </select>
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter un autre paiement
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

export default Payment; 