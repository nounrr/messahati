import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createMutuels } from '../../../Redux/mutuels/mutuelSlice';
import Swal from 'sweetalert2';
import { X } from 'lucide-react';

const Mutuel = ({ onClose }) => {
    const dispatch = useDispatch();
    const [mutuels, setMutuels] = useState([{ nom_mutuel: '' }]);

    const handleAddField = () => {
        setMutuels([...mutuels, { nom_mutuel: '' }]);
    };

    const handleChange = (index, field, value) => {
        const newMutuels = [...mutuels];
        newMutuels[index][field] = value;
        setMutuels(newMutuels);
    };

    const handleRemoveField = (index) => {
        const newMutuels = mutuels.filter((_, i) => i !== index);
        setMutuels(newMutuels);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        const emptyFields = mutuels.some(mutuel => !mutuel.nom_mutuel.trim());
        if (emptyFields) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez remplir tous les champs',
            });
            return;
        }

        try {
            await dispatch(createMutuels(mutuels)).unwrap();
            Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: 'Mutuelles ajoutées avec succès',
            });
            onClose();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.message || 'Une erreur est survenue',
            });
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
                <X size={22} />
            </button>
            <div className='text-center mb-6'>
                <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-4 w-28 h-auto' />
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les différentes Mutuelles</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {mutuels.map((mutuel, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {mutuels.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la mutuelle</label>
                        <input
                            type="text"
                            value={mutuel.nom_mutuel}
                            onChange={(e) => handleChange(index, 'nom_mutuel', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nom de la mutuelle"
                            required
                        />
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter une autre mutuelle
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
};

export default Mutuel; 