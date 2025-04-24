import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getListRendezVous, deleteRendezVous } from '../../Redux/rendezvous/rendezvousSlice';
import TableDataLayer from '../Components/tables/TableDataLayer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Swal from 'sweetalert2';
import RendezVous from '@/Pages/Components/Popup/RendezVous';

const ListeRendezVous = () => {
    const dispatch = useDispatch();
    const { listRendezVous: rendezVous, status, error } = useSelector((state) => state.rendezvous);
    const [selectedRows, setSelectedRows] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedRendezVous, setSelectedRendezVous] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Charger les données au montage du composant
    useEffect(() => {
        loadRendezVous();
    }, [dispatch]);

    // Fonction pour charger les rendez-vous
    const loadRendezVous = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await dispatch(getListRendezVous()).unwrap();
            console.log('Rendez-vous chargés:', result);
        } catch (error) {
            console.error('Erreur lors du chargement des rendez-vous:', error);
            Swal.fire(
                'Erreur',
                'Impossible de charger les rendez-vous.',
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    // Gérer la sélection des lignes
    const handleRowSelected = useCallback(({ selectedRows }) => {
        setSelectedRows(selectedRows);
        console.log('Selected Rows:', selectedRows);
    }, []);

    // Forcer la mise à jour de l'état de sélection
    useEffect(() => {
        console.log('Selected rows updated:', selectedRows);
    }, [selectedRows]);

    const handleAdd = useCallback(() => {
        setSelectedRendezVous(null);
        setShowPopup(true);
    }, []);

    const handleEdit = useCallback((rendezVous) => {
        setSelectedRendezVous(rendezVous);
        setShowPopup(true);
    }, []);

    const handleDelete = useCallback(async (id) => {
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
                setIsLoading(true);
                await dispatch(deleteRendezVous({ id })).unwrap();
                await loadRendezVous();
                Swal.fire(
                    'Supprimé !',
                    'Le rendez-vous a été supprimé avec succès.',
                    'success'
                );
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                Swal.fire(
                    'Erreur !',
                    'Une erreur est survenue lors de la suppression.',
                    'error'
                );
            } finally {
                setIsLoading(false);
            }
        }
    }, [dispatch, loadRendezVous]);

    // Gérer la suppression multiple
    const handleDeleteSelected = useCallback(async () => {
        // Vérifier si nous avons des lignes sélectionnées
        console.log('Current selected rows:', selectedRows);
        
        if (!selectedRows || selectedRows.length === 0) {
            Swal.fire(
                'Attention !',
                'Veuillez sélectionner au moins un rendez-vous à supprimer.',
                'warning'
            );
            return;
        }

        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Vous êtes sur le point de supprimer ${selectedRows.length} rendez-vous. Cette action est irréversible !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                setIsLoading(true);
                // Extraire uniquement les IDs des lignes sélectionnées et s'assurer qu'ils sont des nombres
                const idsToDelete = selectedRows.map(row => Number(row.id));
                console.log('IDs to delete:', idsToDelete);
                
                // Envoyer les IDs dans le format attendu
                await dispatch(deleteRendezVous({ ids: idsToDelete })).unwrap();
                
                setSelectedRows([]);
                await loadRendezVous();
                Swal.fire(
                    'Supprimé !',
                    'Les rendez-vous ont été supprimés.',
                    'success'
                );
            } catch (error) {
                console.error('Erreur lors de la suppression multiple:', error);
                Swal.fire(
                    'Erreur !',
                    'Une erreur est survenue lors de la suppression.',
                    'error'
                );
            } finally {
                setIsLoading(false);
            }
        }
    }, [selectedRows, dispatch, loadRendezVous]);

    const columns = [
        {
            name: 'Patient',
            selector: row => row.patient?.name || 'Non défini',
            sortable: true,
            grow: 1
        },
        {
            name: 'Date',
            selector: row => row.date_heure,
            sortable: true,
            cell: ({ date_heure }) => date_heure ? format(new Date(date_heure), 'dd MMMM yyyy', { locale: fr }) : 'Non définie',
            grow: 1
        },
        {
            name: 'Heure',
            selector: row => row.date_heure,
            sortable: true,
            cell: ({ date_heure }) => date_heure ? format(new Date(date_heure), 'HH:mm', { locale: fr }) : 'Non définie',
            grow: 1
        },
        {
            name: 'Médecin',
            selector: row => row.docteur?.name || 'Non défini',
            sortable: true,
            grow: 1
        },
        {
            name: 'Département',
            selector: row => row.departement?.nom || 'Non défini',
            sortable: true,
            grow: 1
        },
        {
            name: 'Traitement',
            selector: row => {
                const traitement = row.traitement;
                return traitement && traitement.type_traitement ? traitement.type_traitement.nom : 'Non défini';
            },
            sortable: true,
            grow: 1
        },
        {
            name: 'Statut',
            selector: row => row.statut,
            sortable: true,
            cell: ({ statut }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    statut === 1 ? 'bg-green-100 text-green-800' :
                    statut === 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {statut === 1 ? 'Confirmé' :
                     statut === 0 ? 'En attente' :
                     'Annulé'}
                </span>
            ),
            grow: 1
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
                        title="Modifier"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                        title="Supprimer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            ),
            grow: 1
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Liste des Rendez-vous</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={handleDeleteSelected}
                            data-delete-selected
                            className={`flex items-center gap-2 font-medium py-2 px-4 rounded-lg transition ${
                                selectedRows.length === 0 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                            }`}
                            disabled={isLoading}
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Supprimer {selectedRows.length > 0 && `(${selectedRows.length})`}
                        </button>
                        <button
                            onClick={handleAdd}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition flex items-center gap-2"
                            disabled={isLoading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Nouveau rendez-vous
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-500">Chargement en cours...</p>
                    </div>
                ) : rendezVous && rendezVous.length > 0 ? (
                    <TableDataLayer
                        columns={columns}
                        data={rendezVous}
                        selectableRows={true}
                        onSelectedRowsChange={handleRowSelected}
                        pageLength={10}
                        isLoading={isLoading}
                        selectableRowsHighlight={true}
                        selectableRowsVisibleOnly={false}
                        selectableRowsSingle={false}
                    />
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Aucun rendez-vous en attente trouvé.
                    </div>
                )}
            </div>

            {showPopup && (
                <RendezVous
                    rendezVous={selectedRendezVous}
                    onClose={() => {
                        setShowPopup(false);
                        setSelectedRendezVous(null);
                        loadRendezVous();
                    }}
                />
            )}
        </div>
    );
};

export default ListeRendezVous; 