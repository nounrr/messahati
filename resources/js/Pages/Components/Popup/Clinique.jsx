import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { createCliniques } from '../../../Redux/cliniques/cliniqueSlice';
import { X, Upload } from 'lucide-react';

function Clinique({ onClose }) {
    const dispatch = useDispatch();
    const [cliniques, setCliniques] = useState([{ 
        nom: '', 
        adresse: '', 
        email: '', 
        site_web: '', 
        description: '', 
        logo: null 
    }]);
    const [imagePreview, setImagePreview] = useState([null]);

    const handleAddField = () => {
        setCliniques([...cliniques, { 
            nom: '', 
            adresse: '', 
            email: '', 
            site_web: '', 
            description: '', 
            logo: null 
        }]);
        setImagePreview([...imagePreview, null]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...cliniques];
        updated[index][field] = value;
        setCliniques(updated);
    };

    const handleImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const updated = [...cliniques];
            updated[index].logo = file;
            setCliniques(updated);
            
            // Create preview URL
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
        const updated = [...cliniques];
        updated.splice(index, 1);
        setCliniques(updated);
        
        const updatedPreviews = [...imagePreview];
        updatedPreviews.splice(index, 1);
        setImagePreview(updatedPreviews);
    };

    const handleSubmit = () => {
        const isValid = cliniques.every(clinique => 
            clinique.nom.trim() !== '' && 
            clinique.adresse.trim() !== '' && 
            clinique.email.trim() !== ''
        );
        
        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        dispatch(createCliniques(cliniques))
            .unwrap()
            .then((res) => {
                console.log('Réponse reçue :', res);
                Swal.fire('Succès', 'Cliniques ajoutées avec succès.', 'success');
                setCliniques([{ 
                    nom: '', 
                    adresse: '', 
                    email: '', 
                    site_web: '', 
                    description: '', 
                    logo: null 
                }]);
                setImagePreview([null]);
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
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les différentes Cliniques</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {cliniques.map((clinique, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {cliniques.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la clinique *</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Nom de la clinique'
                            value={clinique.nom}
                            onChange={(e) => handleChange(index, 'nom', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Adresse'
                            value={clinique.adresse}
                            onChange={(e) => handleChange(index, 'adresse', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                            type='email'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Email'
                            value={clinique.email}
                            onChange={(e) => handleChange(index, 'email', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                        <input
                            type='text'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Site web'
                            value={clinique.site_web}
                            onChange={(e) => handleChange(index, 'site_web', e.target.value)}
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Description'
                            rows="3"
                            value={clinique.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                        ></textarea>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
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
                    className='bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter une autre clinique
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

export default Clinique; 