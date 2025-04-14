import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { createCharges } from '../../../Redux/charges/chargeSlice';
import { X } from 'lucide-react';

function Charge({ onClose }) {
    const dispatch = useDispatch();
    const [charges, setCharges] = useState([{
        titre: '',
        description: '',
        montant: '',
        date_echeance: '',
        categorie: '',
        statut: 'en_attente'
    }]);

    const handleAddField = () => {
        setCharges([...charges, {
            titre: '',
            description: '',
            montant: '',
            date_echeance: '',
            categorie: '',
            statut: 'en_attente'
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...charges];
        updated[index][field] = value;
        setCharges(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...charges];
        updated.splice(index, 1);
        setCharges(updated);
    };

    const handleSubmit = () => {
        const isValid = charges.every(charge => 
            charge.titre !== '' && 
            charge.montant !== '' &&
            charge.date_echeance !== '' &&
            charge.categorie !== ''
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        dispatch(createCharges(charges))
            .unwrap()
            .then(() => {
                Swal.fire('Succès', 'Charges ajoutées avec succès.', 'success');
                setCharges([{
                    titre: '',
                    description: '',
                    montant: '',
                    date_echeance: '',
                    categorie: '',
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
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les Charges</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {charges.map((charge, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {charges.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                        <input
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={charge.titre}
                            onChange={(e) => handleChange(index, 'titre', e.target.value)}
                            placeholder='Entrez le titre de la charge'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={charge.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                            placeholder='Entrez la description de la charge'
                            rows='3'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                        <input
                            type="number"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={charge.montant}
                            onChange={(e) => handleChange(index, 'montant', e.target.value)}
                            placeholder='Entrez le montant de la charge'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
                        <input
                            type="date"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={charge.date_echeance}
                            onChange={(e) => handleChange(index, 'date_echeance', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={charge.categorie}
                            onChange={(e) => handleChange(index, 'categorie', e.target.value)}
                        >
                            <option value="">Sélectionnez une catégorie</option>
                            <option value="fournitures">Fournitures</option>
                            <option value="equipement">Équipement</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="services">Services</option>
                            <option value="autres">Autres</option>
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={charge.statut}
                            onChange={(e) => handleChange(index, 'statut', e.target.value)}
                        >
                            <option value="en_attente">En attente</option>
                            <option value="paye">Payé</option>
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
                    Ajouter une autre charge
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

export default Charge; 