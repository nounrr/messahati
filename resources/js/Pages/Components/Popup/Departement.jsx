import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createDepartements } from '../../../Redux/departements/departementSlice';

function Departement(props) {
    const [libelle, setLibelle] = useState('');
    const [description, setDescription] = useState('');
    const dispatch = useDispatch();

    const handleAddDepartement = () => {
        if (libelle.trim() === '') {
            alert('Le libellé est requis.');
            return;
        }

        const newDepartement = {
            nom: libelle,
            description: description || '',
        };

        dispatch(createDepartements([newDepartement]))
            .then(() => {
                alert('Département ajouté avec succès.');
                setLibelle('');
                setDescription('');
            })
            .catch((error) => {
                console.error('Erreur lors de l\'ajout du département:', error);
            });
    };

    return (
        <div className='flex flex-col m-auto items-center justify-center w-50 border-4 bg-white '>
            <div className='w-100 md:w-1/2 mx-auto text-center'>
                <div className="text-center">
                    <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-3' />
                    <h4 className='mb-12'>Ajoutez les différents Départements.</h4>
                    <h6 className='mb-12 text-neutral-500'>Veuillez fournir les informations suivantes :</h6>
                    <div className="flex flex-col gap-2 justify-between">
                        <div className="mb-3 text-left w-100">
                            <label htmlFor="libelle" className="form-label">Libellé</label>
                            <input
                                type='text'
                                className='form-control h-56-px bg-white radius-12'
                                placeholder='Libellé'
                                value={libelle}
                                onChange={(e) => setLibelle(e.target.value)}
                            />
                        </div>
                        <div className="mb-3 text-left w-100">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                name="description"
                                cols="30"
                                rows="10"
                                className='form-control h-56-px bg-white radius-12'
                                placeholder='Description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className='btn-radius btn btn-success text-sm btn-sm px-2 py-2 w-50 mt-3'
                            onClick={handleAddDepartement}
                        >
                            Ajouter
                        </button>
                        <button
                            className='btn-radius btn btn-primary text-sm btn-sm px-2 py-2 w-50 mt-3'
                            onClick={props.onNext}
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Departement;