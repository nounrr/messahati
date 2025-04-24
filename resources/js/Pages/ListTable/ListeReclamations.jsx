import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReclamations, deleteReclamation } from '../../Redux/reclamations/reclamationSlice';
import TableDataLayer from '../Components/tables/TableDataLayer';
import Reclamation from '../Components/Popup/Reclamation';
import Swal from 'sweetalert2';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
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
    const [activeMenu, setActiveMenu] = useState(null); // Pour suivre le menu actif
    const [isDeleting, setIsDeleting] = useState(false); // État pour suivre les opérations de suppression

    // État pour vérifier si les données sont en cours de chargement
    const isLoading = loadingStatus === 'loading' || isDeleting;

    // Fermer le menu actif lorsque l'utilisateur clique ailleurs
    useEffect(() => {
        const handleClickOutside = () => {
            if (activeMenu !== null) {
                setActiveMenu(null);
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [activeMenu]);

    useEffect(() => {
        // Envoyer l'ID utilisateur authentifié lors du fetch des réclamations
        dispatch(fetchReclamations({
            userId: auth.user?.id
        }));
    }, [dispatch, auth.user]);

    // Gérer la sélection des lignes
    const handleRowSelected = useCallback((state) => {
        console.log('État de sélection:', state);
        setSelectedRows(state.selectedRows || []);
    }, []);

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

    const handleEdit = useCallback((reclamation) => {
        setSelectedReclamation(reclamation);
        setShowModal(true);
    }, []);

    const handleDelete = useCallback(async (idsOrObjects) => {
        try {
            // S'assurer que l'ID est valide
            if (!idsOrObjects) {
                console.error('ID de réclamation invalide:', idsOrObjects);
                Swal.fire('Erreur', 'ID de réclamation invalide', 'error');
                return;
            }
            
            setIsDeleting(true);
            
            // Convertir en tableau si ce n'est pas déjà le cas
            const itemsArray = Array.isArray(idsOrObjects) ? idsOrObjects : [idsOrObjects];
            console.log('Items à supprimer:', itemsArray);
            
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
            
            console.log('IDs à supprimer:', idsToDelete);
            
            // Supprimer chaque réclamation
            for (const id of idsToDelete) {
                try {
                    await dispatch(deleteReclamation(id)).unwrap();
                } catch (error) {
                    console.error('Erreur lors de la suppression de la réclamation', id, error);
                    throw error;
                }
            }
            
            setSelectedRows([]);
            Swal.fire(
                'Supprimé!',
                `${idsToDelete.length} réclamation(s) supprimée(s) avec succès.`,
                'success'
            );
            
           
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
    }, [dispatch, auth.user]);

    const handleBulkDelete = useCallback(() => {
        if (selectedRows.length === 0) {
            Swal.fire('Attention', 'Veuillez sélectionner au moins une réclamation à supprimer', 'warning');
            return;
        }
        
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Vous êtes sur le point de supprimer ${selectedRows.length} réclamation(s). Cette action est irréversible !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                // Extraire les IDs des réclamations sélectionnées
                const idsToDelete = selectedRows.map(row => row.id);
                handleDelete(idsToDelete);
            }
        });
    }, [selectedRows]);

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
    ];

    return (

        <div className="container mx-auto px-4 py-6">
                    <div
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Réclamations</h2>}
        >
            <Head title="Réclamations" />

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
                        onClick={handleBulkDelete}
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg ${
                            selectedRows.length === 0 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                        disabled={selectedRows.length === 0}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Supprimer sélection {selectedRows.length > 0 && `(${selectedRows.length})`}
                    </button>
                    
                    <button
                        onClick={() => {
                            setSelectedReclamation(null);
                            setShowModal(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Ajouter réclamation
                    </button>
                </div>
            </div>
            <TableDataLayer
                columns={columns}
                data={filteredReclamations}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSelectionChange={handleRowSelected}
                selectableRows={true}
                pageLength={10}
                enableRowSelection={true}
                title="Liste des Réclamations"
                progressPending={isLoading}
                progressComponent={<div className="p-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-500">Chargement en cours...</p>
                </div>}
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

        </div>
    );
};

export default ListeReclamations; 