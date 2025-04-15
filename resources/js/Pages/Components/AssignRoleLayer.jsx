import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles, assignRoleToUser } from '../../Redux/rolePermissions/rolePermissionSlice';
import { fetchUsers } from '../../Redux/users/userSlice';
import { clearError } from '../../Redux/rolePermissions/rolePermissionSlice';
import { Dropdown } from 'bootstrap';

const AssignRoleLayer = () => {
    const dispatch = useDispatch();
    const { roles, status: roleStatus, error: roleError } = useSelector((state) => state.rolePermissions);
    const { users, status: userStatus, error: userError } = useSelector((state) => state.users);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const [showCount, setShowCount] = useState(10);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [dropdowns, setDropdowns] = useState({});

    useEffect(() => {
        dispatch(fetchRoles());
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        // Initialiser les dropdowns Bootstrap
        const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]');
        dropdownElements.forEach(element => {
            const dropdown = new Dropdown(element);
            setDropdowns(prev => ({
                ...prev,
                [element.id]: dropdown
            }));
        });

        return () => {
            // Nettoyer les dropdowns lors du démontage
            Object.values(dropdowns).forEach(dropdown => {
                dropdown.dispose();
            });
        };
    }, [users]); // Réinitialiser quand les utilisateurs changent

    const handleAssignRole = async (userId, roleId) => {
        try {
            await dispatch(assignRoleToUser({ userId, roleId })).unwrap();
            dispatch(fetchUsers()); // Rafraîchir la liste des utilisateurs
        } catch (error) {
            console.error('Error assigning role:', error);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'Status' || 
            (selectedStatus === 'Active' && user.status === 'active') || 
            (selectedStatus === 'Inactive' && user.status === 'inactive');
        return matchesSearch && matchesStatus;
    });

    const displayedUsers = filteredUsers.slice(0, showCount);

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <span className="text-md fw-medium text-secondary-light mb-0">Show</span>
                    <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={showCount}
                        onChange={(e) => setShowCount(Number(e.target.value))}
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <form className="navbar-search">
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            name="search"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Icon icon="ion:search-outline" className="icon" />
                    </form>
                    <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="Status" disabled>
                            Status
                        </option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <div className="card-body p-24">
                {roleError && (
                    <div className="alert alert-danger" role="alert">
                        {roleError}
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => dispatch(clearError())}
                        ></button>
                    </div>
                )}
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
                                                name="checkbox"
                                                id="selectAll"
                                            />
                                        </div>
                                        S.L
                                    </div>
                                </th>
                                <th scope="col">Username</th>
                                <th scope="col" className="text-center">
                                    Role Permission
                                </th>
                                <th scope="col" className="text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {userStatus === 'loading' ? (
                                <tr>
                                    <td colSpan="4" className="text-center">Chargement...</td>
                                </tr>
                            ) : displayedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center">Aucun utilisateur trouvé</td>
                                </tr>
                            ) : (
                                displayedUsers.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-10">
                                                <div className="form-check style-check d-flex align-items-center">
                                                    <input
                                                        className="form-check-input radius-4 border border-neutral-400"
                                                        type="checkbox"
                                                        name="checkbox"
                                                    />
                                                </div>
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={user.avatar || "assets/images/user-list/user-list1.png"}
                                                    alt=""
                                                    className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                                                />
                                                <div className="flex-grow-1">
                                                    <span className="text-md mb-0 fw-normal text-secondary-light">
                                                        {user.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            {user.roles && user.roles.length > 0 
                                                ? user.roles.map(role => role.name).join(', ') 
                                                : 'Aucun rôle'}
                                        </td>
                                        <td className="text-center">
                                            <div className="dropdown">
                                                <button
                                                    className="btn btn-outline-primary-600 not-active px-18 py-11 dropdown-toggle toggle-icon"
                                                    type="button"
                                                    id={`dropdown-${user.id}`}
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    Assign Role
                                                </button>
                                                <ul className="dropdown-menu" aria-labelledby={`dropdown-${user.id}`}>
                                                    {roleStatus === 'loading' ? (
                                                        <li><span className="dropdown-item">Chargement des rôles...</span></li>
                                                    ) : roles.length === 0 ? (
                                                        <li><span className="dropdown-item">Aucun rôle disponible</span></li>
                                                    ) : (
                                                        roles.map(role => (
                                                            <li key={role.id}>
                                                                <button
                                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                                                    onClick={() => handleAssignRole(user.id, role.id)}
                                                                >
                                                                    {role.name}
                                                                </button>
                                                            </li>
                                                        ))
                                                    )}
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                    <span>Showing 1 to {displayedUsers.length} of {filteredUsers.length} entries</span>
                    <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                to="#"
                            >
                                <Icon icon="ep:d-arrow-left" className="" />
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md bg-primary-600 text-white"
                                to="#"
                            >
                                1
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                                to="#"
                            >
                                2
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                to="#"
                            >
                                3
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                to="#"
                            >
                                4
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                to="#"
                            >
                                5
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                to="#"
                            >
                                {" "}
                                <Icon icon="ep:d-arrow-right" className="" />{" "}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AssignRoleLayer;