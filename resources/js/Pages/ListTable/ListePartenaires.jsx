import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartenaires, deletePartenaires } from '../../Redux/partenaires/partenaireSlice';
import { fetchTypePartenaires } from '../../Redux/typePartenaires/typePartenaireSlice';
import TableDataLayer from '../Components/tables/TableDataLayer';
import Partenaire from '../Components/Popup/Partenaire';
import Swal from 'sweetalert2';
import { Plus, Filter } from 'lucide-react';

function ListePartenaires() {
    const dispatch = useDispatch();
    const { items: partenaires, status } = useSelector((state) => state.partenaires);
    const { items: typePartenaires } = useSelector((state) => state.typePartenaires);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPartenaire, setSelectedPartenaire] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [typeFilter, setTypeFilter] = useState('');

    // Charger les partenaires et les types de partenaires au chargement du composant
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPartenaires());
        }
        dispatch(fetchTypePartenaires());
    }, [status, dispatch]);

    // Gérer la sélection des lignes
    const handleRowSelected = useCallback((state) => {
        console.log('État de sélection reçu:', state);
        // S'assurer que nous avons un tableau de lignes sélectionnées
        const selectedItems = state.selectedRows || [];
        console.log('Lignes sélectionnées:', selectedItems);
        setSelectedRows(selectedItems);
    }, []);

    // Gérer l'ajout d'un nouveau partenaire
    const handleAdd = useCallback(() => {
        setSelectedPartenaire(null);
        setShowPopup(true);
    }, []);

    // Gérer l'édition d'un partenaire existant
    const handleEdit = useCallback((partenaire) => {
        setSelectedPartenaire(partenaire);
        setShowPopup(true);
    }, []);

    // Gérer la suppression d'un partenaire
    const handleDelete = useCallback((partenaire) => {
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
                deletePartenaireSelected([partenaire.id]);
            }
        });
    }, []);

    // Gérer la suppression multiple
    const handleDeleteSelected = useCallback(() => {
        if (!Array.isArray(selectedRows) || selectedRows.length === 0) {
            Swal.fire(
                'Attention !',
                'Veuillez sélectionner au moins un partenaire à supprimer.',
                'warning'
            );
            return;
        }

        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Vous êtes sur le point de supprimer ${selectedRows.length} partenaire(s). Cette action est irréversible !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                const idsToDelete = selectedRows.map(row => row.id);
                deletePartenaireSelected(idsToDelete);
            }
        });
    }, [selectedRows]);

    const deletePartenaireSelected = useCallback(async (ids) => {
        try {
            setIsLoading(true);
            await dispatch(deletePartenaires(ids)).unwrap();
            setSelectedRows([]);
            Swal.fire(
                'Supprimé !',
                'Les partenaires ont été supprimés avec succès.',
                'success'
            );
            dispatch(fetchPartenaires());
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

    // Fermer le popup
    const handleClosePopup = useCallback(() => {
        setShowPopup(false);
        setTimeout(() => {
            setSelectedPartenaire(null);
        }, 300);
    }, []);

    // Gérer le changement de filtre par type
    const handleTypeFilterChange = (e) => {
        setTypeFilter(e.target.value);
    };

    // Filtrer les partenaires en fonction du type sélectionné
    const filteredPartenaires = useCallback(() => {
        if (!typeFilter) return partenaires;
        return partenaires.filter(partenaire => 
            partenaire.type_partenaire && partenaire.type_partenaire.id.toString() === typeFilter
        );
    }, [partenaires, typeFilter]);

    // Configuration des colonnes pour le tableau
    const columns = [
        { name: 'ID', selector: row => row.id },
        { name: 'Nom', selector: row => row.nom },
        { 
            name: 'Type de partenaire', 
            selector: row => row.type_partenaire?.nom || 'Non défini',
            sortable: true 
        },
        { name: 'Adresse', selector: row => row.adress },
        { name: 'Téléphone', selector: row => row.telephone }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                 {/* Filtre par type de partenaire */}
            <div className="mb-6 flex items-center">
            <h1 className="text-2xl mr-2 font-bold">Partenaires</h1>

                <Filter size={18} className="mr-2 text-gray-500" />
                <label htmlFor="typeFilter" className="mr-2 font-medium">Filtrer par type:</label>
                <select
                    id="typeFilter"
                    value={typeFilter}
                    onChange={handleTypeFilterChange}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Tous les types</option>
                    {typePartenaires && typePartenaires.map(type => (
                        <option key={type.id} value={type.id}>{type.nom}</option>
                    ))}
                </select>
            </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleDeleteSelected}
                        className={`flex items-center gap-2 font-medium py-2 px-4 rounded-lg transition ${
                            selectedRows.length === 0 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                        disabled={selectedRows.length === 0 || isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Supprimer {selectedRows.length > 0 && `(${selectedRows.length})`}
                    </button>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                        disabled={isLoading}
                    >
                        <Plus size={18} className="mr-1" />
                        Ajouter
                    </button>
                </div>
            </div>

           

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-500">Chargement en cours...</p>
                </div>
            ) : filteredPartenaires() && filteredPartenaires().length > 0 ? (
                <TableDataLayer
                    data={filteredPartenaires()}
                    columns={columns}
                    onSelectedRowsChange={handleRowSelected}
                    selectedRows={selectedRows}
                    isLoading={isLoading || status === 'loading'}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showCheckbox={true}
                    pageLength={10}
                />
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">Aucun partenaire trouvé.</p>
                </div>
            )}

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <Partenaire onClose={handleClosePopup} partenaire={selectedPartenaire} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListePartenaires; 