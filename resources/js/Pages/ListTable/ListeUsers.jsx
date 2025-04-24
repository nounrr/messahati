import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TableDataLayer from '../Components/tables/TableDataLayer';
import { fetchUsers, deleteUsers } from '../../Redux/users/userSlice';
import { fetchAllRoles } from '../../Redux/roles/roleSlice';
import { createSalaires } from '../../Redux/salaires/salaireSlice';
import Swal from 'sweetalert2';
import User from '../Components/Popup/User';
import { Trash2, Filter, X, DollarSign } from 'lucide-react';

const ListeUsers = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.items);
    const roles = useSelector((state) => state.roles.items);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [roleFilter, setRoleFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentPrimes, setPaymentPrimes] = useState('');

    // Load data on component mount
    useEffect(() => {
        loadUsers();
        dispatch(fetchAllRoles());
    }, [dispatch]);

    // Function to load users
    const loadUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            await dispatch(fetchUsers()).unwrap();
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
            Swal.fire(
                'Erreur',
                'Impossible de charger les utilisateurs.',
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    // Filter users based on selected role, status and search term
    const filteredUsers = useMemo(() => {
        if (!users) return [];
        
        return users.filter(user => {
            // Role filter
            const roleMatch = !roleFilter || user.role === roleFilter;
            
            // Status filter
            const statusMatch = statusFilter === '' || user.status === statusFilter;
            
            // Search term filter
            const searchLower = searchTerm.toLowerCase();
            const nameMatch = user.name && user.name.toLowerCase().includes(searchLower);
            const prenomMatch = user.prenom && user.prenom.toLowerCase().includes(searchLower);
            const emailMatch = user.email && user.email.toLowerCase().includes(searchLower);
            const cinMatch = user.cin && user.cin.toLowerCase().includes(searchLower);
            const searchMatch = !searchTerm || nameMatch || prenomMatch || emailMatch || cinMatch;
            
            return roleMatch && statusMatch && searchMatch;
        });
    }, [users, roleFilter, statusFilter, searchTerm]);

    // Reset filters
    const resetFilters = () => {
        setRoleFilter('');
        setSearchTerm('');
        setStatusFilter('');
    };

    // Check if all selected users have the same role
    const selectedUsersHaveSameRole = useMemo(() => {
        if (!selectedRows || selectedRows.length <= 1) return true;
        
        const firstRole = selectedRows[0].role;
        return selectedRows.every(user => user.role === firstRole);
    }, [selectedRows]);

    // Handle row selection
    const handleRowSelected = useCallback((state) => {
        // Make sure we have an array of selected rows
        const selectedItems = state.selectedRows || [];
        setSelectedRows(selectedItems);
    }, []);

    // Handle adding a new user
    const handleAdd = useCallback(() => {
        setSelectedUser(null); // No user selected for addition
        setShowPopup(true);
    }, []);

    // Handle editing a user
    const handleEdit = useCallback((item) => {
        setSelectedUser(item);
        setShowPopup(true);
    }, []);

    // Handle deleting a user
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
                deleteUser([item.id]);
            }
        });
    }, []);

    // Handle multiple deletion
    const handleDeleteSelected = useCallback(() => {
        if (!Array.isArray(selectedRows) || selectedRows.length === 0) {
            Swal.fire(
                'Attention !',
                'Veuillez sélectionner au moins un utilisateur à supprimer.',
                'warning'
            );
            return;
        }

        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Vous êtes sur le point de supprimer ${selectedRows.length} utilisateur(s). Cette action est irréversible !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                const idsToDelete = selectedRows.map(row => row.id);
                deleteUser(idsToDelete);
            }
        });
    }, [selectedRows]);

    // Handle payment for selected users
    const handlePaySelectedUsers = useCallback(() => {
        if (!Array.isArray(selectedRows) || selectedRows.length === 0) {
            Swal.fire(
                'Attention !',
                'Veuillez sélectionner au moins un utilisateur à payer.',
                'warning'
            );
            return;
        }

        if (!selectedUsersHaveSameRole) {
            Swal.fire(
                'Attention !',
                'Les utilisateurs sélectionnés doivent avoir le même rôle pour être payés ensemble.',
                'warning'
            );
            return;
        }

        setShowPaymentPopup(true);
    }, [selectedRows, selectedUsersHaveSameRole]);

    // Process payment for selected users
    const processPayment = async () => {
        if (!paymentAmount || isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) <= 0) {
            Swal.fire('Erreur', 'Veuillez entrer un montant valide.', 'error');
            return;
        }

        try {
            setIsLoading(true);
            
            // Préparer les données de salaire pour tous les utilisateurs sélectionnés
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
            
            const salairesData = selectedRows.map(user => ({
                user_id: user.id,
                montant: parseFloat(paymentAmount),
                primes: parseFloat(paymentPrimes || 0),
                date: formattedDate
            }));
            
            // Envoyer les données au serveur
            await dispatch(createSalaires({ salaires: salairesData })).unwrap();
            
            // Réinitialiser les états
            setShowPaymentPopup(false);
            setPaymentAmount('');
            setPaymentPrimes('');
            setSelectedRows([]);
            
            Swal.fire(
                'Succès !',
                `Paiement effectué avec succès pour ${selectedRows.length} utilisateur(s).`,
                'success'
            );
            
        } catch (error) {
            console.error('Erreur lors du paiement:', error);
            Swal.fire(
                'Erreur !',
                error.message || 'Une erreur est survenue lors du paiement.',
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Function to delete one or more users
    const deleteUser = useCallback(async (ids) => {
        try {
            setIsLoading(true);
            
            await dispatch(deleteUsers(ids)).unwrap();
            
            setSelectedRows([]);
            Swal.fire(
                'Supprimé !',
                'Les utilisateurs ont été supprimés.',
                'success'
            );
            
            // Refresh data after deletion
            await dispatch(fetchUsers());
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

    // Handle closing the popup
    const handleClosePopup = useCallback(() => {
        setShowPopup(false);
        setTimeout(() => {
            setSelectedUser(null);
        }, 300);
    }, []);

    // Handle closing the payment popup
    const handleClosePaymentPopup = () => {
        setShowPaymentPopup(false);
        setPaymentAmount('');
        setPaymentPrimes('');
    };

    // Column configuration for react-data-table-component
    const columns = [
        {
            name: 'CIN',
            selector: row => row.cin || '-',
            sortable: true,
            grow: 1
        },
        {
            name: 'Nom',
            selector: row => row.name,
            sortable: true,
            grow: 1
        },
        {
            name: 'Prénom',
            selector: row => row.prenom || '-',
            sortable: true,
            grow: 1
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            grow: 1
        },
        {
            name: 'Rôle',
            selector: row => row.role,
            sortable: true,
            grow: 1
        },
        {
            name: 'Statut',
            selector: row => row.status,
            cell: row => {
                const getStatusClass = () => {
                    switch(row.status) {
                        case 'actif':
                            return 'bg-green-100 text-green-800';
                        case 'inactif':
                            return 'bg-red-100 text-red-800';
                        case 'congé':
                            return 'bg-blue-100 text-blue-800';
                        case 'absent':
                            return 'bg-orange-100 text-orange-800';
                        default:
                            return 'bg-gray-100 text-gray-800';
                    }
                };
                
                return (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
                        {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : 'Inconnu'}
                    </div>
                );
            },
            sortable: true,
            grow: 1
        },
        {
            name: 'Date de création',
            selector: row => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
            grow: 1
        }
    ];

    // Determine if the delete button should be enabled and its styling
    const hasSelectedRows = Array.isArray(selectedRows) && selectedRows.length > 0;
    const deleteButtonClasses = `
        flex items-center gap-2 font-medium py-2 px-4 rounded-lg transition
        ${hasSelectedRows 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
    `;
    const payButtonClasses = `
        flex items-center gap-2 font-medium py-2 px-4 rounded-lg transition
        ${hasSelectedRows && selectedUsersHaveSameRole
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
    `;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
                <div className="flex gap-4">
                    <button
                        onClick={handlePaySelectedUsers}
                        className={payButtonClasses}
                        disabled={!hasSelectedRows || !selectedUsersHaveSameRole || isLoading}
                    >
                        {/* <DollarSign size={20} /> */}
                        Payer {hasSelectedRows && `(${selectedRows.length})`}
                    </button>
                    <button
                        onClick={handleDeleteSelected}
                        className={deleteButtonClasses}
                        disabled={!hasSelectedRows || isLoading}
                    >
                        <Trash2 size={20} />
                        Supprimer {hasSelectedRows && `(${selectedRows.length})`}
                    </button>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition flex items-center gap-2"
                        disabled={isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Ajouter un utilisateur
                    </button>
                </div>
            </div>

            {/* Filters section */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Rechercher par nom, prénom, email ou CIN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par rôle</label>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="">Tous les rôles</option>
                                {roles && roles.map(role => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter size={18} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par statut</label>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">Tous les statuts</option>
                                <option value="actif">Actif</option>
                                <option value="inactif">Inactif</option>
                                <option value="congé">Congé</option>
                                <option value="absent">Absent</option>
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter size={18} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                    {(roleFilter || searchTerm || statusFilter) && (
                        <div className="flex items-center h-10">
                            <button
                                onClick={resetFilters}
                                className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                            >
                                <X size={16} />
                                <span>Réinitialiser les filtres</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-500">Chargement en cours...</p>
                </div>
            ) : filteredUsers.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {hasSelectedRows && (
                        <div className="bg-blue-50 p-4 flex justify-between items-center border-b border-blue-100">
                            <div className="text-blue-700">
                                <span className="font-medium">{selectedRows.length}</span> utilisateur(s) sélectionné(s)
                            </div>
                            <button 
                                onClick={() => setSelectedRows([])}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                Annuler la sélection
                            </button>
                        </div>
                    )}
                    <TableDataLayer
                        title="Liste des Utilisateurs"
                        columns={columns}
                        data={filteredUsers}
                        onView={handleEdit}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        showCheckbox={true}
                        pageLength={10}
                        onSelectedRowsChange={handleRowSelected}
                        isLoading={isLoading}
                    />
                </div>
            ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">
                        {searchTerm || roleFilter || statusFilter 
                            ? "Aucun utilisateur ne correspond aux critères de recherche."
                            : "Aucun utilisateur trouvé."}
                    </p>
                    {(searchTerm || roleFilter || statusFilter) && (
                        <button
                            onClick={resetFilters}
                            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Réinitialiser les filtres
                        </button>
                    )}
                </div>
            )}

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="max-w-2xl w-full mx-4">
                        <User
                            onClose={handleClosePopup}
                            user={selectedUser}
                        />
                    </div>
                </div>
            )}

            {/* Payment Popup */}
            {showPaymentPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Paiement de salaire</h2>
                            <button 
                                onClick={handleClosePaymentPopup} 
                                className="text-gray-500 hover:text-red-500"
                                disabled={isLoading}
                            >
                                <X size={22} />
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <p className="mb-2 text-gray-600">
                                Vous êtes sur le point de payer <span className="font-semibold">{selectedRows.length}</span> 
                                utilisateur(s) avec le rôle {selectedRows.length > 0 ? <span className="font-semibold">{selectedRows[0].role}</span> : ''}
                            </p>
                            
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Montant du salaire (DH)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="Exemple: 5000.00"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prime (DH) (optionnel)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={paymentPrimes}
                                    onChange={(e) => setPaymentPrimes(e.target.value)}
                                    placeholder="Exemple: 500.00"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleClosePaymentPopup}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                disabled={isLoading}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={processPayment}
                                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Traitement...' : 'Confirmer le paiement'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListeUsers; 