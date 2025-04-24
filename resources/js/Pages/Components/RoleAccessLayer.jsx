import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchAllRoles as fetchRoles, 
    createRole, 
    updateRole, 
    deleteRole 
} from '../../Redux/roles/roleSlice';
import { fetchAllPermissions, updateRolePermissions } from '../../Redux/permissions/permissionSlice';
import { fetchUsersByRole } from '../../Redux/users/userSlice';
import Swal from 'sweetalert2';
import { Modal, Button, Form, Spinner, Table, Pagination, Accordion, Card } from 'react-bootstrap';
import '../../assets/css/components/role-access-layer.css';

const RoleAccessLayer = () => {
    const dispatch = useDispatch();
    const { items: roles, status, error } = useSelector((state) => state.roles);
    const { items: permissions, status: permissionsStatus } = useSelector((state) => state.permissions);
    const { items: allUsers } = useSelector((state) => state.users);
    
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
    
    // Permissions modal state
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    
    // Doctors modal state
    const [isDoctorsModalOpen, setIsDoctorsModalOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    // État pour les médecins
    const [doctorsAccordionOpen, setDoctorsAccordionOpen] = useState(false);
    
    // Fetch roles and permissions on component mount
    useEffect(() => {
        dispatch(fetchRoles());
        dispatch(fetchAllPermissions());
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
    
    // Open permissions modal
    const openPermissionModal = (role) => {
        setSelectedRole(role);
        
        console.log("Role permissions:", role.permissions);
        
        // Récupérer les permissions déjà associées au rôle
        if (role.permissions && role.permissions.length > 0) {
            // Si le rôle a déjà des permissions, les utiliser
            const permissionIds = role.permissions.map(p => p.id);
            console.log("Setting permission IDs:", permissionIds);
            setSelectedPermissions(permissionIds);
        } else {
            // Sinon, initialiser avec un tableau vide
            setSelectedPermissions([]);
        }
        
        setIsPermissionModalOpen(true);
    };
    
    // Close permissions modal
    const closePermissionModal = () => {
        setIsPermissionModalOpen(false);
        setSelectedRole(null);
        setSelectedPermissions([]);
    };
    
    // Save role permissions
    const handleSavePermissions = async () => {
        try {
            // Show loading state
            Swal.fire({
                title: 'Saving...',
                text: 'Please wait while we update the permissions',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Call the API to update permissions
            await dispatch(updateRolePermissions({
                roleId: selectedRole.id,
                permissions: selectedPermissions
            })).unwrap();
            
            // Show success message
            Swal.fire(
                'Success!',
                'Permissions have been updated successfully.',
                'success'
            );
            
            // Refresh the roles list to ensure UI is updated
            dispatch(fetchRoles());
            closePermissionModal();
        } catch (error) {
            // Show error message
            Swal.fire(
                'Error!',
                error.message || 'Failed to update permissions.',
                'error'
            );
        }
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
    
    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };
    
    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };
    
    // Handle status filter change
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1); // Reset to first page when filtering
    };
    
    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    
    // Filter roles based on search and status
    const filteredRoles = roles.filter(role => {
        const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === '' || role.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredRoles.length);
    const paginatedRoles = filteredRoles.slice(startIndex, endIndex);
    
    // Fetch doctors
    const fetchDoctors = async () => {
        setLoadingDoctors(true);
        try {
            // Use Redux to fetch users with 'doctor' role
            await dispatch(fetchUsersByRole('docteur')).unwrap();
            // Doctors will be updated via the useEffect below
            setLoadingDoctors(false);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            Swal.fire({
                title: 'Erreur',
                text: 'Impossible de charger la liste des médecins',
                icon: 'error'
            });
            setLoadingDoctors(false);
        }
    };
    
    // Update doctors list when allUsers changes
    useEffect(() => {
        if (isDoctorsModalOpen && allUsers && allUsers.length > 0) {
            // Filter users with "doctor" role
            const doctorUsers = allUsers.filter(user => 
                user.roles && user.roles.some(role => 
                    role.name.toLowerCase() === 'docteur' || 
                    role.name.toLowerCase() === 'doctor' || 
                    role.name.toLowerCase() === 'médecin'
                )
            );
            
            setDoctors(doctorUsers);
        }
    }, [allUsers, isDoctorsModalOpen]);
    
    // Open doctors modal
    const openDoctorsModal = () => {
        setIsDoctorsModalOpen(true);
        // Fetch doctors if not already loaded
        if (doctors.length === 0 && !loadingDoctors) {
            fetchDoctors();
        }
    };
    
    // Close doctors modal
    const closeDoctorsModal = () => {
        setIsDoctorsModalOpen(false);
    };
    
    // Gérer l'ouverture/fermeture de l'accordéon des médecins
    const handleDoctorsAccordionToggle = (isOpen) => {
        setDoctorsAccordionOpen(isOpen);
        
        // Si on ouvre l'accordéon et qu'on n'a pas encore chargé les médecins
        if (isOpen && doctors.length === 0 && !loadingDoctors) {
            fetchDoctors();
        }
    };
    
    return (
        <div className="role-access-container">
            <div className="header-section">
                <h2>Role Management</h2>
                <div className="actions">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search roles..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>
                    <div className="button-group">
                        <Button 
                            variant="info" 
                            onClick={openDoctorsModal}
                            className="me-2"
                        >
                            <i className="fa fa-user-md me-1"></i> Liste des Médecins
                        </Button>
                        <Button variant="primary" onClick={() => {
                            setIsEditing(false);
                            setFormData({
                                name: '',
                                description: '',
                                status: 'active'
                            });
                            openModal();
                        }}>
                            Add New Role
                        </Button>
                    </div>
                </div>
            </div>
            
            {status === 'loading' ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : status === 'failed' ? (
                <div className="alert alert-danger" role="alert">
                    {error || 'Failed to load roles'}
                </div>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Permissions</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRoles.map((role) => (
                                <tr key={role.id}>
                                    <td>{role.name}</td>
                                    <td>{role.description || '-'}</td>
                                    <td>
                                        <span className={`status-badge ${role.status}`}>
                                            {role.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="permissions-count">
                                            {role.permissions.length} permissions
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <Button 
                                                variant="info" 
                                                size="sm"
                                                onClick={() => openPermissionModal(role)}
                                            >
                                                Permissions
                                            </Button>
                                            <Button 
                                                variant="primary" 
                                                size="sm"
                                                onClick={() => handleEdit(role)}
                                            >
                                                Edit
                                            </Button>
                                            <Button 
                                                variant="danger" 
                                                size="sm"
                                                onClick={() => handleDelete(role.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <Pagination>
                                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                
                                {[...Array(totalPages).keys()].map((number) => (
                                    <Pagination.Item
                                        key={number + 1}
                                        active={number + 1 === currentPage}
                                        onClick={() => handlePageChange(number + 1)}
                                    >
                                        {number + 1}
                                    </Pagination.Item>
                                ))}
                                
                                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                            </Pagination>
                        </div>
                    )}
                </>
            )}
            
            {/* Liste des médecins en accordéon */}
            <div className="doctors-section mt-5">
                <h3 className="mb-4">Liste des Médecins</h3>
                
                <Accordion 
                    onSelect={(eventKey) => handleDoctorsAccordionToggle(eventKey === "0")}
                >
                    <Card>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                Voir la liste des médecins
                            </Accordion.Header>
                            <Accordion.Body>
                                {loadingDoctors ? (
                                    <div className="text-center my-5">
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Chargement...</span>
                                        </Spinner>
                                    </div>
                                ) : doctors.length === 0 ? (
                                    <div className="alert alert-info">
                                        Aucun médecin trouvé. Vérifiez que des utilisateurs avec le rôle "docteur" existent dans le système.
                                    </div>
                                ) : (
                                    <Accordion className="doctors-accordion">
                                        {doctors.map((doctor, index) => (
                                            <Accordion.Item key={doctor.id} eventKey={`doctor-${doctor.id}`}>
                                                <Accordion.Header>
                                                    <div className="d-flex align-items-center justify-content-between w-100 pe-3">
                                                        <div>
                                                            <strong>{doctor.name} {doctor.prenom || ''}</strong>
                                                        </div>
                                                        <span className={`status-badge ${doctor.status || 'active'}`}>
                                                            {doctor.status || 'active'}
                                                        </span>
                                                    </div>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <div className="doctor-details">
                                                        <div className="row mb-3">
                                                            <div className="col-md-4">
                                                                <strong>Email:</strong>
                                                            </div>
                                                            <div className="col-md-8">
                                                                {doctor.email}
                                                            </div>
                                                        </div>
                                                        <div className="row mb-3">
                                                            <div className="col-md-4">
                                                                <strong>Département:</strong>
                                                            </div>
                                                            <div className="col-md-8">
                                                                {doctor.departement ? doctor.departement.nom : 'Non assigné'}
                                                            </div>
                                                        </div>
                                                        <div className="row mb-3">
                                                            <div className="col-md-4">
                                                                <strong>Téléphone:</strong>
                                                            </div>
                                                            <div className="col-md-8">
                                                                {doctor.telephone || 'Non spécifié'}
                                                            </div>
                                                        </div>
                                                        {doctor.cin && (
                                                            <div className="row mb-3">
                                                                <div className="col-md-4">
                                                                    <strong>CIN:</strong>
                                                                </div>
                                                                <div className="col-md-8">
                                                                    {doctor.cin}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="row mb-3">
                                                            <div className="col-md-4">
                                                                <strong>Statut:</strong>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <span className={`status-badge ${doctor.status || 'active'}`}>
                                                                    {doctor.status || 'active'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-end mt-3">
                                                            <Button 
                                                                variant="primary" 
                                                                size="sm"
                                                                onClick={() => alert(`Voir le profil complet de ${doctor.name}`)}
                                                            >
                                                                Voir profil complet
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Card>
                </Accordion>
                
                <style jsx>{`
                    .doctors-accordion .accordion-item {
                        margin-bottom: 8px;
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    
                    .doctors-accordion .accordion-button {
                        padding: 12px 20px;
                    }
                    
                    .status-badge {
                        padding: 4px 10px;
                        border-radius: 20px;
                        font-size: 12px;
                        text-transform: capitalize;
                    }
                    
                    .status-badge.active {
                        background-color: #198754;
                        color: white;
                    }
                    
                    .status-badge.inactive {
                        background-color: #dc3545;
                        color: white;
                    }
                    
                    .doctor-details {
                        background-color: #f8f9fa;
                        border-radius: 8px;
                        padding: 15px;
                    }
                `}</style>
            </div>
            
            {/* Modal for adding/editing roles */}
            <Modal show={isModalOpen} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Role' : 'Add New Role'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Role Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter role name"
                                required
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter description (optional)"
                                rows={3}
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={status === 'loading'}>
                        {status === 'loading' ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                Saving...
                            </>
                        ) : (
                            'Save'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
            
            {/* Modal for managing permissions */}
            {isPermissionModalOpen && selectedRole && (
                <Modal show={isPermissionModalOpen} onHide={closePermissionModal} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Manage Permissions for {selectedRole.name}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {permissionsStatus === 'loading' ? (
                            <div className="text-center my-5">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading permissions...</span>
                                </Spinner>
                            </div>
                        ) : (
                            <div className="role-permissions-container">
                                <h5 className="mb-3">Sélectionner les permissions</h5>
                                
                                <Form.Group className="mb-4">
                                    <Accordion className="permissions-accordion mb-4">
                                        {/* Groupe par catégorie pour une meilleure organisation */}
                                        <Accordion.Item eventKey="doctors">
                                            <Accordion.Header>
                                                <strong>Permissions médecin</strong>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className="permissions-list">
                                                    {permissions
                                                        .filter(p => p.name.toLowerCase().includes('doctor') || p.name.toLowerCase().includes('médecin') || p.name.toLowerCase().includes('med'))
                                                        .map(permission => (
                                                            <Form.Check
                                                                key={permission.id}
                                                                type="checkbox"
                                                                id={`permission-${permission.id}`}
                                                                label={permission.name}
                                                                checked={selectedPermissions.includes(permission.id)}
                                                                onChange={() => {
                                                                    const updatedPermissions = selectedPermissions.includes(permission.id)
                                                                        ? selectedPermissions.filter(id => id !== permission.id)
                                                                        : [...selectedPermissions, permission.id];
                                                                    setSelectedPermissions(updatedPermissions);
                                                                }}
                                                                className="mb-2"
                                                            />
                                                        ))}
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        
                                        <Accordion.Item eventKey="patients">
                                            <Accordion.Header>
                                                <strong>Permissions patient</strong>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className="permissions-list">
                                                    {permissions
                                                        .filter(p => p.name.toLowerCase().includes('patient'))
                                                        .map(permission => (
                                                            <Form.Check
                                                                key={permission.id}
                                                                type="checkbox"
                                                                id={`permission-${permission.id}`}
                                                                label={permission.name}
                                                                checked={selectedPermissions.includes(permission.id)}
                                                                onChange={() => {
                                                                    const updatedPermissions = selectedPermissions.includes(permission.id)
                                                                        ? selectedPermissions.filter(id => id !== permission.id)
                                                                        : [...selectedPermissions, permission.id];
                                                                    setSelectedPermissions(updatedPermissions);
                                                                }}
                                                                className="mb-2"
                                                            />
                                                        ))}
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        
                                        <Accordion.Item eventKey="appointments">
                                            <Accordion.Header>
                                                <strong>Permissions rendez-vous</strong>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className="permissions-list">
                                                    {permissions
                                                        .filter(p => p.name.toLowerCase().includes('appointment') || p.name.toLowerCase().includes('rendez') || p.name.toLowerCase().includes('rdv'))
                                                        .map(permission => (
                                                            <Form.Check
                                                                key={permission.id}
                                                                type="checkbox"
                                                                id={`permission-${permission.id}`}
                                                                label={permission.name}
                                                                checked={selectedPermissions.includes(permission.id)}
                                                                onChange={() => {
                                                                    const updatedPermissions = selectedPermissions.includes(permission.id)
                                                                        ? selectedPermissions.filter(id => id !== permission.id)
                                                                        : [...selectedPermissions, permission.id];
                                                                    setSelectedPermissions(updatedPermissions);
                                                                }}
                                                                className="mb-2"
                                                            />
                                                        ))}
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        
                                        <Accordion.Item eventKey="other">
                                            <Accordion.Header>
                                                <strong>Autres permissions</strong>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className="permissions-list">
                                                    {permissions
                                                        .filter(p => 
                                                            !p.name.toLowerCase().includes('doctor') && 
                                                            !p.name.toLowerCase().includes('médecin') && 
                                                            !p.name.toLowerCase().includes('med') &&
                                                            !p.name.toLowerCase().includes('patient') &&
                                                            !p.name.toLowerCase().includes('appointment') && 
                                                            !p.name.toLowerCase().includes('rendez') && 
                                                            !p.name.toLowerCase().includes('rdv')
                                                        )
                                                        .map(permission => (
                                                            <Form.Check
                                                                key={permission.id}
                                                                type="checkbox"
                                                                id={`permission-${permission.id}`}
                                                                label={permission.name}
                                                                checked={selectedPermissions.includes(permission.id)}
                                                                onChange={() => {
                                                                    const updatedPermissions = selectedPermissions.includes(permission.id)
                                                                        ? selectedPermissions.filter(id => id !== permission.id)
                                                                        : [...selectedPermissions, permission.id];
                                                                    setSelectedPermissions(updatedPermissions);
                                                                }}
                                                                className="mb-2"
                                                            />
                                                        ))}
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                    
                                    <div className="selected-count mt-3">
                                        <span className="badge bg-primary">
                                            {selectedPermissions.length} permission(s) sélectionnée(s)
                                        </span>
                                    </div>
                                </Form.Group>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closePermissionModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSavePermissions} disabled={permissionsStatus === 'loading'}>
                            {permissionsStatus === 'loading' ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                    Saving...
                                </>
                            ) : (
                                'Save Permissions'
                            )}
                        </Button>
                    </Modal.Footer>
                    
                    <style jsx>{`
                        .permissions-accordion .accordion-item {
                            margin-bottom: 8px;
                            border-radius: 8px;
                            overflow: hidden;
                        }
                        
                        .permissions-list {
                            max-height: 300px;
                            overflow-y: auto;
                        }
                        
                        .selected-count {
                            text-align: center;
                        }
                    `}</style>
                </Modal>
            )}
            
            {/* Modal for doctors list */}
            <Modal 
                show={isDoctorsModalOpen} 
                onHide={closeDoctorsModal} 
                centered 
                size="lg"
                className="doctors-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Liste des Médecins
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loadingDoctors ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Chargement...</span>
                            </Spinner>
                        </div>
                    ) : doctors.length === 0 ? (
                        <div className="alert alert-info">
                            Aucun médecin trouvé. Vérifiez que des utilisateurs avec le rôle "docteur" existent dans le système.
                        </div>
                    ) : (
                        <Accordion className="doctors-accordion">
                            {doctors.map(doctor => (
                                <Accordion.Item key={doctor.id} eventKey={`doctor-${doctor.id}`}>
                                    <Accordion.Header>
                                        <div className="d-flex align-items-center justify-content-between w-100 pe-3">
                                            <div>
                                                <strong>{doctor.name} {doctor.prenom || ''}</strong>
                                            </div>
                                            <span className={`status-badge ${doctor.status || 'active'}`}>
                                                {doctor.status || 'active'}
                                            </span>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className="doctor-details">
                                            <div className="row mb-3">
                                                <div className="col-md-4">
                                                    <strong>Email:</strong>
                                                </div>
                                                <div className="col-md-8">
                                                    {doctor.email}
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-4">
                                                    <strong>Département:</strong>
                                                </div>
                                                <div className="col-md-8">
                                                    {doctor.departement ? doctor.departement.nom : 'Non assigné'}
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-4">
                                                    <strong>Téléphone:</strong>
                                                </div>
                                                <div className="col-md-8">
                                                    {doctor.telephone || 'Non spécifié'}
                                                </div>
                                            </div>
                                            {doctor.cin && (
                                                <div className="row mb-3">
                                                    <div className="col-md-4">
                                                        <strong>CIN:</strong>
                                                    </div>
                                                    <div className="col-md-8">
                                                        {doctor.cin}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="row mb-3">
                                                <div className="col-md-4">
                                                    <strong>Statut:</strong>
                                                </div>
                                                <div className="col-md-8">
                                                    <span className={`status-badge ${doctor.status || 'active'}`}>
                                                        {doctor.status || 'active'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-end mt-3">
                                                <Button 
                                                    variant="primary" 
                                                    size="sm"
                                                    onClick={() => alert(`Voir le profil complet de ${doctor.name}`)}
                                                >
                                                    Voir profil complet
                                                </Button>
                                            </div>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDoctorsModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
                
                <style jsx>{`
                    .doctors-accordion .accordion-item {
                        margin-bottom: 8px;
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    
                    .doctors-accordion .accordion-button {
                        padding: 12px 20px;
                    }
                    
                    .status-badge {
                        padding: 4px 10px;
                        border-radius: 20px;
                        font-size: 12px;
                        text-transform: capitalize;
                    }
                    
                    .status-badge.active {
                        background-color: #198754;
                        color: white;
                    }
                    
                    .status-badge.inactive {
                        background-color: #dc3545;
                        color: white;
                    }
                    
                    .doctor-details {
                        background-color: #f8f9fa;
                        border-radius: 8px;
                        padding: 15px;
                    }
                    
                    .button-group {
                        display: flex;
                        align-items: center;
                    }
                `}</style>
            </Modal>
        </div>
    );
};

export default RoleAccessLayer;