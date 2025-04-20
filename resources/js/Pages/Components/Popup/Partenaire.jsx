import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createPartenaire, updatePartenaire } from '../../../Redux/partenaires/partenaireSlice';
import { fetchTypePartenaires } from '../../../Redux/typePartenaires/typePartenaireSlice';
import { X } from 'lucide-react';

function Partenaire({ onClose, partenaire = null }) {
    const dispatch = useDispatch();
    const typePartenaires = useSelector((state) => state.typePartenaires.items);
    const [partenaires, setPartenaires] = useState([{ 
        nom: '', 
        adress: '', 
        telephone: '', 
        typepartenaires_id: '' 
    }]);
    const [isEditMode, setIsEditMode] = useState(false);

    // Initialiser les données si on est en mode édition
    useEffect(() => {
        if (partenaire) {
            setIsEditMode(true);
            setPartenaires([{
                id: partenaire.id,
                nom: partenaire.nom || '',
                adress: partenaire.adress || '',
                telephone: partenaire.telephone || '',
                typepartenaires_id: partenaire.typepartenaires_id || ''
            }]);
        } else {
            setIsEditMode(false);
        }
    }, [partenaire]);

    useEffect(() => {
        dispatch(fetchTypePartenaires());
    }, [dispatch]);

    const handleAddField = () => {
        if (isEditMode) return; // Ne pas permettre d'ajouter des champs en mode édition
        setPartenaires([...partenaires, { 
            nom: '', 
            adress: '', 
            telephone: '', 
            typepartenaires_id: '' 
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...partenaires];
        updated[index][field] = value;
        setPartenaires(updated);
    };

    const handleRemoveField = (index) => {
        if (isEditMode) return; // Ne pas permettre de supprimer des champs en mode édition
        const updated = [...partenaires];
        updated.splice(index, 1);
        setPartenaires(updated);
    };

    const handleSubmit = () => {
        const isValid = partenaires.every(partenaire => 
            partenaire.nom.trim() !== '' && 
            partenaire.typepartenaires_id !== ''
        );
        
        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        if (isEditMode) {
            // Mode édition - mettre à jour un partenaire existant
            const partenaireToUpdate = partenaires[0];
            dispatch(updatePartenaire({ id: partenaireToUpdate.id, data: partenaireToUpdate }))
                .unwrap()
                .then(() => {
                    Swal.fire('Succès', 'Partenaire modifié avec succès.', 'success');
                    onClose();
                })
                .catch((error) => {
                    console.error('Erreur capturée :', error);
                    Swal.fire('Erreur', error.message || 'Une erreur s\'est produite.', 'error');
                });
        } else {
            // Mode création - ajouter de nouveaux partenaires
            const promises = partenaires.map(partenaire => 
                dispatch(createPartenaire(partenaire)).unwrap()
            );

            Promise.all(promises)
                .then(() => {
                    Swal.fire('Succès', 'Partenaires ajoutés avec succès.', 'success');
                    setPartenaires([{ 
                        nom: '', 
                        adress: '', 
                        telephone: '', 
                        typepartenaires_id: '' 
                    }]);
                    onClose();
                })
                .catch((error) => {
                    console.error('Erreur capturée :', error);
                    Swal.fire('Erreur', error.message || 'Une erreur s\'est produite.', 'error');
                });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative my-8">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
                    <X size={22} />
                </button>
                <div className='text-center mb-6'>
                    <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-4 w-28 h-auto' />
                    <h4 className='text-2xl font-semibold mb-1'>{isEditMode ? 'Modifier le Partenaire' : 'Ajoutez les différents Partenaires'}</h4>
                    <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
                </div>

                {partenaires.map((partenaire, index) => (
                    <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                        {!isEditMode && partenaires.length > 1 && (
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
                                required
                            />
                        </div>
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                            <input
                                type='text'
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Adresse'
                                value={partenaire.adress}
                                onChange={(e) => handleChange(index, 'adress', e.target.value)}
                            />
                        </div>
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                            <input
                                type='text'
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Téléphone'
                                value={partenaire.telephone}
                                onChange={(e) => handleChange(index, 'telephone', e.target.value)}
                            />
                        </div>
                    </div>
                ))}

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    {!isEditMode && (
                        <button
                            className='bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                            onClick={handleAddField}
                        >
                            Ajouter un autre partenaire
                        </button>
                    )}
                    <button
                        className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition'
                        onClick={handleSubmit}
                    >
                        {isEditMode ? 'Mettre à jour' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Partenaire; 