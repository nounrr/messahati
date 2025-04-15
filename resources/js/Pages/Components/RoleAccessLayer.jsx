import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles, clearError } from '../../Redux/rolePermissions/rolePermissionSlice';

const RoleAccessLayer = () => {
    const dispatch = useDispatch();
    const { roles, status, error } = useSelector((state) => state.rolePermissions);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('Select Status');
    const [showCount, setShowCount] = useState(10);
    const [newRole, setNewRole] = useState({
        name: '',
        description: '',
        status: 'Active'
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRole(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ici, vous pouvez ajouter la logique pour créer un nouveau rôle
        // Par exemple: dispatch(createRole(newRole));
        setShowModal(false);
        setNewRole({
            name: '',
            description: '',
            status: 'Active'
        });
    };

    const filteredRoles = roles.filter(role => {
        const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'Select Status' || 
            (selectedStatus === 'Active' && role.status === 'active') || 
            (selectedStatus === 'Inactive' && role.status === 'inactive');
        return matchesSearch && matchesStatus;
    });

    const displayedRoles = filteredRoles.slice(0, showCount);

    return (
        <>
            <div className="card h-100 p-0 radius-12">
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                    <div className="d-flex align-items-center flex-wrap gap-3">
                        <span className="text-md fw-medium text-secondary-light mb-0">
                            Show
                        </span>
                        <select 
                            className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" 
                            value={showCount}
                            onChange={(e) => setShowCount(Number(e.target.value))}
                        >
                            <option value="Select Number" disabled>
                                Select Number
                            </option>
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
                            <option value="Select Status" disabled>
                                Select Status
                            </option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                        onClick={() => setShowModal(true)}
                    >
                        <Icon
                            icon="ic:baseline-plus"
                            className="icon text-xl line-height-1"
                        />
                        Add New Role
                    </button>
                </div>
                <div className="card-body p-24">
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
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
                                    <th scope="col">Create Date</th>
                                    <th scope="col">Role </th>
                                    <th scope="col">Description</th>
                                    <th scope="col" className="text-center">
                                        Status
                                    </th>
                                    <th scope="col" className="text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {status === 'loading' ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">Chargement...</td>
                                    </tr>
                                ) : displayedRoles.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">Aucun rôle trouvé</td>
                                    </tr>
                                ) : (
                                    displayedRoles.map((role, index) => (
                                        <tr key={role.id}>
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
                                            <td>{new Date(role.created_at).toLocaleDateString()}</td>
                                            <td>{role.name}</td>
                                            <td>
                                                <p className="max-w-500-px">
                                                    {role.description || "Aucune description"}
                                                </p>
                                            </td>
                                            <td className="text-center">
                                                <span className={`${role.status === 'active' ? 'bg-success-focus text-success-600 border border-success-main' : 'bg-danger-focus text-danger-600 border border-danger-main'} px-24 py-4 radius-4 fw-medium text-sm`}>
                                                    {role.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex align-items-center gap-10 justify-content-center">
                                                    <button
                                                        type="button"
                                                        className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                        onClick={() => {
                                                            setNewRole({
                                                                name: role.name,
                                                                description: role.description || '',
                                                                status: role.status === 'active' ? 'Active' : 'Inactive'
                                                            });
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        <Icon icon="lucide:edit" className="menu-icon" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                        onClick={() => {
                                                            // Ici, vous pouvez ajouter la logique pour supprimer un rôle
                                                            // Par exemple: dispatch(deleteRole(role.id));
                                                        }}
                                                    >
                                                        <Icon
                                                            icon="fluent:delete-24-regular"
                                                            className="menu-icon"
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                        <span>Showing 1 to {displayedRoles.length} of {filteredRoles.length} entries</span>
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
            {/* Modal Start */}
            {showModal && (
                <div
                    className="modal fade show"
                    id="exampleModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="false"
                    style={{ display: 'block' }}
                >
                    <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
                        <div className="modal-content radius-16 bg-base">
                            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">
                                    {newRole.id ? 'Edit Role' : 'Add New Role'}
                                </h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body p-24">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-12 mb-20">
                                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                Role Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control radius-8"
                                                placeholder="Enter Role Name"
                                                name="name"
                                                value={newRole.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-12 mb-20">
                                            <label
                                                htmlFor="desc"
                                                className="form-label fw-semibold text-primary-light text-sm mb-8"
                                            >
                                                Description
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="desc"
                                                rows={4}
                                                cols={50}
                                                placeholder="Write some text"
                                                name="description"
                                                value={newRole.description}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-12 mb-20">
                                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                Status{" "}
                                            </label>
                                            <div className="d-flex align-items-center flex-wrap gap-28">
                                                <div className="form-check checked-success d-flex align-items-center gap-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="status"
                                                        id="Active"
                                                        value="Active"
                                                        checked={newRole.status === 'Active'}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label
                                                        className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                        htmlFor="Active"
                                                    >
                                                        <span className="w-8-px h-8-px bg-success-600 rounded-circle" />
                                                        Active
                                                    </label>
                                                </div>
                                                <div className="form-check checked-danger d-flex align-items-center gap-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="status"
                                                        id="Inactive"
                                                        value="Inactive"
                                                        checked={newRole.status === 'Inactive'}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label
                                                        className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                        htmlFor="Inactive"
                                                    >
                                                        <span className="w-8-px h-8-px bg-danger-600 rounded-circle" />
                                                        Inactive
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                                            <button
                                                type="button"
                                                className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary border border-primary-600 text-md px-48 py-12 radius-8"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </div>
            )}
            {/* Modal End */}
        </>
    );
};

export default RoleAccessLayer;