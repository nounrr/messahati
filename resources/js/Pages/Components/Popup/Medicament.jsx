import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createMedicaments } from '../../../Redux/medicaments/medicamentSlice';
import { fetchTypeMedicaments } from '../../../Redux/typeMedicaments/typeMedicamentSlice';
import { X, Upload } from 'lucide-react';

function Medicament({ onClose }) {
    const dispatch = useDispatch();
    const { typeMedicaments } = useSelector((state) => state.typeMedicaments);
    const [medicaments, setMedicaments] = useState([{
        nom_medicament: '',
        quantite: '',
        date_expiration: '',
        typemedicaments_id: '',
        prix_unitaire: '',
        image: null
    }]);
    const [imagePreview, setImagePreview] = useState([null]);

    useEffect(() => {
        dispatch(fetchTypeMedicaments());
    }, [dispatch]);

    const handleAddField = () => {
        setMedicaments([...medicaments, {
            nom_medicament: '',
            quantite: '',
            date_expiration: '',
            typemedicaments_id: '',
            prix_unitaire: '',
            image: null
        }]);
        setImagePreview([...imagePreview, null]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...medicaments];
        updated[index][field] = value;
        setMedicaments(updated);
    };

    const handleImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const updated = [...medicaments];
            updated[index].image = file;
            setMedicaments(updated);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedPreviews = [...imagePreview];
                updatedPreviews[index] = reader.result;
                setImagePreview(updatedPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveField = (index) => {
        const updated = [...medicaments];
        updated.splice(index, 1);
        setMedicaments(updated);
        
        const updatedPreviews = [...imagePreview];
        updatedPreviews.splice(index, 1);
        setImagePreview(updatedPreviews);
    };

    const handleSubmit = () => {
        const isValid = medicaments.every(med => 
            med.nom_medicament.trim() !== '' && 
            med.typemedicaments_id !== '' &&
            med.quantite !== '' &&
            med.date_expiration !== ''
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        const formData = new FormData();
        medicaments.forEach((med, index) => {
            formData.append(`medicaments[${index}][nom_medicament]`, med.nom_medicament);
            formData.append(`medicaments[${index}][quantite]`, med.quantite);
            formData.append(`medicaments[${index}][date_expiration]`, med.date_expiration);
            formData.append(`medicaments[${index}][typemedicaments_id]`, med.typemedicaments_id);
            formData.append(`medicaments[${index}][prix_unitaire]`, med.prix_unitaire);
            if (med.image instanceof File) {
                formData.append(`medicaments[${index}][image]`, med.image);
            }
        });

        dispatch(createMedicaments(formData))
            .unwrap()
            .then(() => {
                Swal.fire('Succès', 'Médicaments ajoutés avec succès.', 'success');
                setMedicaments([{
                    nom_medicament: '',
                    quantite: '',
                    date_expiration: '',
                    typemedicaments_id: '',
                    prix_unitaire: '',
                    image: null
                }]);
                setImagePreview([null]);
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
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les Médicaments</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {medicaments.map((med, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {medicaments.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du médicament</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Nom du médicament'
                            value={med.nom_medicament}
                            onChange={(e) => handleChange(index, 'nom_medicament', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type de médicament</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={med.typemedicaments_id}
                            onChange={(e) => handleChange(index, 'typemedicaments_id', e.target.value)}
                        >
                            <option value="">Sélectionnez un type</option>
                            {typeMedicaments.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                        <input
                            type='number'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Quantité'
                            value={med.quantite}
                            onChange={(e) => handleChange(index, 'quantite', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                        <input
                            type='date'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={med.date_expiration}
                            onChange={(e) => handleChange(index, 'date_expiration', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire</label>
                        <input
                            type='number'
                            step="0.01"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Prix unitaire'
                            value={med.prix_unitaire}
                            onChange={(e) => handleChange(index, 'prix_unitaire', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {imagePreview[index] ? (
                                        <img 
                                            src={imagePreview[index]} 
                                            alt="Preview" 
                                            className="h-20 w-auto object-contain mb-2"
                                        />
                                    ) : (
                                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                    )}
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG ou GIF</p>
                                </div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(index, e)}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter un autre médicament
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

export default Medicament; 