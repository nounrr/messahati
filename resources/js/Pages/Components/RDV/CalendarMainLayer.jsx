import React, { useEffect, useRef, useState } from 'react'
import Calendar from './Calendar'
import { Icon } from '@iconify/react/dist/iconify.js'
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


const DatePicker = ({ id, placeholder }) => {
    const datePickerRef = useRef(null);

    useEffect(() => {
        flatpickr(datePickerRef.current, {
            enableTime: true,
            dateFormat: 'd/m/Y H:i',
        });
    }, []);

    return (
        <input
            ref={datePickerRef}
            id={id}
            type="text"
            className="form-control radius-8 bg-base"
            placeholder={placeholder}
        />
    );
};


const CalendarMainLayer = () => {
    const [patientType, setPatientType] = useState('existing'); // 'existing' ou 'new'
    const [cinSearchTerm, setCinSearchTerm] = useState('');
    const [searchDoctorTerm, setSearchDoctorTerm] = useState('');
    const [foundPatient, setFoundPatient] = useState(null);
    const [foundDoctors, setFoundDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    
    // Fonction pour basculer entre les formulaires
    const handlePatientTypeChange = (type) => {
        setPatientType(type);
        setFoundPatient(null);
        setCinSearchTerm('');
    };
    
    // Simuler une recherche de patient par CIN (à remplacer par un appel API réel)
    const searchPatientByCIN = () => {
        if (cinSearchTerm.length > 3) {
            setIsSearching(true);
            // Simuler un délai d'appel API
            setTimeout(() => {
                // Simulation de résultats - à remplacer par un appel API
                const mockPatients = [
                    { id: 1, name: 'Ahmed', prenom: 'Benali', cin: 'AB123456', dateNaissance: '15/05/1985', email: 'ahmed@example.com' },
                    { id: 2, name: 'Fatima', prenom: 'Zahra', cin: 'CD789012', dateNaissance: '22/09/1990', email: 'fatima@example.com' },
                    { id: 3, name: 'Karim', prenom: 'Mansouri', cin: 'EF345678', dateNaissance: '03/12/1978', email: 'karim@example.com' },
                ];
                
                const patient = mockPatients.find(p => p.cin.toLowerCase() === cinSearchTerm.toLowerCase());
                setFoundPatient(patient || null);
                setIsSearching(false);
            }, 500);
        } else {
            setFoundPatient(null);
        }
    };
    
    // Simuler une liste de médecins pour le select (à remplacer par un appel API réel)
    useEffect(() => {
        // Simulation de données - à remplacer par un appel API
        const allDoctors = [
            { id: 1, nom: 'Dr. Mohammed Alaoui', specialite: 'Cardiologie' },
            { id: 2, nom: 'Dr. Samira Tazi', specialite: 'Dermatologie' },
            { id: 3, nom: 'Dr. Youssef Benjelloun', specialite: 'Pédiatrie' },
            { id: 4, nom: 'Dr. Laila Benmoussa', specialite: 'Ophtalmologie' },
            { id: 5, nom: 'Dr. Omar Kadiri', specialite: 'Orthopédie' },
            { id: 6, nom: 'Dr. Nadia Chaoui', specialite: 'Gynécologie' },
        ];
        
        if (!searchDoctorTerm) {
            setFoundDoctors(allDoctors);
        } else {
            const filtered = allDoctors.filter(d => 
                d.nom.toLowerCase().includes(searchDoctorTerm.toLowerCase()) ||
                d.specialite.toLowerCase().includes(searchDoctorTerm.toLowerCase())
            );
            setFoundDoctors(filtered);
        }
    }, [searchDoctorTerm]);
    
    // Réinitialiser le formulaire de recherche
    const resetPatientSearch = () => {
        setFoundPatient(null);
        setCinSearchTerm('');
    };
    
    return (
        <>
            <div className="row gy-4">
                <div className="col-xxl-3 col-lg-4">
                    <div className="card h-100 p-0">
                        <div className="card-body p-24">
                            <button
                                type="button"
                                className="btn btn-primary text-sm btn-sm px-12 py-12 w-100 radius-8 d-flex align-items-center gap-2 mb-32"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                            >
                                <Icon
                                    icon="fa6-regular:square-plus"
                                    className="icon text-lg line-height-1"
                                />
                                Ajouter un rendez-vous
                            </button>
                            <div className="mt-32">
                                <div className="event-item d-flex align-items-center justify-content-between gap-4 pb-16 mb-16 border border-start-0 border-end-0 border-top-0">
                                    <div className="">
                                        <div className="d-flex align-items-center gap-10">
                                            <span className="w-12-px h-12-px bg-warning-600 rounded-circle fw-medium" />
                                            <span className="text-secondary-light">
                                                Today, 10:30 PM - 02:30 AM
                                            </span>
                                        </div>
                                        <span className="text-primary-light fw-semibold text-md mt-4">
                                            Design Conference
                                        </span>
                                    </div>
                                    <div className="dropdown">
                                        <button
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <Icon
                                                icon="entypo:dots-three-vertical"
                                                className="icon text-secondary-light"
                                            />
                                        </button>
                                        <ul className="dropdown-menu p-12 border bg-base shadow">
                                            <li>
                                                <button
                                                    type="button"
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalView"
                                                >
                                                    <Icon
                                                        icon="hugeicons:view"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    View
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalEdit"
                                                >
                                                    <Icon
                                                        icon="lucide:edit"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    Edit
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="delete-item dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-danger-100 text-hover-danger-600 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalDelete"
                                                >
                                                    <Icon
                                                        icon="fluent:delete-24-regular"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="event-item d-flex align-items-center justify-content-between gap-4 pb-16 mb-16 border border-start-0 border-end-0 border-top-0">
                                    <div className="">
                                        <div className="d-flex align-items-center gap-10">
                                            <span className="w-12-px h-12-px bg-success-600 rounded-circle fw-medium" />
                                            <span className="text-secondary-light">
                                                Today, 10:30 PM - 02:30 AM
                                            </span>
                                        </div>
                                        <span className="text-primary-light fw-semibold text-md mt-4">
                                            Weekend Festival
                                        </span>
                                    </div>
                                    <div className="dropdown">
                                        <button
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <Icon
                                                icon="entypo:dots-three-vertical"
                                                className="icon text-secondary-light"
                                            />
                                        </button>
                                        <ul className="dropdown-menu p-12 border bg-base shadow">
                                            <li>
                                                <button
                                                    type="button"
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalView"
                                                >
                                                    <Icon
                                                        icon="hugeicons:view"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    View
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalEdit"
                                                >
                                                    <Icon
                                                        icon="lucide:edit"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    Edit
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="delete-item dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-danger-100 text-hover-danger-600 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalDelete"
                                                >
                                                    <Icon
                                                        icon="fluent:delete-24-regular"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="event-item d-flex align-items-center justify-content-between gap-4 pb-16 mb-16 border border-start-0 border-end-0 border-top-0">
                                    <div className="">
                                        <div className="d-flex align-items-center gap-10">
                                            <span className="w-12-px h-12-px bg-info-600 rounded-circle fw-medium" />
                                            <span className="text-secondary-light">
                                                Today, 10:30 PM - 02:30 AM
                                            </span>
                                        </div>
                                        <span className="text-primary-light fw-semibold text-md mt-4">
                                            Design Conference
                                        </span>
                                    </div>
                                    <div className="dropdown">
                                        <button
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <Icon
                                                icon="entypo:dots-three-vertical"
                                                className="icon text-secondary-light"
                                            />
                                        </button>
                                        <ul className="dropdown-menu p-12 border bg-base shadow">
                                            <li>
                                                <button
                                                    type="button"
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalView"
                                                >
                                                    <Icon
                                                        icon="hugeicons:view"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    View
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalEdit"
                                                >
                                                    <Icon
                                                        icon="lucide:edit"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    Edit
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="delete-item dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-danger-100 text-hover-danger-600 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalDelete"
                                                >
                                                    <Icon
                                                        icon="fluent:delete-24-regular"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="event-item d-flex align-items-center justify-content-between gap-4 pb-16 mb-16 border border-start-0 border-end-0 border-top-0">
                                    <div className="">
                                        <div className="d-flex align-items-center gap-10">
                                            <span className="w-12-px h-12-px bg-warning-600 rounded-circle fw-medium" />
                                            <span className="text-secondary-light">
                                                Today, 10:30 PM - 02:30 AM
                                            </span>
                                        </div>
                                        <span className="text-primary-light fw-semibold text-md mt-4">
                                            Ultra Europe 2019
                                        </span>
                                    </div>
                                    <div className="dropdown">
                                        <button
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <Icon
                                                icon="entypo:dots-three-vertical"
                                                className="icon text-secondary-light"
                                            />
                                        </button>
                                        <ul className="dropdown-menu p-12 border bg-base shadow">
                                            <li>
                                                <button
                                                    type="button"
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalView"
                                                >
                                                    <Icon
                                                        icon="hugeicons:view"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    View
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalEdit"
                                                >
                                                    <Icon
                                                        icon="lucide:edit"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    Edit
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="delete-item dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-danger-100 text-hover-danger-600 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalDelete"
                                                >
                                                    <Icon
                                                        icon="fluent:delete-24-regular"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="event-item d-flex align-items-center justify-content-between gap-4 pb-16 mb-16 border border-start-0 border-end-0 border-top-0">
                                    <div className="">
                                        <div className="d-flex align-items-center gap-10">
                                            <span className="w-12-px h-12-px bg-warning-600 rounded-circle fw-medium" />
                                            <span className="text-secondary-light">
                                                Today, 10:30 PM - 02:30 AM
                                            </span>
                                        </div>
                                        <span className="text-primary-light fw-semibold text-md mt-4">
                                            Design Conference
                                        </span>
                                    </div>
                                    <div className="dropdown">
                                        <button
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <Icon
                                                icon="entypo:dots-three-vertical"
                                                className="icon text-secondary-light"
                                            />
                                        </button>
                                        <ul className="dropdown-menu p-12 border bg-base shadow">
                                            <li>
                                                <button
                                                    type="button"
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalView"
                                                >
                                                    <Icon
                                                        icon="hugeicons:view"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    View
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalEdit"
                                                >
                                                    <Icon
                                                        icon="lucide:edit"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    Edit
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="delete-item dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-danger-100 text-hover-danger-600 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalDelete"
                                                >
                                                    <Icon
                                                        icon="fluent:delete-24-regular"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-9 col-lg-8">
                    <div className="card h-100 p-0">
                        <div className="card-body p-24">
                            <div id="wrap">
                                <div id="calendar" />
                                <div style={{ clear: "both" }} />
                                <Calendar />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Add Event */}
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                Ajouter un rendez-vous
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body p-24">
                            {/* Sélecteur de type de patient */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <label className="form-label fw-semibold text-primary-light text-sm mb-3">
                                        Type de patient:
                                    </label>
                                    <div className="d-flex gap-4">
                                        <button 
                                            className={`btn w-50 ${patientType === 'existing' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => handlePatientTypeChange('existing')}
                                            type="button"
                                        >
                                            Patient existant
                                        </button>
                                        <button 
                                            className={`btn w-50 ${patientType === 'new' ? 'btn-success' : 'btn-outline-success'}`}
                                            onClick={() => handlePatientTypeChange('new')}
                                            type="button"
                                        >
                                            Nouveau patient
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Formulaire pour patient existant */}
                            <div id="existingPatientForm" className="mb-4" style={{ display: patientType === 'existing' ? 'block' : 'none' }}>
                                <div className="row">
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Rechercher un patient par CIN:
                                        </label>
                                        
                                        {foundPatient ? (
                                            <div className="patient-info border rounded p-3 bg-light mb-3">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h5 className="fw-bold mb-0">{foundPatient.name} {foundPatient.prenom}</h5>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={resetPatientSearch}
                                                    >
                                                        Changer
                                                    </button>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p className="mb-1"><strong>CIN:</strong> {foundPatient.cin}</p>
                                                        <p className="mb-1"><strong>Date de naissance:</strong> {foundPatient.dateNaissance}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="mb-1"><strong>Email:</strong> {foundPatient.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="cin-search">
                                                <div className="input-group mb-2">
                                                    <input
                                                        type="text"
                                                        className="form-control radius-8"
                                                        placeholder="Entrez le CIN du patient"
                                                        value={cinSearchTerm}
                                                        onChange={(e) => setCinSearchTerm(e.target.value)}
                                                    />
                                                    <button 
                                                        className="btn btn-primary" 
                                                        type="button"
                                                        onClick={searchPatientByCIN}
                                                        disabled={isSearching || cinSearchTerm.length < 4}
                                                    >
                                                        {isSearching ? (
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        ) : (
                                                            <Icon icon="iconamoon:search" className="icon" />
                                                        )}
                                                    </button>
                                                </div>
                                                {isSearching && <p className="text-muted small">Recherche en cours...</p>}
                                                {!isSearching && cinSearchTerm.length > 3 && !foundPatient && (
                                                    <div className="alert alert-warning py-2 px-3">
                                                        Aucun patient trouvé avec ce CIN
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Formulaire pour nouveau patient */}
                            <div id="newPatientForm" className="mb-4" style={{ display: patientType === 'new' ? 'block' : 'none' }}>
                                <div className="row">
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            CIN:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            placeholder="CIN du patient"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Nom:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            placeholder="Nom du patient"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Prénom:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            placeholder="Prénom du patient"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Email:
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control radius-8"
                                            placeholder="Email du patient"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Téléphone:
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control radius-8"
                                            placeholder="Téléphone du patient"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Adresse:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            placeholder="Adresse du patient"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Détails du rendez-vous (commun aux deux options) */}
                            <div className="row mt-4">
                                <div className="col-md-6 mb-20">
                                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                        Département:
                                    </label>
                                    <select className="form-select radius-8">
                                        <option value="">Sélectionner un département</option>
                                        <option value="1">Cardiologie</option>
                                        <option value="2">Dentaire</option>
                                        <option value="3">Dermatologie</option>
                                        <option value="4">Pédiatrie</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-20">
                                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                        Type de traitement:
                                    </label>
                                    <select className="form-select radius-8">
                                        <option value="">Sélectionner un traitement</option>
                                        <option value="1">Consultation</option>
                                        <option value="2">Suivi</option>
                                        <option value="3">Intervention</option>
                                    </select>
                                </div>
                                
                                {/* Sélection de médecin via select */}
                                <div className="col-12 mb-20">
                                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                        Médecin:
                                    </label>
                                    <div className="doctor-selection">
                                        <div className="input-group mb-2">
                                            <input
                                                type="text"
                                                className="form-control radius-8"
                                                placeholder="Filtrer les médecins..."
                                                value={searchDoctorTerm}
                                                onChange={(e) => setSearchDoctorTerm(e.target.value)}
                                            />
                                            {searchDoctorTerm && (
                                                <button 
                                                    className="btn btn-outline-secondary" 
                                                    type="button"
                                                    onClick={() => setSearchDoctorTerm('')}
                                                >
                                                    <Icon icon="mdi:close" className="icon" />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <select 
                                            className="form-select radius-8"
                                            value={selectedDoctor ? selectedDoctor.id : ''}
                                            onChange={(e) => {
                                                const doctorId = parseInt(e.target.value);
                                                const doctor = foundDoctors.find(d => d.id === doctorId);
                                                setSelectedDoctor(doctor || null);
                                            }}
                                        >
                                            <option value="">Sélectionner un médecin</option>
                                            {foundDoctors.map(doctor => (
                                                <option key={doctor.id} value={doctor.id}>
                                                    {doctor.nom} - {doctor.specialite}
                                                </option>
                                            ))}
                                        </select>
                                        
                                        {selectedDoctor && (
                                            <div className="doctor-info mt-2 p-2 border rounded bg-light">
                                                <p className="mb-0 fw-semibold">{selectedDoctor.nom}</p>
                                                <p className="mb-0 text-muted small">Spécialité: {selectedDoctor.specialite}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="col-md-6 mb-20">
                                    <label
                                        htmlFor="startDate"
                                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                                    >
                                        Date et heure
                                    </label>
                                    <div className="position-relative">
                                        <DatePicker className="form-control radius-8 bg-base" id="startDate" placeholder="03/12/2024, 10:30 AM" />
                                        <span className="position-absolute end-0 top-50 translate-middle-y me-12 line-height-1">
                                            <Icon icon="solar:calendar-linear" className="icon text-lg"></Icon>
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-20">
                                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                        Statut du paiement:
                                    </label>
                                    <select className="form-select radius-8">
                                        <option value="1">Payé</option>
                                        <option value="2">En attente</option>
                                        <option value="3">Paiement à l'arrivée</option>
                                    </select>
                                </div>
                                <div className="col-12 mb-20">
                                    <label
                                        htmlFor="desc"
                                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                                    >
                                        Remarques
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="desc"
                                        rows={4}
                                        cols={50}
                                        placeholder="Informations supplémentaires"
                                        defaultValue={""}
                                    />
                                </div>
                                <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                                    <button
                                        type="reset"
                                        className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                                        data-bs-dismiss="modal"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8"
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal View Event */}
            <div
                className="modal fade"
                id="exampleModalView"
                tabIndex={-1}
                aria-labelledby="exampleModalViewLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="exampleModalViewLabel">
                                View Details
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body p-24">
                            <div className="mb-12">
                                <span className="text-secondary-light txt-sm fw-medium">Title</span>
                                <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                    Design Conference
                                </h6>
                            </div>
                            <div className="mb-12">
                                <span className="text-secondary-light txt-sm fw-medium">
                                    Start Date
                                </span>
                                <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                    25 Jan 2024, 10:30AM
                                </h6>
                            </div>
                            <div className="mb-12">
                                <span className="text-secondary-light txt-sm fw-medium">
                                    End Date
                                </span>
                                <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                    25 Jan 2024, 2:30AM
                                </h6>
                            </div>
                            <div className="mb-12">
                                <span className="text-secondary-light txt-sm fw-medium">
                                    Description
                                </span>
                                <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                    N/A
                                </h6>
                            </div>
                            <div className="mb-12">
                                <span className="text-secondary-light txt-sm fw-medium">Label</span>
                                <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4 d-flex align-items-center gap-2">
                                    <span className="w-8-px h-8-px bg-success-600 rounded-circle" />
                                    Business
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Edit Event */}
            <div
                className="modal fade"
                id="exampleModalEdit"
                tabIndex={-1}
                aria-labelledby="exampleModalEditLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                                Edit Event
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body p-24">
                            <form action="#">
                                <div className="row">
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Event Title :{" "}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            placeholder="Enter Event Title "
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label
                                            htmlFor="editstartDate"
                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                        >
                                            Start Date
                                        </label>
                                        <div className=" position-relative">

                                            <DatePicker className="form-control radius-8 bg-base" id="startDate" placeholder="03/12/2024, 10:30 AM" />
                                            <span className="position-absolute end-0 top-50 translate-middle-y me-12 line-height-1">
                                                <Icon
                                                    icon="solar:calendar-linear"
                                                    className="icon text-lg"
                                                />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label
                                            htmlFor="editendDate"
                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                        >
                                            End Date
                                        </label>
                                        <div className=" position-relative">
                                            <DatePicker className="form-control radius-8 bg-base" id="endDate" placeholder="03/12/2024, 2:30 PM" />
                                            <span className="position-absolute end-0 top-50 translate-middle-y me-12 line-height-1">
                                                <Icon
                                                    icon="solar:calendar-linear"
                                                    className="icon text-lg"
                                                />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Label{" "}
                                        </label>
                                        <div className="d-flex align-items-center flex-wrap gap-28">
                                            <div className="form-check checked-success d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="label"
                                                    id="editPersonal"
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="editPersonal"
                                                >
                                                    <span className="w-8-px h-8-px bg-success-600 rounded-circle" />
                                                    Personal
                                                </label>
                                            </div>
                                            <div className="form-check checked-primary d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="label"
                                                    id="editBusiness"
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="editBusiness"
                                                >
                                                    <span className="w-8-px h-8-px bg-primary-600 rounded-circle" />
                                                    Business
                                                </label>
                                            </div>
                                            <div className="form-check checked-warning d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="label"
                                                    id="editFamily"
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="editFamily"
                                                >
                                                    <span className="w-8-px h-8-px bg-warning-600 rounded-circle" />
                                                    Family
                                                </label>
                                            </div>
                                            <div className="form-check checked-secondary d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="label"
                                                    id="editImportant"
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="editImportant"
                                                >
                                                    <span className="w-8-px h-8-px bg-lilac-600 rounded-circle" />
                                                    Important
                                                </label>
                                            </div>
                                            <div className="form-check checked-danger d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="label"
                                                    id="editHoliday"
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="editHoliday"
                                                >
                                                    <span className="w-8-px h-8-px bg-danger-600 rounded-circle" />
                                                    Holiday
                                                </label>
                                            </div>
                                        </div>
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
                                            id="editdesc"
                                            rows={4}
                                            cols={50}
                                            placeholder="Write some text"
                                            defaultValue={""}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                                        <button
                                            type="reset"
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Delete Event */}
            <div
                className="modal fade"
                id="exampleModalDelete"
                tabIndex={-1}
                aria-hidden="true"
            >
                <div className="modal-dialog modal-sm modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-body p-24 text-center">
                            <span className="mb-16 fs-1 line-height-1 text-danger">
                                <Icon
                                    icon="fluent:delete-24-regular"
                                    className="menu-icon"
                                />
                            </span>
                            <h6 className="text-lg fw-semibold text-primary-light mb-0">
                                Are your sure you want to delete this event
                            </h6>
                            <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                                <button
                                    type="reset"
                                    className="w-50 border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="w-50 btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .cursor-pointer {
                    cursor: pointer;
                }
                .hover-bg-light:hover {
                    background-color: #f8f9fa;
                }
                .search-results {
                    max-height: 200px;
                    overflow-y: auto;
                }
                .patient-info {
                    border-left: 4px solid #4CAF50 !important;
                }
                .doctor-info {
                    border-left: 4px solid #2196F3 !important;
                }
            `}</style>
        </>
    )
}

export default CalendarMainLayer