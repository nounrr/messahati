import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchAllRoles as fetchRoles, 
    createRole, 
    updateRole, 
    deleteRole 
} from '../../Redux/roles/roleSlice';
import Swal from 'sweetalert2';

const RoleAccessLayer = () => {
    const dispatch = useDispatch();
    const { items: roles, status, error } = useSelector((state) => state.roles);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'active'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Fetch roles on component mount
    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);
    
    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    // Open modal
    const openModal = () => {
        setIsModalOpen(true);
    };
    
    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
    };
    
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            dispatch(updateRole({ id: editingId, roleData: formData }));
        } else {
            dispatch(createRole(formData));
        }
        
        // Reset form
        setFormData({
            name: '',
            description: '',
            status: 'active'
        });
        setIsEditing(false);
        setEditingId(null);
        
        // Close modal
        closeModal();
    };
    
    // Handle edit button click
    const handleEdit = (role) => {
        setFormData({
            name: role.name,
            description: role.description || '',
            status: role.status
        });
        setIsEditing(true);
        setEditingId(role.id);
        
        // Open modal
        openModal();
    };
    
    // Handle delete button click with SweetAlert
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Show loading state
                Swal.fire({
                    title: 'Deleting...',
                    text: 'Please wait while we delete this role',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                // Dispatch delete action
                dispatch(deleteRole(id))
                    .unwrap()
                    .then(() => {
                        // Show success message
                        Swal.fire(
                            'Deleted!',
                            'Role has been deleted successfully.',
                            'success'
                        );
                        
                        // Refresh the roles list to ensure UI is updated
                        dispatch(fetchRoles());
                    })
                    .catch((error) => {
                        // Show error message
                        Swal.fire(
                            'Error!',
                            error.message || 'Failed to delete role.',
                            'error'
                        );
                    });
            }
        });
    };
    
    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    };
    
    return (
        <>
            <div className="card h-100 p-0 radius-12">
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                    <div className="d-flex align-items-center flex-wrap gap-3">
                        <span className="text-md fw-medium text-secondary-light mb-0">
                            Show
                        </span>
                        <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" defaultValue="Select Number">
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
                            />
                            <Icon icon="ion:search-outline" className="icon" />
                        </form>
                        <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" defaultValue="Select Status">
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
                        onClick={() => {
                            setIsEditing(false);
                            setFormData({
                                name: '',
                                description: '',
                                status: 'active'
                            });
                            openModal();
                        }}
                    >
                        <Icon
                            icon="ic:baseline-plus"
                            className="icon text-xl line-height-1"
                        />
                        Add New Role
                    </button>
                </div>
                <div className="card-body p-24">
                    {status === 'loading' ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : status === 'failed' ? (
                        <div className="alert alert-danger" role="alert">
                            {error || 'Failed to load roles'}
                        </div>
                    ) : (
                        <>
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
                                        {roles.length > 0 ? (
                                            roles.map((role, index) => (
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
                                                    <td>{formatDate(role.created_at)}</td>
                                                    <td>{role.name}</td>
                                    <td>
                                        <p className="max-w-500-px">
                                                            {role.description || 'No description provided'}
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
                                                                onClick={() => handleEdit(role)}
                                            >
                                                <Icon icon="lucide:edit" className="menu-icon" />
                                            </button>
                                            <button
                                                type="button"
                                                className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                                onClick={() => handleDelete(role.id)}
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
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    No roles found
                                    </td>
                                </tr>
                                        )}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                                <span>Showing 1 to {roles.length} of {roles.length} entries</span>
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
                        </>
                    )}
                </div>
            </div>
            {/* Custom Modal */}
            {isModalOpen && (
                <div className="modal-custom-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1050
                }}>
                    <div className="modal-custom" style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        position: 'relative'
                    }}>
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h1 className="modal-title fs-5">
                                {isEditing ? 'Edit Role' : 'Add New Role'}
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={closeModal}
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
                                            value={formData.name}
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
                                            value={formData.description}
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
                                                    id="active"
                                                    value="active"
                                                    checked={formData.status === 'active'}
                                                    onChange={handleInputChange}
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="active"
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
                                                    id="inactive"
                                                    value="inactive"
                                                    checked={formData.status === 'inactive'}
                                                    onChange={handleInputChange}
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="inactive"
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
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary border border-primary-600 text-md px-48 py-12 radius-8"
                                            disabled={status === 'loading'}
                                        >
                                            {status === 'loading' ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RoleAccessLayer;