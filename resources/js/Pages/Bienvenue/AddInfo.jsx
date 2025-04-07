import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCliniques } from '../../Redux/cliniques/cliniqueSlice';
import UploadWithImagePreview from '@/Components/Child/UploadWithImagePreview';
import UploadWithImagePreviewList from '@/Components/Child/UploadWithImagePreviewList';
import ImageUpload from '@/Components/Child/ImageUpload';

function AddInfo() {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [adresse, setAdresse] = useState('');
    const [logo, setLogo] = useState(null); // Add state for logo
    const dispatch = useDispatch();

    const handleAddClinique = () => {
        if (!nom.trim() || !email.trim() || !telephone.trim() || !adresse.trim() || !logo) {
            alert('Tous les champs sont requis.');
            return;
        }

        const newClinique = {
            nom,
            email,
            telephone,
            adresse,
            site_web,
            logo, // Include logo in the object
        };

        dispatch(createCliniques([newClinique]))
            .then(() => {
                alert('Clinique ajoutée avec succès.');
                setNom('');
                setEmail('');
                setTelephone('');
                setAdresse('');
                setLogo(null); // Reset logo
            })
            .catch((error) => {
                console.error('Erreur lors de l\'ajout de la clinique:', error);
            });
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <div className='w-90 md:w-1/2 mx-auto text-center'>
                <div className="text-center">
                    <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-3' />
                    <h4 className='mb-12'>Personnalisez votre application <br />
                        avec les détails de votre hôpital.</h4>
                    <h6 className='mb-12 text-neutral-500'>Veuillez fournir les informations suivantes :</h6>
                    <div className="flex flex-col sm:flex-row gap-2 justify-between">
                        <div className="mb-3 text-left w-100">
                            <label htmlFor="nom" className="form-label">Nom de l’établissement</label>
                            <input
                                type='text'
                                className='form-control h-56-px bg-white radius-12'
                                placeholder='Nom de l’établissement'
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                            />
                        </div>
                        <div className="mb-3 text-left w-100">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type='email'
                                className='form-control h-56-px bg-white radius-12'
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-between">
                        <div className="mb-3 text-left w-100">
                            <label htmlFor="telephone" className="form-label">Téléphone</label>
                            <input
                                type='number'
                                className='form-control h-56-px bg-white radius-12'
                                placeholder='Téléphone'
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                            />
                        </div>
                        <div className="mb-3 text-left w-100">
                            <label htmlFor="adresse" className="form-label">Adresse</label>
                            <input
                                type='text'
                                className='form-control h-56-px bg-white radius-12'
                                placeholder='Adresse'
                                value={adresse}
                                onChange={(e) => setAdresse(e.target.value)}
                            />
                        </div>
                        
                    </div>
                    <div className="col-12">
                        <label htmlFor="logo" className="form-label text-left justify-start">Téléverser votre Logo</label>
                        <ImageUpload img="votre logo" onImageChange={setLogo} /> {/* Pass setLogo as prop */}
                    </div>

                    <button
                        className='btn-radius btn btn-primary text-sm btn-sm px-2 py-2 w-50 mt-3'
                        onClick={handleAddClinique}
                    >
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddInfo;
