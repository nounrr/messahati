import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReclamations, deleteReclamation } from '../../Redux/reclamations/reclamationSlice';
import TableDataLayer from '../Components/tables/TableDataLayer';
import Reclamation from '../Components/Popup/Reclamation';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';

const ListeReclamations = () => {
    const dispatch = useDispatch();
    const reclamations = useSelector((state) => state.reclamations.items);
    const [showModal, setShowModal] = useState(false);
    const [selectedReclamation, setSelectedReclamation] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        dispatch(fetchReclamations());
    }, [dispatch]);

    const handleEdit = (reclamation) => {
        setSelectedReclamation(reclamation);
        setShowModal(true);
    };

    const handleDelete = async (ids) => {
        try {
            await Swal.fire({
                title: 'Êtes-vous sûr?',
                text: "Cette action est irréversible!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, supprimer!',
                cancelButtonText: 'Annuler'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    for (const id of ids) {
                        await dispatch(deleteReclamation(id)).unwrap();
                    }
                    setSelectedRows([]);
                    Swal.fire(
                        'Supprimé!',
                        'Les réclamations ont été supprimées avec succès.',
                        'success'
                    );
                }
            });
        } catch (error) {
            Swal.fire(
                'Erreur!',
                'Une erreur est survenue lors de la suppression.',
                'error'
            );
        }
    };

    const handleBulkDelete = () => {
        if (selectedRows.length === 0) {
            Swal.fire('Attention', 'Veuillez sélectionner des éléments à supprimer', 'warning');
            return;
        }
        handleDelete(selectedRows);
    };

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            width: '80px'
        },
        {
            name: 'Titre',
            selector: row => row.titre,
            sortable: true,
            grow: 1
        },
        {
            name: 'Description',
            selector: row => row.description,
            cell: row => (
                <span title={row.description}>
                    {row.description.length > 50 ? `${row.description.substring(0, 50)}...` : row.description}
                </span>
            ),
            sortable: true,
            grow: 2
        },
        {
            name: 'Utilisateur',
            selector: row => row.user?.name || 'Non assigné',
            sortable: true,
            grow: 1
        },
        {
            name: 'Date',
            selector: row => row.created_at,
            format: row => row.created_at ? new Date(row.created_at).toLocaleDateString('fr-FR') : 'Non définie',
            sortable: true,
            grow: 1
        },
        {
            name: 'Statut',
            selector: row => row.status,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-sm ${
                    row.status === 'En attente' ? 'bg-warning-focus text-warning-main' :
                    row.status === 'Traité' ? 'bg-success-focus text-success-main' :
                    'bg-danger-focus text-danger-main'
                }`}>
                    {row.status}
                </span>
            ),
            sortable: true,
            width: '120px'
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="w-8 h-8 bg-success-focus text-success-main rounded-full flex items-center justify-center"
                        title="Modifier"
                    >
                        <Icon icon="lucide:edit" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="w-8 h-8 bg-danger-focus text-danger-main rounded-full flex items-center justify-center"
                        title="Supprimer"
                    >
                        <Icon icon="mingcute:delete-2-line" />
                    </button>
                    <button
                        className="w-8 h-8 bg-primary-light text-primary-600 rounded-full flex items-center justify-center"
                        title="Voir les détails"
                    >
                        <Icon icon="iconamoon:eye-light" />
                    </button>
                </div>
            ),
            width: '150px',
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Liste des Réclamations</h2>
                <div className="space-x-2">
                    <button
                        onClick={() => {
                            setSelectedReclamation(null);
                            setShowModal(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Ajouter plusieurs réclamations
                    </button>
                    {selectedRows.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                            Supprimer la sélection ({selectedRows.length})
                        </button>
                    )}
                </div>
            </div>
            <TableDataLayer
                columns={columns}
                data={reclamations}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSelectionChange={setSelectedRows}
                enableRowSelection={true}
                title="Liste des Réclamations"
            />
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Reclamation
                        reclamation={selectedReclamation}
                        onClose={() => {
                            setShowModal(false);
                            setSelectedReclamation(null);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ListeReclamations; 