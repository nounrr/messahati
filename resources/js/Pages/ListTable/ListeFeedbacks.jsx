import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks, deleteFeedback } from '../../Redux/feedbacks/feedbackSlice';
import TableDataLayer from '../Components/tables/TableDataLayer';
import Feedback from '../Components/Popup/Feedback';
import Swal from 'sweetalert2';
import { Plus, Pencil, Trash2, Eye, Star } from 'lucide-react';
import { Icon } from '@iconify/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

function ListeFeedbacks() {
    const dispatch = useDispatch();
    const { items: feedbacks, status } = useSelector((state) => state.feedbacks);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // État combiné pour déterminer si quelque chose est en cours de chargement
    const isProcessing = isLoading || isDeleting || status === 'loading';

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchFeedbacks());
        }
    }, [status, dispatch]);

    const handleRowSelected = useCallback((state) => {
        console.log("État de sélection reçu:", state);
        const rows = state.selectedRows || [];
        console.log("Nombre de lignes sélectionnées:", rows.length);
        setSelectedRows(rows);
    }, []);

    const handleAdd = () => {
        setSelectedFeedback(null);
        setShowPopup(true);
    };

    const handleEdit = (feedback) => {
        setSelectedFeedback(feedback);
        setShowPopup(true);
    };

    const handleDelete = useCallback(async (idsOrObjects) => {
        try {
            // S'assurer que l'ID est valide
            if (!idsOrObjects) {
                console.error('ID de feedback invalide:', idsOrObjects);
                Swal.fire('Erreur', 'ID de feedback invalide', 'error');
                return;
            }
            
            setIsDeleting(true);
            
            // Convertir en tableau si ce n'est pas déjà le cas
            const itemsArray = Array.isArray(idsOrObjects) ? idsOrObjects : [idsOrObjects];
            
            // Extraire les IDs des objets si nécessaire
            const idsToDelete = itemsArray.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return item.id;
                }
                return item;
            }).filter(id => id !== undefined && id !== null);
            
            if (idsToDelete.length === 0) {
                console.error('Aucun ID valide à supprimer');
                Swal.fire('Erreur', 'Aucun ID valide à supprimer', 'error');
                return;
            }
            
            // Supprimer chaque feedback
            for (const id of idsToDelete) {
                try {
                    await dispatch(deleteFeedback(id)).unwrap();
                } catch (error) {
                    console.error('Erreur lors de la suppression du feedback', id, error);
                    throw error;
                }
            }
            
            setSelectedRows([]);
            Swal.fire(
                'Supprimé!',
                `${idsToDelete.length} feedback(s) supprimé(s) avec succès.`,
                'success'
            );
            
            // Rafraîchir la liste
            dispatch(fetchFeedbacks());
            
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            Swal.fire(
                'Erreur!',
                'Une erreur est survenue lors de la suppression.',
                'error'
            );
        } finally {
            setIsDeleting(false);
        }
    }, [dispatch]);

    const handleBulkDelete = useCallback(() => {
        if (selectedRows.length === 0) {
            Swal.fire('Attention', 'Veuillez sélectionner au moins un feedback à supprimer', 'warning');
            return;
        }
        
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Vous êtes sur le point de supprimer ${selectedRows.length} feedback(s). Cette action est irréversible !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                // Extraire les IDs des feedbacks sélectionnés
                const idsToDelete = selectedRows.map(row => row.id);
                handleDelete(idsToDelete);
            }
        });
    }, [selectedRows, handleDelete]);

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedFeedback(null);
    };

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, index) => (
            <Star
                key={index}
                size={16}
                className={index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
            />
        ));
    };

    const getStatusColor = (status) => {
        const colors = {
            'en_attente': 'bg-yellow-100 text-yellow-800',
            'traite': 'bg-green-100 text-green-800',
            'ignore': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            width: '80px'
        },
        {
            name: 'Utilisateur',
            selector: row => row.user?.name || 'Non assigné',
            sortable: true,
            grow: 1
        },
        {
            name: 'Contenu',
            selector: row => row.contenu,
            sortable: true,
            grow: 2
        },
        {
            name: 'Note',
            selector: row => row.rating,
            cell: row => (
                <div className="flex">
                    {[...Array(5)].map((_, index) => (
                        <Icon 
                            key={index}
                            icon={index < row.rating ? "material-symbols:star" : "material-symbols:star-outline"}
                            className={index < row.rating ? "text-yellow-400" : "text-gray-300"}
                        />
                    ))}
                </div>
            ),
            sortable: true,
            width: '150px'
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
                    row.status ? 'bg-warning-focus text-warning-main' : 'bg-success-focus text-success-main'
                }`}>
                    {row.status ? 'En attente' : 'Traité'}
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

    const content = (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Feedbacks</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={handleBulkDelete}
                        className={`${
                            selectedRows.length > 0 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        } text-white px-4 py-2 rounded-lg flex items-center mr-2`}
                        disabled={selectedRows.length === 0 || isProcessing}
                    >
                        <Trash2 size={18} className="mr-1" />
                        Supprimer {selectedRows.length > 0 && `(${selectedRows.length})`}
                    </button>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                        disabled={isProcessing}
                    >
                        <Plus size={18} className="mr-1" />
                        Ajouter
                    </button>
                </div>
            </div>

            <TableDataLayer
                data={feedbacks}
                columns={columns}
                progressPending={isProcessing}
                selectableRows
                selectableRowsHighlight
                onSelectionChange={handleRowSelected}
                clearSelectedRows={status === 'loading'}
            />

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <Feedback onClose={handleClosePopup} feedback={selectedFeedback} />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Feedbacks</h2>}
        >
            <Head title="Feedbacks" />
            {content}
        </div>
    );
}

export default ListeFeedbacks; 