import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TableDataLayer from '../Components/tables/TableDataLayer';
import { fetchTypePartenaires, deleteTypePartenaires } from '../../Redux/typePartenaires/typePartenaireSlice';
import Swal from 'sweetalert2';
import TypePartenaire from '../Components/Popup/TypePartenaire';

const ListeTypePartenaires = () => {
    const dispatch = useDispatch();
    const typePartenaires = useSelector((state) => state.typePartenaires.items);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Charger les données au montage du composant
    useEffect(() => {
        loadTypePartenaires();
    }, [dispatch]);

    // Fonction pour charger les types de partenaires
    const loadTypePartenaires = useCallback(async () => {
        try {
            setIsLoading(true);
            await dispatch(fetchTypePartenaires()).unwrap();
        } catch (error) {
            console.error('Erreur lors du chargement des types de partenaires:', error);
            Swal.fire(
                'Erreur',
                'Impossible de charger les types de partenaires.',
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    // Gérer la sélection des lignes
    const handleRowSelected = useCallback((state) => {
        console.log('État de sélection reçu:', state);
        // S'assurer que nous avons un tableau de lignes sélectionnées
        const selectedItems = state.selectedRows || [];
        console.log('Lignes sélectionnées:', selectedItems);
        setSelectedRows(selectedItems);
    }, []);

    // Gérer l'ajout d'un nouveau type de partenaire
    const handleAdd = useCallback(() => {
        setSelectedType(null); // Pas de type sélectionné pour l'ajout
        setShowPopup(true);
    }, []);

    // Gérer la modification d'un type de partenaire
    const handleEdit = useCallback((item) => {
        setSelectedType(item);
        setShowPopup(true);
    }, []);

    // Gérer la suppression d'un type de partenaire
    const handleDelete = useCallback((item) => {
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Cette action est irréversible !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTypePartenaire([item.id]);
            }
        });
    }, []);

    // Gérer la suppression multiple
    const handleDeleteSelected = useCallback(() => {
        if (!Array.isArray(selectedRows) || selectedRows.length === 0) {
            Swal.fire(
                'Attention !',
                'Veuillez sélectionner au moins un type de partenaire à supprimer.',
                'warning'
            );
            return;
        }

        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Vous êtes sur le point de supprimer ${selectedRows.length} type(s) de partenaire(s). Cette action est irréversible !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                const idsToDelete = selectedRows.map(row => row.id);
                deleteTypePartenaire(idsToDelete);
            }
        });
    }, [selectedRows]);

    // Fonction pour supprimer un ou plusieurs types de partenaires
    const deleteTypePartenaire = useCallback(async (ids) => {
        try {
            setIsLoading(true);
            await dispatch(deleteTypePartenaires(ids)).unwrap();
            setSelectedRows([]);
            Swal.fire(
                'Supprimé !',
                'Les types de partenaires ont été supprimés.',
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
    }, [dispatch]);

    // Gérer la fermeture de la popup
    const handleClosePopup = useCallback(() => {
        setShowPopup(false);
        setTimeout(() => {
            setSelectedType(null);
        }, 300);
    }, []);

    // Configuration des colonnes pour react-data-table-component
    const columns = [
        {
            name: 'Nom',
            selector: row => row.nom,
            sortable: true,
            grow: 2
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
            grow: 3
        },
        {
            name: 'Nombre de Partenaires',
            selector: row => row.partenaires?.length || 0,
            sortable: true,
            right: true,
            width: '200px'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Types de Partenaires</h1>
                <div className="flex gap-4">
                    <button
                        onClick={handleDeleteSelected}
                        className={`flex items-center gap-2 font-medium py-2 px-4 rounded-lg transition ${
                            !Array.isArray(selectedRows) || selectedRows.length === 0 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                        disabled={!Array.isArray(selectedRows) || selectedRows.length === 0 || isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Supprimer {Array.isArray(selectedRows) && selectedRows.length > 0 && `(${selectedRows.length})`}
                    </button>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition flex items-center gap-2"
                        disabled={isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Ajouter un type
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-500">Chargement en cours...</p>
                </div>
            ) : typePartenaires && typePartenaires.length > 0 ? (
                <TableDataLayer
                    title="Liste des Types de Partenaires"
                    columns={columns}
                    data={typePartenaires}
                    onView={handleEdit}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showCheckbox={true}
                    pageLength={10}
                    onSelectedRowsChange={handleRowSelected}
                />
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">Aucun type de partenaire trouvé.</p>
                </div>
            )}

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="max-w-2xl w-full mx-4">
                        <TypePartenaire
                            onClose={handleClosePopup}
                            typePartenaire={selectedType}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListeTypePartenaires; 