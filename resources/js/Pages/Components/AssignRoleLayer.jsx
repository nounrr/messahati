import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../Redux/users/userSlice';
import { fetchAllRoles as fetchRoles, assignRoleToUser, removeRoleFromUser } from '../../Redux/roles/roleSlice';
import { fetchAllPermissions as fetchPermissions, assignPermissionToUser, getUserPermissions, updateRolePermissions } from '../../Redux/permissions/permissionSlice';
import Swal from 'sweetalert2';
import { FaSearch, FaChevronLeft, FaChevronRight, FaKey, FaTrash, FaCheck, FaPlus } from 'react-icons/fa';
import MasterLayout from '@/masterLayout/MasterLayout';

const AssignRoleLayer = () => {
    const dispatch = useDispatch();
    const { items: users, status: usersStatus, error: usersError } = useSelector((state) => state.users);
    const { items: roles, status: rolesStatus, error: rolesError } = useSelector((state) => state.roles);
    const { items: permissions, userPermissions, status: permissionsStatus, error: permissionsError } = useSelector((state) => state.permissions);
    const status = usersStatus === 'loading' || rolesStatus === 'loading' || permissionsStatus === 'loading' ? 'loading' : 'idle';
    const error = usersError || rolesError || permissionsError;

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loadingPermissions, setLoadingPermissions] = useState(false);
    const [permissionsLoaded, setPermissionsLoaded] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const modalRef = useRef(null);

    // Function to get badge color based on role name
    const getRoleBadgeColor = (roleName) => {
        const colors = {
            'admin': 'bg-danger',
            'manager': 'bg-warning',
            'employee': 'bg-success',
            'user': 'bg-info',
            'editor': 'bg-purple',
            'viewer': 'bg-secondary',
            'contributor': 'bg-teal',
            'moderator': 'bg-pink',
            'developer': 'bg-indigo',
        };
        
        // Convert role name to lowercase for case-insensitive matching
        const role = roleName.toLowerCase();
        
        // Return the matching color or default to primary if no match
        return colors[role] || 'bg-primary';
    };

    // Function to check if user has a specific role
    const userHasRole = (user, roleName) => {
        if (!user.roles || !user.roles.length) return false;
        return user.roles.some(role => role.name === roleName);
    };

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchRoles());
        dispatch(fetchPermissions());
    }, [dispatch]);

    useEffect(() => {
        if (permissions) {
            setPermissionsLoaded(true);
        }
    }, [permissions]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRoleFilter = (e) => {
        setRoleFilter(e.target.value);
    };

    const handleItemsPerPage = (e) => {
        setItemsPerPage(parseInt(e.target.value));
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(filteredUsers.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const handleAssignRole = async (userId, roleName) => {
        try {
            await dispatch(assignRoleToUser({ userId, role: roleName })).unwrap();
            Swal.fire({
                icon: 'success',
                title: 'Role Assigned',
                text: 'The role has been successfully assigned to the user.',
                showConfirmButton: false,
                timer: 1500
            });
            // Refresh the users list to get updated roles
            dispatch(fetchUsers());
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to assign role. Please try again.',
            });
        }
    };

    const handleToggleRole = async (userId, roleName, hasRole) => {
        try {
            if (hasRole) {
                // Confirmation avec SweetAlert
                const result = await Swal.fire({
                    title: 'Are you sure?',
                    text: `Do you want to remove the role "${roleName}" from this user?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, remove it!'
                });

                if (result.isConfirmed) {
                    await dispatch(removeRoleFromUser({ userId, role: roleName })).unwrap();
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Role Removed',
                        text: `The role "${roleName}" has been successfully removed from the user.`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            } else {
                await dispatch(assignRoleToUser({ userId, role: roleName })).unwrap();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Role Assigned',
                    text: `The role "${roleName}" has been successfully assigned to the user.`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            
            // Rafraîchir la liste des utilisateurs
            dispatch(fetchUsers());
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to update role. Please try again.',
            });
        }
    };

    const handleRemoveRole = async (userId, roleName) => {
        try {
            // Confirmation avec SweetAlert
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `Do you want to remove the role "${roleName}" from this user?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, remove it!'
            });

            if (result.isConfirmed) {
                await dispatch(removeRoleFromUser({ userId, role: roleName })).unwrap();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Role Removed',
                    text: `The role "${roleName}" has been successfully removed from the user.`,
                    showConfirmButton: false,
                    timer: 1500
                });

                // Rafraîchir la liste des utilisateurs
                dispatch(fetchUsers());
                
                // Fermer le modal des rôles si ouvert
                if (showRoleModal) {
                    setShowRoleModal(false);
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to remove role. Please try again.',
            });
        }
    };

    const handleOpenPermissionModal = (user, roleName = null) => {
        setSelectedUser(user);
        setLoadingPermissions(true);
        
        // Récupérer les permissions de l'utilisateur
        dispatch(getUserPermissions(user.id))
            .then((action) => {
                if (action.payload && action.payload.permissions) {
                    // Extraire les IDs des permissions pour les pré-cocher
                    const permissionIds = action.payload.permissions.map(permission => permission.id);
                    setSelectedPermissions(permissionIds);
                } else {
                    setSelectedPermissions([]);
                }
                setLoadingPermissions(false);
            })
            .catch(() => {
                setLoadingPermissions(false);
                setSelectedPermissions([]);
            });
        
        setShowPermissionModal(true);
    };

    const handleOpenRoleModal = (user) => {
        setSelectedUser(user);
        dispatch(getUserPermissions(user.id));
        setShowRoleModal(true);
    };

    const handleClosePermissionModal = () => {
        setShowPermissionModal(false);
        setSelectedUser(null);
        setSelectedRole(null);
        setSelectedPermissions([]);
    };

    const handleCloseRoleModal = () => {
        setShowRoleModal(false);
        setSelectedUser(null);
    };

    const handlePermissionChange = (permissionId) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionId)) {
                return prev.filter(id => id !== permissionId);
            } else {
                return [...prev, permissionId];
            }
        });
    };

    const handleSavePermissions = async () => {
        if (!selectedUser) return;

        setLoadingPermissions(true);
        try {
            if (selectedRole) {
                // Si un rôle est sélectionné, on met à jour les permissions du rôle
                Swal.fire({
                    icon: 'info',
                    title: 'Mise à jour des permissions du rôle',
                    text: `La mise à jour des permissions du rôle ${selectedRole.name} affectera tous les utilisateurs ayant ce rôle.`,
                    showCancelButton: true,
                    confirmButtonText: 'Continuer',
                    cancelButtonText: 'Annuler'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            // Appeler l'API pour mettre à jour les permissions du rôle
                            await dispatch(updateRolePermissions({
                                roleId: selectedRole.id,
                                permissions: selectedPermissions
                            })).unwrap();

                            Swal.fire({
                                icon: 'success',
                                title: 'Permissions mises à jour',
                                text: `Les permissions du rôle ${selectedRole.name} ont été mises à jour avec succès`,
                                timer: 2000,
                                showConfirmButton: false
                            });

                            // Rafraîchir les données
                            dispatch(fetchUsers());
                            dispatch(fetchRoles());
                            handleClosePermissionModal();
                        } catch (error) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Erreur',
                                text: error.message || 'Une erreur est survenue lors de la mise à jour des permissions du rôle'
                            });
                        } finally {
                            setLoadingPermissions(false);
                        }
                    } else {
                        setLoadingPermissions(false);
                    }
                });
            } else {
                // Si aucun rôle n'est sélectionné, on met à jour les permissions directes de l'utilisateur
                // Trouver toutes les permissions sélectionnées
                const selectedPermissionNames = permissions
                    .filter(p => selectedPermissions.includes(p.id))
                    .map(p => p.name);

                // Traiter chaque permission individuellement
                for (const permissionName of selectedPermissionNames) {
                    try {
                        await dispatch(assignPermissionToUser({
                            userId: selectedUser.id,
                            permission: permissionName
                        })).unwrap();
                    } catch (error) {
                        console.error(`Erreur lors de l'ajout de la permission ${permissionName}:`, error);
                        // Continuer avec les autres permissions même si une échoue
                    }
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Permissions mises à jour',
                    text: 'Les permissions de l\'utilisateur ont été mises à jour avec succès',
                    timer: 2000,
                    showConfirmButton: false
                });

                // Rafraîchir les données de l'utilisateur
                dispatch(fetchUsers());
                handleClosePermissionModal();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.message || 'Une erreur est survenue lors de la mise à jour des permissions'
            });
        } finally {
            setLoadingPermissions(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = !roleFilter || user.roles.some(role => role.name === roleFilter);
        return matchesSearch && matchesRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Ajout d'une fonction pour changer le rôle sélectionné dans le modal
    const handleRoleChange = (e) => {
        const roleName = e.target.value;
        if (roleName === "") {
            setSelectedRole(null);
            // Charger les permissions directes de l'utilisateur
            const userDirectPermissions = selectedUser.permissions || [];
            setSelectedPermissions(userDirectPermissions.map(p => p.id));
        } else {
            const role = roles.find(r => r.name === roleName);
            setSelectedRole(role);
            // Charger les permissions du rôle sélectionné
            console.log("Selected role:", role);
            if (role && role.permissions && role.permissions.length > 0) {
                const permissionIds = role.permissions.map(p => p.id);
                console.log("Setting role permission IDs:", permissionIds);
                setSelectedPermissions(permissionIds);
            } else {
                console.log("No permissions found for role, setting empty array");
                setSelectedPermissions([]);
            }
        }
    };

    if (status === 'loading') {
        return <div className="card h-100 p-24 d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (error) {
        return <div className="card h-100 p-24 text-center text-danger">
            Error: {error}
        </div>;
    }

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <span className="text-md fw-medium text-secondary-light mb-0">Show</span>
                    <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={itemsPerPage}
                        onChange={handleItemsPerPage}
                    >
                        {Array.from({ length: 20 }, (_, i) => (i + 1) * 10).map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                    <form className="navbar-search" onSubmit={e => e.preventDefault()}>
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            name="search"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <FaSearch className="icon" />
                    </form>
                    <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={roleFilter}
                        onChange={handleRoleFilter}
                    >
                        <option value="">All Roles</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.name}>{role.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">
                                    <div className="d-flex align-items-center gap-10">
                                        <div className="form-check style-check d-flex align-items-center">
                                            <input
                                                className="form-check-input radius-4 border input-form-dark"
                                                type="checkbox"
                                                checked={selectedUsers.length === filteredUsers.length}
                                                onChange={handleSelectAll}
                                            />
                                        </div>
                                        S.L
                                    </div>
                                </th>
                                <th scope="col">Username</th>
                                <th scope="col" className="text-center">Role Permission</th>
                                <th scope="col" className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user, index) => (
                                <tr key={user.id}>
                                <td>
                                    <div className="d-flex align-items-center gap-10">
                                        <div className="form-check style-check d-flex align-items-center">
                                            <input
                                                className="form-check-input radius-4 border border-neutral-400"
                                                type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleSelectUser(user.id)}
                                            />
                                        </div>
                                            {startIndex + index + 1}
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                            {user.avatar ? (
                                        <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                            className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                                        />
                                            ) : (
                                                <div className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden bg-primary d-flex align-items-center justify-content-center text-white">
                                                    {user.name?.charAt(0)}
                                        </div>
                                            )}
                                        <div className="flex-grow-1">
                                            <span className="text-md mb-0 fw-normal text-secondary-light">
                                                    {user.name}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center">
                                        {user.roles && user.roles.length > 0 ? 
                                            user.roles.map(role => (
                                                <span key={role.id} className={`badge ${getRoleBadgeColor(role.name)} me-1`}>
                                                    {role.name}
                                                </span>
                                            )) 
                                            : 'No Role'}
                                </td>
                                <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-outline-primary-600 not-active px-18 py-11 dropdown-toggle toggle-icon"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Manage Roles
                                        </button>
                                                <ul className="dropdown-menu">
                                                    {roles.map(role => {
                                                        const hasRole = userHasRole(user, role.name);
                                                        return (
                                                            <li key={role.id}>
                                                                <button
                                                                    className={`dropdown-item px-16 py-8 rounded d-flex align-items-center justify-content-between 
                                                                        ${hasRole ? 'bg-light text-primary' : 'text-secondary-light bg-hover-neutral-200 text-hover-neutral-900'}`}
                                                                    onClick={() => handleToggleRole(user.id, role.name, hasRole)}
                                                                >
                                                                    <span>{role.name}</span>
                                                                    {hasRole ? (
                                                                        <FaTrash className="text-danger" />
                                                                    ) : (
                                                                        <FaPlus className="text-success" />
                                                                    )}
                                                                </button>
                                                                <button
                                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                                    onClick={() => handleOpenPermissionModal(user, role.name)}
                                                                >
                                                                    View {role.name} Permissions
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                    </div>
                                        <button
                                                className="btn btn-outline-secondary-600 not-active px-18 py-11 d-flex align-items-center gap-2"
                                                onClick={() => handleOpenPermissionModal(user)}
                                            >
                                                <FaKey /> Permissions
                                        </button>
                                        <button
                                                className="btn btn-outline-danger-600 not-active px-18 py-11 d-flex align-items-center gap-2"
                                                onClick={() => handleOpenRoleModal(user)}
                                            >
                                                <FaTrash /> Manage Roles
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                    <span>Showing {startIndex + 1} to {endIndex} of {filteredUsers.length} entries</span>
                    <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                        <li className="page-item">
                            <button
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft />
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <li key={page} className="page-item">
                                <button
                                    className={`page-link ${currentPage === page ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-secondary-light'} fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                        </li>
                        ))}
                        <li className="page-item">
                            <button
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <FaChevronRight />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Permission Modal */}
            {showPermissionModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content radius-12">
                            <div className="modal-header border-bottom py-16 px-24">
                                <h5 className="modal-title fw-semibold text-secondary-dark">
                                    Manage Permissions for {selectedUser?.name}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleClosePermissionModal}
                                ></button>
                            </div>
                            <div className="modal-body p-24">
                                {loadingPermissions ? (
                                    <div className="d-flex justify-content-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : !permissionsLoaded ? (
                                    <div className="d-flex justify-content-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading permissions...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="permission-list">
                                        <div className="row g-3">
                                            {permissions && permissions.length > 0 ? (
                                                permissions.map(permission => (
                                                    <div key={permission.id} className="col-md-6 col-lg-4">
                                                        <div className="form-check style-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`permission-${permission.id}`}
                                                                checked={selectedPermissions.includes(permission.id)}
                                                                onChange={() => handlePermissionChange(permission.id)}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`permission-${permission.id}`}
                                                            >
                                                                {permission.name}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-12 text-center">
                                                    <p>No permissions available</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer border-top py-16 px-24">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary-600"
                                    onClick={handleClosePermissionModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary-600"
                                    onClick={handleSavePermissions}
                                    disabled={loadingPermissions}
                                >
                                    {loadingPermissions ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Permissions'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Role Management Modal */}
            {showRoleModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content radius-12">
                            <div className="modal-header border-bottom py-16 px-24">
                                <h5 className="modal-title fw-semibold text-secondary-dark">
                                    Manage Roles for {selectedUser?.name}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseRoleModal}
                                ></button>
                            </div>
                            <div className="modal-body p-24">
                                {selectedUser && selectedUser.roles && selectedUser.roles.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table bordered-table sm-table mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Role Name</th>
                                                    <th scope="col" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedUser.roles.map(role => (
                                                    <tr key={role.id}>
                                                        <td>
                                                            <span className={`badge ${getRoleBadgeColor(role.name)} me-1`}>
                                                                {role.name}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <button
                                                                className="btn btn-outline-danger-600 btn-sm"
                                                                onClick={() => handleRemoveRole(selectedUser.id, role.name)}
                                                            >
                                                                <FaTrash /> Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p>This user has no roles assigned.</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer border-top py-16 px-24">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary-600"
                                    onClick={handleCloseRoleModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignRoleLayer;