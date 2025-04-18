import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReclamations, deleteReclamation } from '@/Redux/reclamations/reclamationSlice';
import TableDataLayer from '../Components/tables/TableDataLayer';
import Reclamation from '@/Pages/Components/Popup/Reclamation';
import Swal from 'sweetalert2';

const ListeReclamations = () => {
    const dispatch = useDispatch();
    const { items: reclamations, status, error } = useSelector((state) => state.reclamations);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedReclamation, setSelectedReclamation] = useState(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchReclamations());
        }
    }, [status, dispatch]);

    const handleAdd = () => {
        setSelectedReclamation(null);
        setShowPopup(true);
    };

    const handleEdit = (reclamation) => {
        setSelectedReclamation(reclamation);
        setShowPopup(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Cette action est irréversible !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deleteReclamation(id)).unwrap();
                Swal.fire(
                    'Supprimé !',
                    'La réclamation a été supprimée avec succès.',
                    'success'
                );
            } catch (error) {
                Swal.fire(
                    'Erreur !',
                    'Une erreur est survenue lors de la suppression.',
                    'error'
                );
            }
        }
    };

    const columns = [
        {
            header: 'Sujet',
            accessor: 'sujet',
        },
        {
            header: 'Description',
            accessor: 'description',
        },
        {
            header: 'Statut',
            accessor: 'statut',
            cell: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${value === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                    value === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                    value === 'resolu' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'}`}>
                    {value === 'en_attente' ? 'En attente' :
                     value === 'en_cours' ? 'En cours' :
                     value === 'resolu' ? 'Résolu' :
                     'Rejeté'}
                </span>
            ),
        },
        {
            header: 'Date de création',
            accessor: 'created_at',
            cell: (value) => new Date(value).toLocaleDateString('fr-FR'),
        },
        {
            header: 'Actions',
            accessor: 'id',
            cell: (value, row) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Modifier
                    </button>
                    <button
                        onClick={() => handleDelete(value)}
                        className="text-red-600 hover:text-red-800"
                    >
                        Supprimer
                    </button>
                </div>
            ),
        },
    ];

    if (status === 'loading') {
        return <div>Chargement...</div>;
    }

    if (status === 'failed') {
        return <div>Erreur: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Liste des réclamations</h1>
                <button
                    onClick={handleAdd}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Ajouter une réclamation
                </button>
            </div>

            <TableDataLayer
                data={reclamations}
                columns={columns}
            />

            {showPopup && (
                <Reclamation
                    reclamation={selectedReclamation}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </div>
    );
};

export default ListeReclamations; 