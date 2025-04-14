import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createPartenaire } from '../../../Redux/partenaires/partenaireSlice';
import { fetchTypePartenaires } from '../../../Redux/typePartenaires/typePartenaireSlice';
import { X } from 'lucide-react';

function Partenaire({ onClose }) {
    const dispatch = useDispatch();
    const typePartenaires = useSelector((state) => state.typePartenaires.items);
    const [partenaires, setPartenaires] = useState([{ 
        nom: '', 
        adresse: '', 
        email: '', 
        site_web: '', 
        description: '', 
        typepartenaires_id: '' 
    }]);

    useEffect(() => {
        dispatch(fetchTypePartenaires());
    }, [dispatch]);

    const handleAddField = () => {
        setPartenaires([...partenaires, { 
            nom: '', 
            adresse: '', 
            email: '', 
            site_web: '', 
            description: '', 
            typepartenaires_id: '' 
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...partenaires];
        updated[index][field] = value;
        setPartenaires(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...partenaires];
        updated.splice(index, 1);
        setPartenaires(updated);
    };

    const handleSubmit = () => {
        const isValid = partenaires.every(partenaire => 
            partenaire.nom.trim() !== '' && 
            partenaire.adresse.trim() !== '' && 
            partenaire.email.trim() !== '' &&
            partenaire.typepartenaires_id !== ''
        );
        
        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        dispatch(createPartenaire({ partenaires }))
            .unwrap()
            .then((res) => {
                console.log('Réponse reçue :', res);
                Swal.fire('Succès', 'Partenaires ajoutés avec succès.', 'success');
                setPartenaires([{ 
                    nom: '', 
                    adresse: '', 
                    email: '', 
                    site_web: '', 
                    description: '', 
                    typepartenaires_id: '' 
                }]);
                onClose();
            })
            .catch((error) => {
                console.error('Erreur capturée :', error);
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
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les différents Partenaires</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {partenaires.map((partenaire, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {partenaires.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type de partenaire *</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={partenaire.typepartenaires_id}
                            onChange={(e) => handleChange(index, 'typepartenaires_id', e.target.value)}
                            required
                        >
                            <option value="">Sélectionnez un type</option>
                            {typePartenaires.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du partenaire *</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Nom du partenaire'
                            value={partenaire.nom}
                            onChange={(e) => handleChange(index, 'nom', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Adresse'
                            value={partenaire.adresse}
                            onChange={(e) => handleChange(index, 'adresse', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                            type='email'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Email'
                            value={partenaire.email}
                            onChange={(e) => handleChange(index, 'email', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Site web'
                            value={partenaire.site_web}
                            onChange={(e) => handleChange(index, 'site_web', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Description'
                            rows="3"
                            value={partenaire.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                        ></textarea>
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter un autre partenaire
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

export default Partenaire; 