import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createCertificatsMedicale } from '../../../Redux/certificatsMedicales/certificatMedicalSlice';
import { fetchTypeCertificats } from '../../../Redux/typeCertificats/typeCertificatSlice';
import { fetchTraitements } from '../../../Redux/traitements/traitementSlice';
import { X } from 'lucide-react';

function CertificatMedical({ onClose }) {
    const dispatch = useDispatch();
    const typeCertificats = useSelector((state) => state.typeCertificats.items);
    const traitements = useSelector((state) => state.traitements.items);
    const [certificats, setCertificats] = useState([{
        description: '',
        date_emission: '',
        typecertificat_id: '',
        traitement_id: ''
    }]);

    useEffect(() => {
        dispatch(fetchTypeCertificats());
        dispatch(fetchTraitements());
    }, [dispatch]);

    const handleAddField = () => {
        setCertificats([...certificats, {
            description: '',
            date_emission: '',
            typecertificat_id: '',
            traitement_id: ''
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...certificats];
        updated[index][field] = value;
        setCertificats(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...certificats];
        updated.splice(index, 1);
        setCertificats(updated);
    };

    const handleSubmit = () => {
        const isValid = certificats.every(certificat => 
            certificat.typecertificat_id !== '' && 
            certificat.traitement_id !== '' &&
            certificat.date_emission !== ''
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        dispatch(createCertificatsMedicale(certificats))
            .unwrap()
            .then(() => {
                Swal.fire('Succès', 'Certificats médicaux ajoutés avec succès.', 'success');
                setCertificats([{
                    description: '',
                    date_emission: '',
                    typecertificat_id: '',
                    traitement_id: ''
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
                <h4 className='text-2xl font-semibold mb-1'>Ajoutez les Certificats Médicaux</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {certificats.map((certificat, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {certificats.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type de certificat</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={certificat.typecertificat_id}
                            onChange={(e) => handleChange(index, 'typecertificat_id', e.target.value)}
                        >
                            <option value="">Sélectionnez un type</option>
                            {typeCertificats?.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.type_certificat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Traitement associé</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={certificat.traitement_id}
                            onChange={(e) => handleChange(index, 'traitement_id', e.target.value)}
                        >
                            <option value="">Sélectionnez un traitement</option>
                            {traitements.map((traitement) => (
                                <option key={traitement.id} value={traitement.id}>
                                    {traitement.description}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Description du certificat'
                            rows="3"
                            value={certificat.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                        ></textarea>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date d'émission</label>
                        <input
                            type='date'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={certificat.date_emission}
                            onChange={(e) => handleChange(index, 'date_emission', e.target.value)}
                        />
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter un autre certificat
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

export default CertificatMedical; 