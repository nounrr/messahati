import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalaires, deleteSalaires } from '../../Redux/salaires/salaireSlice';
import { fetchUsers } from '../../Redux/users/userSlice';
import TableDataLayer from '../Components/tables/TableDataLayer';
import Salaire from '../Components/Popup/Salaire';
import Swal from 'sweetalert2';
import { Plus } from 'lucide-react';
import { Icon } from '@iconify/react';

function ListeSalaires() {
    const dispatch = useDispatch();
    const { items: salaires, status } = useSelector((state) => state.salaires);
    const { items: users } = useSelector((state) => state.users);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSalaire, setSelectedSalaire] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        role: '',
        month: '',
        year: ''
    });

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchSalaires());
            dispatch(fetchUsers());
        }
    }, [status, dispatch]);

    // Obtenir les années uniques des salaires
    const years = [...new Set(salaires.map(salaire => 
        new Date(salaire.date).getFullYear()
    ))].sort((a, b) => b - a);

    // Obtenir les rôles uniques des utilisateurs
    const roles = [...new Set(users.map(user => user.role))].filter(Boolean);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredSalaires = salaires.filter(salaire => {
        const salaireDate = new Date(salaire.date);
        const userName = salaire.user?.name?.toLowerCase() || '';
        const userRole = salaire.user?.role?.toLowerCase() || '';

        return (
            (!filters.name || userName.includes(filters.name.toLowerCase())) &&
            (!filters.role || userRole === filters.role.toLowerCase()) &&
            (!filters.month || (salaireDate.getMonth() + 1).toString() === filters.month) &&
            (!filters.year || salaireDate.getFullYear().toString() === filters.year)
        );
    });

    const handleDelete = async (ids) => {
        try {
            setIsLoading(true);
            await dispatch(deleteSalaires(ids)).unwrap();
            setSelectedRows([]);
            await dispatch(fetchSalaires());
            
            Swal.fire(
                'Supprimé!',
                'Les salaires ont été supprimés avec succès.',
                'success'
            );
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            Swal.fire(
                'Erreur!',
                error.message || 'Une erreur est survenue lors de la suppression.',
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSelected = useCallback(() => {
        if (!selectedRows || selectedRows.length === 0) {
            Swal.fire(
                'Attention !',
                'Veuillez sélectionner au moins un salaire à supprimer.',
                'warning'
            );
            return;
        }

        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Vous êtes sur le point de supprimer ${selectedRows.length} salaire(s). Cette action est irréversible !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                const idsToDelete = selectedRows.map(row => row.id);
                handleDelete(idsToDelete);
            }
        });
    }, [selectedRows]);

    const handleAdd = () => {
        setSelectedSalaire(null);
        setShowPopup(true);
    };

    const handleEdit = (salaire) => {
        setSelectedSalaire(salaire);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedSalaire(null);
        dispatch(fetchSalaires());
    };

    const handleSelectionChange = (state) => {
        setSelectedRows(state.selectedRows);
    };

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            width: '80px'
        },
        {
            name: 'Montant',
            selector: row => row.montant,
            format: row => row.montant ? `${row.montant.toLocaleString('fr-FR')} DH` : '0 DH',
            sortable: true,
            grow: 1
        },
        {
            name: 'Primes',
            selector: row => row.primes,
            format: row => row.primes ? `${row.primes.toLocaleString('fr-FR')} DH` : '0 DH',
            sortable: true,
            grow: 1
        },
        {
            name: 'Date',
            selector: row => row.date,
            format: row => row.date ? new Date(row.date).toLocaleDateString('fr-FR') : 'Non définie',
            sortable: true,
            grow: 1
        },
        {
            name: 'Employé',
            selector: row => row.user?.name || 'Non assigné',
            sortable: true,
            grow: 1
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Salaires</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <Plus size={18} className="mr-1" />
                        Ajouter
                    </button>
                    <button
                        onClick={handleDeleteSelected}
                        className={`flex items-center gap-2 font-medium py-2 px-4 rounded-lg transition ${
                            !selectedRows || selectedRows.length === 0 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                        disabled={!selectedRows || selectedRows.length === 0 || isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Supprimer {selectedRows && selectedRows.length > 0 && `(${selectedRows.length})`}
                    </button>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'employé</label>
                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Rechercher par nom..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                    <select
                        name="role"
                        value={filters.role}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tous les rôles</option>
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mois</label>
                    <select
                        name="month"
                        value={filters.month}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tous les mois</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month}>
                                {new Date(2000, month - 1).toLocaleString('fr-FR', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                    <select
                        name="year"
                        value={filters.year}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Toutes les années</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <TableDataLayer
                data={filteredSalaires}
                columns={columns}
                onSelectionChange={handleSelectionChange}
                onEdit={handleEdit}
                onDelete={(row) => handleDelete([row.id])}
                selectableRows={true}
                isLoading={isLoading || status === 'loading'}
            />

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <Salaire onClose={handleClosePopup} salaire={selectedSalaire} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListeSalaires; 