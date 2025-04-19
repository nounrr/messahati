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
    const loadingStatus = useSelector((state) => state.reclamations.status);
    const auth = useSelector((state) => state.auth);
    const [showModal, setShowModal] = useState(false);
    const [selectedReclamation, setSelectedReclamation] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [userFilter, setUserFilter] = useState('all'); // 'all', 'mine', or 'others'

    // État pour vérifier si les données sont en cours de chargement
    const isLoading = loadingStatus === 'loading';

    useEffect(() => {
        // Envoyer l'ID utilisateur authentifié lors du fetch des réclamations
        dispatch(fetchReclamations({
            userId: auth.user?.id
        }));
    }, [dispatch, auth.user]);

    // Vérifier si les réclamations existent
    const safeReclamations = reclamations || [];

    // Filtrer les réclamations en fonction du filtre utilisateur
    const filteredReclamations = safeReclamations.filter(rec => {
        if (!rec) return false; // Ignorer les éléments null/undefined
        if (userFilter === 'all') return true;
        if (userFilter === 'mine' && rec.user_id === auth.user?.id) return true;
        if (userFilter === 'others' && rec.user_id !== auth.user?.id) return true;
        return false;
    });

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
                    // Convertir en tableau si ce n'est pas déjà le cas
                    const idArray = Array.isArray(ids) ? ids : [ids];
                    for (const id of idArray) {
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
            selector: row => row.id || '',
            sortable: true,
            width: '80px'
        },
        {
            name: 'Titre',
            selector: row => row.titre || '',
            sortable: true,
            grow: 1
        },
        {
            name: 'Description',
            selector: row => row.description || '',
            cell: row => {
                const description = row.description || '';
                return (
                    <span title={description}>
                        {description.length > 50 ? `${description.substring(0, 50)}...` : description}
                    </span>
                );
            },
            sortable: true,
            grow: 2
        },
        {
            name: 'Utilisateur',
            selector: row => row.user?.name || 'Non assigné',
            cell: row => (
                <span className={auth.user?.id === row.user_id ? "font-bold text-blue-600" : ""}>
                    {row.user?.name || 'Non assigné'}
                </span>
            ),
            sortable: true,
            grow: 1
        },
        {
            name: 'Date',
            selector: row => row.created_at || '',
            format: row => row.created_at ? new Date(row.created_at).toLocaleDateString('fr-FR') : 'Non définie',
            sortable: true,
            grow: 1
        },
        {
            name: 'Statut',
            selector: row => row.statut || 'en_attente',
            cell: row => {
                const statut = row.statut || 'en_attente';
                return (
                    <span className={`px-3 py-1 rounded-full text-sm ${
                        statut === 'en_attente' ? 'bg-warning-focus text-warning-main' :
                        statut === 'traité' ? 'bg-success-focus text-success-main' :
                        'bg-danger-focus text-danger-main'
                    }`}>
                        {statut === 'en_attente' ? 'En attente' : 
                         statut === 'traité' ? 'Traité' : statut}
                    </span>
                );
            },
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
                <div className="space-x-2 flex items-center">
                    {/* Filtre par utilisateur */}
                    <div className="mr-4">
                        <select 
                            className="p-2 border rounded-md"
                            value={userFilter}
                            onChange={(e) => setUserFilter(e.target.value)}
                        >
                            <option value="all">Toutes les réclamations</option>
                            <option value="mine">Mes réclamations</option>
                            <option value="others">Autres réclamations</option>
                        </select>
                    </div>
                    
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
                data={filteredReclamations}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSelectionChange={setSelectedRows}
                enableRowSelection={true}
                title="Liste des Réclamations"
                progressPending={isLoading}
                progressComponent={<div className="p-4 text-center">Chargement des réclamations...</div>}
                noDataComponent={<div className="p-4 text-center">Aucune réclamation trouvée</div>}
            />
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Reclamation
                        reclamation={selectedReclamation}
                        onClose={() => {
                            setShowModal(false);
                            setSelectedReclamation(null);
                            // Rafraîchir la liste après avoir fermé le modal
                            dispatch(fetchReclamations({
                                userId: auth.user?.id
                            }));
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ListeReclamations; 