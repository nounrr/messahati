import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTypeTraitements } from '../../../Redux/typeTraitements/typeTraitementSlice';

function TypeTraitement() {
    const dispatch = useDispatch();
    const [traitements, setTraitements] = useState([]);
    const [current, setCurrent] = useState({ libelle: '', description: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrent({ ...current, [name]: value });
    };

    const ajouterUnAutre = () => {
        if (current.libelle.trim() === '') return;

        setTraitements([...traitements, current]);
        setCurrent({ libelle: '', description: '' });
    };

    const enregistrer = () => {
        const allTypes = [...traitements];
        if (current.libelle.trim()) {
            allTypes.push(current); // inclure aussi le formulaire courant
        }

        if (allTypes.length > 0) {
            dispatch(createTypeTraitements(allTypes));
            alert('Bien enregistré !');
            setTraitements([]);
            setCurrent({ libelle: '', description: '' });
        }
    };

    return (
        <div className='flex flex-col m-auto items-center justify-center w-50 border-4 bg-white p-6 rounded'>
            <div className='w-full md:w-2/3 mx-auto text-center'>
                <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-3' />
                <h4 className='mb-6'>Ajoutez un type de traitement.</h4>

                {/* Cartes de type task (compactes) */}
                <div className='space-y-2 mb-4 w-full'>
                    {traitements.map((t, index) => (
                        <div key={index} className='flex justify-between items-center border border-gray-300 p-2 rounded-sm bg-gray-50 text-left text-sm'>
                            <div>
                                <strong>{t.libelle}</strong>
                                <p className='text-xs text-gray-600'>{t.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Formulaire d'ajout */}
                <div className="flex flex-col gap-2 border border-gray-300 p-4 rounded-sm">
                    <div className="mb-3 text-left">
                        <label htmlFor="libelle" className="form-label text-sm">Nom</label>
                        <input
                            type='text'
                            name="libelle"
                            className='form-control h-10 bg-white text-sm'
                            placeholder='Libellé'
                            value={current.libelle}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3 text-left">
                        <label htmlFor="description" className="form-label text-sm">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            className='form-control bg-white text-sm'
                            placeholder='Description'
                            value={current.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="flex gap-3 justify-center mt-2">
                        <button
                            className='btn btn-outline-primary text-sm px-3 py-1'
                            onClick={ajouterUnAutre}
                        >
                            + Ajouter un autre
                        </button>

                        <button
                            className='btn btn-success text-sm px-3 py-1'
                            onClick={enregistrer}
                        >
                            Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TypeTraitement;
