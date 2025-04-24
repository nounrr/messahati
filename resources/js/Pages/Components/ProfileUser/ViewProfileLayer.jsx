import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUsers, changePassword } from '../../../Redux/users/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const ViewProfileLayer = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        telephone: user?.telephone || '',
        photo: null
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [imagePreview, setImagePreview] = useState(user?.img_path || 'assets/images/user-grid/doctor.jpg');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    // Mettre à jour formData quand user change
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                telephone: user.telephone || '',
                photo: null
            });
            setImagePreview(user.img_path || 'assets/images/user-grid/doctor.jpg');
        }
    }, [user]);

    // Toggle function for password field
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Toggle function for confirm password field
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const readURL = (input) => {
        if (input.target.files && input.target.files[0]) {
            const file = input.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
                setFormData(prev => ({
                    ...prev,
                    photo: file
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await dispatch(updateUsers([{ ...formData, id: user.id }])).unwrap();
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsPasswordLoading(true);
        try {
            // Validation côté client
            if (!passwordData.current_password) {
                toast.error('Le mot de passe actuel est requis', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }
            if (!passwordData.new_password) {
                toast.error('Le nouveau mot de passe est requis', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }
            if (passwordData.new_password.length < 8) {
                toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }
            if (passwordData.new_password !== passwordData.confirm_password) {
                toast.error('Le nouveau mot de passe et la confirmation ne correspondent pas', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }

            const result = await dispatch(changePassword(passwordData)).unwrap();
            
            if (result.success) {
                toast.success(result.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                // Réinitialiser le formulaire
                setPasswordData({
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                });
                // Réinitialiser les états de visibilité
                setCurrentPasswordVisible(false);
                setPasswordVisible(false);
                setConfirmPasswordVisible(false);
            } else {
                toast.error(result.message || 'Échec du changement de mot de passe', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            if (error.message === 'Session expirée. Veuillez vous reconnecter.') {
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                // Rediriger vers la page de connexion
                window.location.href = '/login';
            } else {
                toast.error(error.message || 'Une erreur est survenue lors du changement de mot de passe', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } finally {
            setIsPasswordLoading(false);
        }
    };

    return (
        <div
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />
            <ToastContainer />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="row gy-4">
                <div className="col-lg-4">
                    <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
                        <img
                                    src="assets/images/user-grid/arriere_plan.jpg"
                            alt=""
                            className="w-100 object-fit-cover"
                        />
                        <div className="pb-24 ms-16 mb-24 me-16 mt--100">
                            <div className="text-center border border-top-0 border-start-0 border-end-0">
                                <img
                                    src={imagePreview}
                                    alt={user?.name}
                                    className="border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover"
                                />
                                <h6 className="mb-0 mt-16">{user?.name}</h6>
                                <span className="text-secondary-light mb-16">{user?.email}</span>
                                        {/* <div className="mt-2">
                                            {user?.roles?.map((role, index) => (
                                                <span 
                                                    key={index}
                                                    className="badge bg-primary me-1"
                                                >
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                        {user?.departement && (
                                            <div className="mt-2">
                                                <span className="badge bg-orange-500">
                                                    {user.departement.nom}
                                                </span>
                                            </div>
                                        )} */}
                            </div>
                            <div className="mt-24">
                                <h6 className="text-xl mb-16">Personal Info</h6>
                                <ul>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            Full Name
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                            : {user?.name}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            Email
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                            : {user?.email}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            Phone Number
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                                    : {user?.telephone || 'N/A'}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            Department
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                                    : {user?.departement?.nom || 'N/A'}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                                    Roles
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                                    : {user?.roles?.join(', ') || 'N/A'}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                            <div className="card h-100">
                                <div className="card-body p-24">
                                    <ul
                                        className="nav border-gradient-tab nav-pills mb-20 d-inline-flex"
                                        id="pills-tab"
                                        role="tablist"
                                    >
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link d-flex align-items-center px-24 active"
                                                id="pills-edit-profile-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-edit-profile"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-edit-profile"
                                                aria-selected="true"
                                            >
                                                Edit Profile
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link d-flex align-items-center px-24"
                                                id="pills-change-passwork-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-change-passwork"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-change-passwork"
                                                aria-selected="false"
                                                tabIndex={-1}
                                            >
                                                Change Password
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="tab-content" id="pills-tabContent">
                                        <div
                                            className="tab-pane fade show active"
                                            id="pills-edit-profile"
                                            role="tabpanel"
                                            aria-labelledby="pills-edit-profile-tab"
                                            tabIndex={0}
                                        >
                                            <h6 className="text-md text-primary-light mb-16">Profile Image</h6>
                                            <div className="mb-24 mt-16">
                                                <div className="avatar-upload">
                                                    <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                                                        <input
                                                            type="file"
                                                            id="imageUpload"
                                                            accept=".png, .jpg, .jpeg"
                                                            hidden
                                                            onChange={readURL}
                                                        />
                                                        <label
                                                            htmlFor="imageUpload"
                                                            className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                                                        >
                                                            <Icon icon="solar:camera-outline" className="icon"></Icon>
                                                        </label>
                                                    </div>
                                                    <div className="avatar-preview">
                                                        <div
                                                            id="imagePreview"
                                                            style={{
                                                                backgroundImage: `url(${imagePreview})`,
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                        </div>
                                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <div className="mb-20">
                                                            <label
                                                                htmlFor="name"
                                                                className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                            >
                                                                Full Name
                                                                <span className="text-danger-600">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control radius-8"
                                                                id="name"
                                                                name="name"
                                                                value={formData.name}
                                                                onChange={handleInputChange}
                                                                placeholder="Enter Full Name"
                                                            />
                                        </div>
                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="mb-20">
                                                            <label
                                                                htmlFor="email"
                                                                className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                            >
                                                                Email <span className="text-danger-600">*</span>
                                                            </label>
                                                            <input
                                                                type="email"
                                                                className="form-control radius-8"
                                                                id="email"
                                                                name="email"
                                                                value={formData.email}
                                                                onChange={handleInputChange}
                                                                placeholder="Enter email address"
                                                            />
                                        </div>
                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="mb-20">
                                                            <label
                                                                htmlFor="telephone"
                                                                className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                            >
                                                                Phone
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control radius-8"
                                                                id="telephone"
                                                                name="telephone"
                                                                value={formData.telephone}
                                                                onChange={handleInputChange}
                                                                placeholder="Enter phone number"
                                                            />
                                        </div>
                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="mb-20">
                                                            <label
                                                                htmlFor="department"
                                                                className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                            >
                                                                Department
                                                                <span className="text-danger-600">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control radius-8"
                                                                id="department"
                                                                name="department"
                                                                value={user?.departement?.nom || ''}
                                                                disabled
                                                                placeholder="Your department"
                                                            />
                                                        </div>
                                        </div>
                                    </div>
                                                <div className="d-flex align-items-center justify-content-center gap-3">
                                                    <button
                                                        type="button"
                                                        className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? 'Saving...' : 'Save'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        <div 
                                            className="tab-pane fade" 
                                            id="pills-change-passwork" 
                                            role="tabpanel" 
                                            aria-labelledby="pills-change-passwork-tab" 
                                            tabIndex="0"
                                        >
                                            <form onSubmit={handlePasswordSubmit}>
                                                <div className="mb-20">
                                                    <label htmlFor="current-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                        Current Password <span className="text-danger-600">*</span>
                                                    </label>
                                                    <div className="position-relative">
                                                        <input
                                                            type={currentPasswordVisible ? "text" : "password"}
                                                            className="form-control radius-8"
                                                            id="current-password"
                                                            name="current_password"
                                                            value={passwordData.current_password}
                                                            onChange={handlePasswordChange}
                                                            placeholder="Enter Current Password*"
                                                            required
                                                        />
                                                        <span
                                                            className={`toggle-password ${currentPasswordVisible ? "ri-eye-off-line" : "ri-eye-line"} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                                            onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                                                        ></span>
                                                    </div>
                                                </div>

                                                <div className="mb-20">
                                                    <label htmlFor="new-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                        New Password <span className="text-danger-600">*</span>
                                                    </label>
                                                    <div className="position-relative">
                                                        <input
                                                            type={passwordVisible ? "text" : "password"}
                                                            className="form-control radius-8"
                                                            id="new-password"
                                                            name="new_password"
                                                            value={passwordData.new_password}
                                                            onChange={handlePasswordChange}
                                                            placeholder="Enter New Password*"
                                                            required
                                                        />
                                                        <span
                                                            className={`toggle-password ${passwordVisible ? "ri-eye-off-line" : "ri-eye-line"} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                                            onClick={togglePasswordVisibility}
                                                        ></span>
                                                    </div>
                                                </div>

                                                <div className="mb-20">
                                                    <label htmlFor="confirm-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                        Confirm Password <span className="text-danger-600">*</span>
                                                    </label>
                                                    <div className="position-relative">
                                                        <input
                                                            type={confirmPasswordVisible ? "text" : "password"}
                                                            className="form-control radius-8"
                                                            id="confirm-password"
                                                            name="confirm_password"
                                                            value={passwordData.confirm_password}
                                                            onChange={handlePasswordChange}
                                                            placeholder="Confirm Password*"
                                                            required
                                                        />
                                                        <span
                                                            className={`toggle-password ${confirmPasswordVisible ? "ri-eye-off-line" : "ri-eye-line"} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                                            onClick={toggleConfirmPasswordVisibility}
                                                        ></span>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-center gap-3">
                                                    <button
                                                        type="button"
                                                        className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                                                        onClick={() => setPasswordData({
                                                            current_password: '',
                                                            new_password: '',
                                                            confirm_password: ''
                                                        })}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                                                        disabled={isPasswordLoading}
                                                    >
                                                        {isPasswordLoading ? 'Changing...' : 'Change Password'}
                                                    </button>
                                    </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProfileLayer;