import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createTraitements } from '../../../Redux/traitements/traitementSlice';
import { fetchTypeTraitements } from '../../../Redux/typeTraitements/typeTraitementSlice';
import { X } from 'lucide-react';

function Traitement({ onClose }) {
    const dispatch = useDispatch();
    const { typeTraitements } = useSelector((state) => state.typeTraitements);
    const [traitements, setTraitements] = useState([{
        typetraitement_id: '',
        description: '',
        date_debut: '',
        date_fin: ''
    }]);

    useEffect(() => {
        dispatch(fetchTypeTraitements());
    }, [dispatch]);

    const handleAddField = () => {
        setTraitements([...traitements, {
            typetraitement_id: '',
            description: '',
            date_debut: '',
            date_fin: ''
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...traitements];
        updated[index][field] = value;
        setTraitements(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...traitements];
        updated.splice(index, 1);
        setTraitements(updated);
    };

    const handleSubmit = () => {
        const isValid = traitements.every(traitement => 
            traitement.typetraitement_id !== '' && 
            traitement.date_debut !== ''
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        dispatch(createTraitements(traitements))
            .unwrap()
            .then(() => {
                Swal.fire('Succès', 'Traitements ajoutés avec succès.', 'success');
                setTraitements([{
                    typetraitement_id: '',
                    description: '',
                    date_debut: '',
                    date_fin: ''
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
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les Traitements</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {traitements.map((traitement, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {traitements.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type de traitement</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={traitement.typetraitement_id}
                            onChange={(e) => handleChange(index, 'typetraitement_id', e.target.value)}
                        >
                            <option value="">Sélectionnez un type</option>
                            {typeTraitements.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Description du traitement'
                            rows="3"
                            value={traitement.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                        ></textarea>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                        <input
                            type='date'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={traitement.date_debut}
                            onChange={(e) => handleChange(index, 'date_debut', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                        <input
                            type='date'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={traitement.date_fin}
                            onChange={(e) => handleChange(index, 'date_fin', e.target.value)}
                        />
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter un autre traitement
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

export default Traitement; 