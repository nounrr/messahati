import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCharges, deleteCharges } from '../../Redux/charges/chargeSlice';
import { fetchPartenaires } from '../../Redux/partenaires/partenaireSlice';
import TableDataLayer from '../Components/tables/TableDataLayer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Swal from 'sweetalert2';
import Charge from '../Components/Popup/Charge';
import { Plus, Filter } from 'lucide-react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const ListeCharges = () => {
    const dispatch = useDispatch();
    const { items: charges, status, error } = useSelector((state) => state.charges);
    const { items: partenaires } = useSelector((state) => state.partenaires);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCharge, setSelectedCharge] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPartenaire, setSelectedPartenaire] = useState('');

    useEffect(() => {
        loadCharges();
        dispatch(fetchPartenaires());
    }, [dispatch]);

    const loadCharges = useCallback(async () => {
        try {
            setIsLoading(true);
            await dispatch(fetchCharges()).unwrap();
        } catch (error) {
            console.error('Erreur lors du chargement des charges:', error);
            Swal.fire(
                'Erreur',
                'Impossible de charger les charges.',
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    const handleAdd = useCallback(() => {
        setSelectedCharge(null);
        setShowPopup(true);
    }, []);

    const handleEdit = useCallback((charge) => {
        setSelectedCharge(charge);
        setShowPopup(true);
    }, []);

    const handleDelete = useCallback((charge) => {
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
                deleteSingleCharge(charge.id);
            }
        });
    }, []);

    // Fonction pour supprimer une seule charge
    const deleteSingleCharge = useCallback(async (id) => {
        try {
            setIsLoading(true);
            await dispatch(deleteCharges([id])).unwrap();
            Swal.fire(
                'Supprimé !',
                'La charge a été supprimée avec succès.',
                'success'
            );
            await loadCharges();
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
    }, [dispatch, loadCharges]);

    const handleRowSelected = useCallback((state) => {
        const selectedItems = state.selectedRows || [];
        setSelectedRows(selectedItems);
    }, []);

    const handleDeleteSelected = useCallback(() => {
        if (!Array.isArray(selectedRows) || selectedRows.length === 0) {
            Swal.fire(
                'Attention !',
                'Veuillez sélectionner au moins une charge à supprimer.',
                'warning'
            );
            return;
        }

        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Vous êtes sur le point de supprimer ${selectedRows.length} charge(s). Cette action est irréversible !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                const idsToDelete = selectedRows.map(row => row.id).filter(id => id !== undefined && id !== null);
                if (idsToDelete.length > 0) {
                    deleteChargeSelected(idsToDelete);
                } else {
                    Swal.fire(
                        'Erreur !',
                        'Aucun ID valide trouvé pour la suppression.',
                        'error'
                    );
                }
            }
        });
    }, [selectedRows]);

    const deleteChargeSelected = useCallback(async (ids) => {
        try {
            setIsLoading(true);
            
            // Vérifier que tous les IDs sont valides
            const validIds = ids.filter(id => id !== undefined && id !== null);
            
            if (validIds.length === 0) {
                throw new Error('Aucun ID valide trouvé pour la suppression');
            }
            
            // Utiliser la route de suppression multiple
            await dispatch(deleteCharges(validIds)).unwrap();
            
            setSelectedRows([]);
            Swal.fire(
                'Supprimé !',
                'Les charges ont été supprimées avec succès.',
                'success'
            );
            
            await loadCharges();
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
    }, [dispatch, loadCharges]);

    const handleClosePopup = useCallback(() => {
        setShowPopup(false);
        setTimeout(() => {
            setSelectedCharge(null);
            loadCharges(); // Recharger les charges après la fermeture du popup
        }, 300);
    }, [loadCharges]);

    const handlePartenaireFilter = (e) => {
        setSelectedPartenaire(e.target.value);
    };

    const filteredCharges = selectedPartenaire
        ? charges.filter(charge => charge.partenaire_id === parseInt(selectedPartenaire))
        : charges;

    const columns = [
        {
            name: 'Nom',
            selector: row => row.nom,
            sortable: true,
            grow: 2,
        },
        {
            name: 'Prix Unitaire',
            selector: row => row.prix_unitaire,
            sortable: true,
            format: row => `${row.prix_unitaire.toLocaleString('fr-FR')} FCFA`,
        },
        {
            name: 'Quantité',
            selector: row => row.quantite,
            sortable: true,
        },
        {
            name: 'Partenaire',
            selector: row => row.partenaire?.nom || 'Non défini',
            sortable: true,
        },
        {
            name: 'Statut',
            selector: row => row.status,
            sortable: true,
            format: row => {
                const statusColors = {
                    'paye': 'bg-green-100 text-green-800',
                    'en_attente': 'bg-yellow-100 text-yellow-800',
                    'annule': 'bg-red-100 text-red-800'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[row.status] || 'bg-gray-100 text-gray-800'}`}>
                        {row.status}
                    </span>
                );
            }
        }
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">Liste des Charges</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <select
                            value={selectedPartenaire}
                            onChange={handlePartenaireFilter}
                            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Tous les partenaires</option>
                            {partenaires.map(partenaire => (
                                <option key={partenaire.id} value={partenaire.id}>
                                    {partenaire.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span>Ajouter</span>
                    </button>
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
                        <span>Supprimer {Array.isArray(selectedRows) && selectedRows.length > 0 && `(${selectedRows.length})`}</span>
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-500">Chargement en cours...</p>
                </div>
            ) : filteredCharges && filteredCharges.length > 0 ? (
                <TableDataLayer
                    title="Liste des Charges"
                    columns={columns}
                    data={filteredCharges}
                    onView={handleEdit}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showCheckbox={true}
                    pageLength={10}
                    onSelectedRowsChange={handleRowSelected}
                />
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">
                        {selectedPartenaire 
                            ? "Aucune charge trouvée pour ce partenaire" 
                            : "Aucune charge trouvée"}
                    </p>
                </div>
            )}

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="max-w-2xl w-full mx-4">
                        <Charge
                            onClose={handleClosePopup}
                            charge={selectedCharge}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListeCharges; 