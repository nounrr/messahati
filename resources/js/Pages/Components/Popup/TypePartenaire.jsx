import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { createTypePartenaires } from '../../../Redux/typePartenaires/typePartenaireSlice';
import { X } from 'lucide-react';

function TypePartenaire({ onClose }) {
    const dispatch = useDispatch();
    const [typePartenaires, setTypePartenaires] = useState([{ nom: '', description: '' }]);

    const handleAddField = () => {
        setTypePartenaires([...typePartenaires, { nom: '', description: '' }]);
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

    const handleSubmit = () => {
        const isValid = typePartenaires.every(type => type.nom.trim() !== '');
        if (!isValid) {
            Swal.fire('Erreur', 'Chaque type de partenaire doit avoir un libellé.', 'error');
            return;
        }

        dispatch(createTypePartenaires({ types: typePartenaires }))
            .unwrap()
            .then((res) => {
                console.log('Réponse reçue :', res);
                Swal.fire('Succès', 'Types de partenaires ajoutés avec succès.', 'success');
                setTypePartenaires([{ nom: '', description: '' }]);
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
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les différents Types de Partenaires</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {typePartenaires.map((type, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {typePartenaires.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Libellé</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Libellé'
                            value={type.nom}
                            onChange={(e) => handleChange(index, 'nom', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Description'
                            rows="3"
                            value={type.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                        ></textarea>
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter un autre type de partenaire
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

export default TypePartenaire; 