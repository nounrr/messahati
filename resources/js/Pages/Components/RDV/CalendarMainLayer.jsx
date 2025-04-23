import React, { useEffect, useRef, useState } from 'react'
import Calendar from './Calendar'
import { Icon } from '@iconify/react/dist/iconify.js'
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, fetchUsersByRole } from '../../../Redux/users/userSlice';
import { createRendezVous, fetchRendezVous } from '../../../Redux/rendezvous/rendezvousSlice';
import { fetchDepartements } from '../../../Redux/departements/departementSlice';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';


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
    const dispatch = useDispatch();
    const { items: users, status: usersStatus, error: usersError } = useSelector((state) => state.users);
    const { items: departements, status: departementsStatus } = useSelector((state) => state.departements);
    const { items: rendezVousList, status: rendezVousStatus } = useSelector((state) => state.rendezvous);
    const [todayRendezVous, setTodayRendezVous] = useState([]);
    
    const [patientType, setPatientType] = useState('existing'); // 'existing' ou 'new'
    const [cinSearchTerm, setCinSearchTerm] = useState('');
    const [searchDoctorTerm, setSearchDoctorTerm] = useState('');
    const [foundPatient, setFoundPatient] = useState(null);
    const [foundDoctors, setFoundDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Formatter la date et l'heure actuelles au format ISO
    const now = new Date();
    const localISOString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    
    // Nouveaux états pour stocker les données du formulaire
    const [newPatientData, setNewPatientData] = useState({
        cin: '',
        name: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
        date_naissance: '',
        departement_id: '1' // ID du département par défaut pour les patients
    });
    
    const [appointmentData, setAppointmentData] = useState({
        departement_id: '',
        traitement_id: '',
        date_heure: localISOString,
        statut_paiement: '2', // 2 = en attente (par défaut)
        montant: '',
        remarques: ''
    });
    
    // Fonctions pour mettre à jour les données du nouveau patient
    const handleNewPatientChange = (e) => {
        const { name, value } = e.target;
        setNewPatientData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Fonctions pour mettre à jour les données du rendez-vous
    const handleAppointmentChange = (e) => {
        const { name, value } = e.target;
        
        // Si c'est un champ de date et heure, formater correctement
        if (name === 'date_heure') {
            console.log('Date sélectionnée:', value);  // pour débogage
            
            // La valeur est déjà au format ISO dont nous avons besoin
            setAppointmentData(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setAppointmentData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Si le département change, réinitialiser le médecin sélectionné
        if (name === 'departement_id') {
            setSelectedDoctor(null);
            // Si le champ est vide, ne pas filtrer les médecins
            if (!value) {
                setSearchDoctorTerm('');
            }
        }
    };
    
    // Fonction pour tester l'ajout d'un rendez-vous
    const handleSubmitAppointment = (e) => {
        e.preventDefault();
        
        // Validation de base - tous les champs obligatoires
        const errors = [];
        
        if (!appointmentData.departement_id) {
            errors.push('Veuillez sélectionner un département');
        }
        
        if (!selectedDoctor) {
            errors.push('Veuillez sélectionner un médecin');
        }
        
        if (!appointmentData.date_heure) {
            errors.push('Veuillez sélectionner une date et une heure');
        }
        
        if (!appointmentData.traitement_id) {
            errors.push('Veuillez sélectionner un type de traitement');
        }
        
        // Vérifier si un patient est sélectionné ou si les informations d'un nouveau patient sont remplies
        if (patientType === 'existing' && !foundPatient) {
            errors.push('Veuillez rechercher et sélectionner un patient existant');
        } else if (patientType === 'new') {
            if (!newPatientData.name) errors.push('Le nom du nouveau patient est requis');
            if (!newPatientData.cin) errors.push('Le CIN du nouveau patient est requis');
        }
        
        // Vérifier que le montant est spécifié si le statut de paiement est "payé"
        if (appointmentData.statut_paiement === '1' && (!appointmentData.montant || appointmentData.montant <= 0)) {
            errors.push('Veuillez indiquer le montant payé');
        }
        
        // Si des erreurs sont détectées, les afficher et arrêter la soumission
        if (errors.length > 0) {
            Swal.fire({
                title: 'Erreur de validation',
                html: errors.map(err => `- ${err}`).join('<br>'),
                icon: 'error'
            });
            return;
        }
        
        // Indiquer que nous sommes en train de soumettre
        setIsSubmitting(true);
        
        // Préparer les données pour l'API
        let apiData = {
            date_heure: appointmentData.date_heure,
            departement_id: parseInt(appointmentData.departement_id),
            statut: 1, // Par défaut: confirmé
            statut_paiement: parseInt(appointmentData.statut_paiement),
            montant: appointmentData.statut_paiement === '1' ? parseFloat(appointmentData.montant) : null,
            docteur_id: selectedDoctor.id, 
            remarques: appointmentData.remarques || null,
            // Créer un nouveau traitement au lieu d'utiliser un traitement_id existant
            nouveau_traitement: {
                typetraitement_id: parseInt(appointmentData.traitement_id) || 1,
                description: appointmentData.remarques || 'Rendez-vous médical',
                // Utiliser la date du rendez-vous pour le traitement
                date_debut: appointmentData.date_heure.split('T')[0], // Juste la partie date
                date_fin: appointmentData.date_heure.split('T')[0] // Même date pour début et fin
            }
        };
        
        // Ajouter l'ID du patient si existant ou créer un nouveau patient
        if (patientType === 'existing' && foundPatient) {
            apiData.patient_id = foundPatient.id;
        } else if (patientType === 'new') {
            apiData.newPatient = {
                cin: newPatientData.cin,
                name: newPatientData.name,
                prenom: newPatientData.prenom || '',
                email: newPatientData.email || '',
                telephone: newPatientData.telephone || '',
                adresse: newPatientData.adresse || '',
                date_naissance: newPatientData.date_naissance || '',
                departement_id: newPatientData.departement_id || '1'
            };
        }

        console.log("Données à envoyer:", apiData);
        
        // Appeler l'API pour créer le rendez-vous
        dispatch(createRendezVous(apiData))
            .unwrap()
            .then((response) => {
                console.log("Réponse du serveur:", response);
                // Afficher un message de succès
                Swal.fire({
                    title: 'Succès!',
                    text: 'Le rendez-vous a été ajouté avec succès.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Réinitialiser l'état
                    setIsSubmitting(false);
                    resetForm();
                    
                    // Actualiser la liste des rendez-vous
                    dispatch(fetchRendezVous());
                    
                    // Fermer le modal
                    const btnClose = document.querySelector('[data-bs-dismiss="modal"]');
                    if (btnClose) btnClose.click();
                });
            })
            .catch((error) => {
                console.error('Erreur lors de la création du rendez-vous:', error);
                // Afficher les détails de l'erreur de manière lisible
                let errorMessage = error.message || 'Une erreur est survenue lors de la création du rendez-vous.';
                
                if (error.errors) {
                    // Regrouper les erreurs par champ
                    const errorFields = {};
                    
                    for (const [field, messages] of Object.entries(error.errors)) {
                        // Extraire le nom du champ principal
                        const mainField = field.split('.')[0];
                        if (!errorFields[mainField]) {
                            errorFields[mainField] = [];
                        }
                        errorFields[mainField].push(...messages);
                    }
                    
                    // Afficher les erreurs regroupées
                    console.log("Erreurs regroupées:", errorFields);
                    
                    const errorDetails = Object.entries(errorFields)
                        .map(([field, msgs]) => `<strong>${field}</strong>: ${msgs.join(', ')}`)
                        .join('<br>');
                    
                    errorMessage = `<p>${errorMessage}</p><p>Champs avec erreurs:</p>${errorDetails}`;
                }
                
                // Afficher un message d'erreur
                Swal.fire({
                    title: 'Erreur!',
                    html: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                setIsSubmitting(false);
            });
    };
    
    // Fonction pour réinitialiser le formulaire
    const resetForm = () => {
        // Réinitialiser les données du patient
        setPatientType('existing');
        setFoundPatient(null);
        setCinSearchTerm('');
        setNewPatientData({
            cin: '',
            name: '',
            prenom: '',
            email: '',
            telephone: '',
            adresse: '',
            date_naissance: '',
            departement_id: '1'
        });
        
        // Réinitialiser les données du rendez-vous
        setAppointmentData({
            departement_id: '',
            traitement_id: '',
            date_heure: localISOString,
            statut_paiement: '2',
            montant: '',
            remarques: ''
        });
        
        // Réinitialiser la recherche de médecin
        setSearchDoctorTerm('');
        setSelectedDoctor(null);
    };
    
    // Récupérer tous les utilisateurs au chargement
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);
    
    // Récupérer les médecins (users avec rôle 'docteur')
    useEffect(() => {
        dispatch(fetchUsersByRole('docteur'));
    }, [dispatch]);
    
    // Récupérer tous les départements
    useEffect(() => {
        dispatch(fetchDepartements());
    }, [dispatch]);
    
    // Récupérer les rendez-vous au chargement du composant
    useEffect(() => {
        dispatch(fetchRendezVous());
    }, [dispatch]);
    
    // Filtrer les rendez-vous pour n'avoir que ceux d'aujourd'hui
    useEffect(() => {
        if (rendezVousList && rendezVousList.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const filteredRdv = rendezVousList.filter(rdv => {
                const rdvDate = new Date(rdv.date_heure);
                return rdvDate >= today && rdvDate < tomorrow;
            });
            
            // Trier par heure
            filteredRdv.sort((a, b) => new Date(a.date_heure) - new Date(b.date_heure));
            
            setTodayRendezVous(filteredRdv);
        }
    }, [rendezVousList]);
    
    // Filtrer les utilisateurs pour trouver les patients et docteurs
    useEffect(() => {
        if (users && users.length > 0) {
            // Filtrer les utilisateurs qui sont des médecins (based on role)
            const doctors = users.filter(user => 
                user.roles && user.roles.some(role => 
                    role.name.toLowerCase() === 'docteur' || 
                    role.name.toLowerCase() === 'doctor' || 
                    role.name.toLowerCase() === 'médecin'
                )
            );
            
            console.log("Tous les médecins:", doctors);
            console.log("Département sélectionné:", appointmentData.departement_id);
            console.log("Départements disponibles:", departements);
            
            // Filtrer les médecins selon le département sélectionné et le terme de recherche
            let filteredDoctors = doctors;
            
            // Filtrer par département si un département est sélectionné
            if (appointmentData.departement_id) {
                console.log("ID du département sélectionné:", appointmentData.departement_id);
                
                // Analyser plus en détail les données des médecins
                doctors.forEach(doctor => {
                    console.log(`Médecin ${doctor.name} - ID: ${doctor.id}, departement_id: ${doctor.departement_id}, type: ${typeof doctor.departement_id}`);
                });
                
                // Filtre simplifié qui n'utilise que l'ID du département
                filteredDoctors = doctors.filter(doctor => {
                    // Vérifier si le médecin a un département assigné
                    if (!doctor.departement_id) {
                        console.log(`Médecin ${doctor.name} n'a pas de département assigné`);
                        return false;
                    }
                    
                    const doctorDeptId = String(doctor.departement_id);
                    const selectedDeptId = String(appointmentData.departement_id);
                    
                    console.log(`Médecin ${doctor.name} - departement_id: ${doctorDeptId}, comparé à: ${selectedDeptId}, égal: ${doctorDeptId === selectedDeptId}`);
                    return doctorDeptId === selectedDeptId;
                });
                
                console.log("Médecins filtrés par département:", filteredDoctors);
                
                if (filteredDoctors.length === 0) {
                    console.warn("Aucun médecin trouvé pour ce département!");
                }
            }
            
            // Filtrer par terme de recherche si présent
            if (searchDoctorTerm) {
                filteredDoctors = filteredDoctors.filter(doc => 
                    doc.name.toLowerCase().includes(searchDoctorTerm.toLowerCase()) ||
                    (doc.prenom && doc.prenom.toLowerCase().includes(searchDoctorTerm.toLowerCase()))
                );
            }
                
            setFoundDoctors(filteredDoctors);
        }
    }, [users, searchDoctorTerm, appointmentData.departement_id, departements]);
    
    // Fonction pour basculer entre les formulaires
    const handlePatientTypeChange = (type) => {
        setPatientType(type);
        setFoundPatient(null);
        setCinSearchTerm('');
    };
    
    // Fonction de recherche de patient par CIN
    const searchPatientByCIN = () => {
        console.log("Recherche de patient avec CIN:", cinSearchTerm);
        
        if (cinSearchTerm.length > 0) {
            // Vérifier d'abord si nous avons des utilisateurs à rechercher
            if (!users || users.length === 0) {
                // Pas d'utilisateurs disponibles pour la recherche
                setIsSearching(false);
                return;
            }
            
            setIsSearching(true);
            
            // Récupérer les patients parmi les utilisateurs (tous les users qui ne sont pas médecins)
            setTimeout(() => {
                const patient = users.find(user => 
                    user.cin && user.cin.toLowerCase().includes(cinSearchTerm.toLowerCase())
                );
                
                console.log("Patient trouvé:", patient);
                setFoundPatient(patient || null);
                setIsSearching(false);
            }, 300);
        } else {
            setFoundPatient(null);
        }
    };
    
    // Gestion de la soumission du formulaire de recherche par CIN
    const handleCinSearchSubmit = (e) => {
        e.preventDefault();
        searchPatientByCIN();
    };
    
    // Gestion de la touche Entrée pour la recherche
    const handleCinKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchPatientByCIN();
        }
    };
    
    // Réinitialiser le formulaire de recherche
    const resetPatientSearch = () => {
        setFoundPatient(null);
        setCinSearchTerm('');
    };
    
    // Fonction pour obtenir la couleur en fonction du statut
    const getStatusColor = (status) => {
        switch(status) {
            case 1:
            case '1':
                return 'bg-success-600'; // confirmé - vert
            case 2:
            case '2':
                return 'bg-warning-600'; // en attente - orange
            case 3:
            case '3':
                return 'bg-danger-600'; // annulé - rouge
            default:
                return 'bg-info-600'; // autre - bleu
        }
    };
    
    // Fonction pour formater le statut
    const formatStatus = (status) => {
        switch(status) {
            case 1:
            case '1':
                return 'Confirmé';
            case 2:
            case '2':
                return 'En attente';
            case 3:
            case '3':
                return 'Annulé';
            default:
                return 'Non défini';
        }
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
                            <h4 className="text-xl mb-16">Rendez-vous d'aujourd'hui</h4>
                            <div className="mt-16">
                                {rendezVousStatus === 'loading' ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Chargement...</span>
                                        </div>
                                        <p className="mt-2">Chargement des rendez-vous...</p>
                                    </div>
                                ) : todayRendezVous.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p className="text-muted">Aucun rendez-vous programmé aujourd'hui</p>
                                    </div>
                                ) : (
                                    todayRendezVous.map((rdv) => (
                                        <div key={rdv.id} className="event-item d-flex align-items-center justify-content-between gap-4 pb-16 mb-16 border border-start-0 border-end-0 border-top-0">
                                            <div className="">
                                                <div className="d-flex align-items-center gap-10">
                                                    <span className={`w-12-px h-12-px ${getStatusColor(rdv.statut)} rounded-circle fw-medium`} />
                                                    <span className="text-secondary-light">
                                                        {format(new Date(rdv.date_heure), 'HH:mm', { locale: fr })}
                                                    </span>
                                                </div>
                                                <span className="text-primary-light fw-semibold text-md mt-4">
                                                    {rdv.patient ? `${rdv.patient.name} ${rdv.patient.prenom || ''}` : 'Patient inconnu'}
                                                </span>
                                                <div className="text-secondary-light text-sm">
                                                    <span className="me-2">Docteur:</span>
                                                    <span className="fw-medium">{rdv.docteur ? `${rdv.docteur.name} ${rdv.docteur.prenom || ''}` : 'Non assigné'}</span>
                                                </div>
                                                <div className="text-secondary-light text-sm">
                                                    <span className="me-2">Statut:</span>
                                                    <span className="fw-medium">{formatStatus(rdv.statut)}</span>
                                                </div>
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
                                                            Voir
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
                                                            Modifier
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
                                                            Supprimer
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    ))
                                )}
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
                        <form onSubmit={handleSubmitAppointment}>
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
                                                        <h5 className="fw-bold mb-0">
                                                            {foundPatient.name}
                                                            {foundPatient.prenom && ` ${foundPatient.prenom}`}
                                                        </h5>
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
                                                            <p className="mb-1"><strong>CIN:</strong> {foundPatient.cin || 'N/A'}</p>
                                                            <p className="mb-1"><strong>Téléphone:</strong> {foundPatient.telephone || 'N/A'}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <p className="mb-1"><strong>Email:</strong> {foundPatient.email || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="cin-search">
                                                    <form onSubmit={handleCinSearchSubmit}>
                                                        <div className="input-group mb-2">
                                                            <input
                                                                type="text"
                                                                className="form-control radius-8"
                                                                placeholder="Entrez le CIN du patient"
                                                                value={cinSearchTerm}
                                                                onChange={(e) => setCinSearchTerm(e.target.value)}
                                                                onKeyPress={handleCinKeyPress}
                                                            />
                                                            <button 
                                                                className="btn btn-primary" 
                                                                type="submit"
                                                                disabled={isSearching || !users || users.length === 0}
                                                            >
                                                                {isSearching ? (
                                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                ) : (
                                                                    <Icon icon="iconamoon:search" className="icon" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </form>
                                                    
                                                    {isSearching && <p className="text-muted small">Recherche en cours...</p>}
                                                    {!isSearching && cinSearchTerm.length > 0 && !foundPatient && (
                                                        <div className="alert alert-warning py-2 px-3">
                                                            Aucun patient trouvé avec le CIN "{cinSearchTerm}". Vérifiez que le CIN est correct ou créez un nouveau patient.
                                                        </div>
                                                    )}
                                                    
                                                    {usersStatus === 'loading' && (
                                                        <div className="alert alert-info py-2 px-3">
                                                            Chargement des utilisateurs...
                                                        </div>
                                                    )}
                                                    
                                                    {(!users || users.length === 0) && usersStatus !== 'loading' && (
                                                        <div className="alert alert-danger py-2 px-3">
                                                            Aucun utilisateur disponible pour la recherche. Veuillez réessayer plus tard.
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
                                                name="cin"
                                                value={newPatientData.cin}
                                                onChange={handleNewPatientChange}
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
                                                name="name"
                                                value={newPatientData.name}
                                                onChange={handleNewPatientChange}
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
                                                name="prenom"
                                                value={newPatientData.prenom}
                                                onChange={handleNewPatientChange}
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
                                                name="email"
                                                value={newPatientData.email}
                                                onChange={handleNewPatientChange}
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
                                                name="telephone"
                                                value={newPatientData.telephone}
                                                onChange={handleNewPatientChange}
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
                                                name="adresse"
                                                value={newPatientData.adresse}
                                                onChange={handleNewPatientChange}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-20">
                                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                Date de naissance:
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control radius-8"
                                                placeholder="Date de naissance du patient"
                                                name="date_naissance"
                                                value={newPatientData.date_naissance}
                                                onChange={handleNewPatientChange}
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
                                        <select 
                                            className="form-select radius-8"
                                            name="departement_id"
                                            value={appointmentData.departement_id}
                                            onChange={handleAppointmentChange}
                                        >
                                            <option value="">Sélectionner un département</option>
                                            {departementsStatus === 'loading' ? (
                                                <option value="" disabled>Chargement des départements...</option>
                                            ) : departements && departements.length > 0 ? (
                                                departements.map(departement => (
                                                    <option key={departement.id} value={departement.id}>
                                                        {departement.nom}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>Aucun département disponible</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Type de traitement:
                                        </label>
                                        <select 
                                            className="form-select radius-8"
                                            name="traitement_id"
                                            value={appointmentData.traitement_id}
                                            onChange={handleAppointmentChange}
                                        >
                                            <option value="">Sélectionner un traitement</option>
                                            <option value="1">Consultation</option>
                                            <option value="2">Suivi</option>
                                            <option value="3">Intervention</option>
                                        </select>
                                    </div>
                                    
                                    {/* Section de recherche et sélection de médecin */}
                                    <div className="mb-3">
                                        <label htmlFor="doctors" className="form-label">Médecin</label>
                                        <div className="input-group mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Rechercher un médecin..."
                                                value={searchDoctorTerm}
                                                onChange={(e) => setSearchDoctorTerm(e.target.value)}
                                                disabled={!appointmentData.departement_id}
                                            />
                                        </div>
                                        
                                        <div className="doctor-list mt-2">
                                            {!appointmentData.departement_id ? (
                                                <div className="alert alert-info">
                                                    Veuillez d'abord sélectionner un département
                                                </div>
                                            ) : foundDoctors && foundDoctors.length > 0 ? (
                                                foundDoctors.map((doctor) => (
                                                    <div
                                                        key={doctor.id}
                                                        className={`doctor-item p-2 ${selectedDoctor && selectedDoctor.id === doctor.id ? 'selected' : ''}`}
                                                        onClick={() => setSelectedDoctor(doctor)}
                                                    >
                                                        <div className="d-flex align-items-center">
                                                            <div className="doctor-info">
                                                                <span className="doctor-name">{doctor.name} {doctor.prenom}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="alert alert-warning">
                                                    Aucun médecin disponible pour ce département.
                                                </div>
                                            )}
                                        </div>
                                        
                                        {selectedDoctor && (
                                            <div className="selected-doctor mt-2 p-2 border rounded">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span><strong>Médecin sélectionné:</strong> {selectedDoctor.name} {selectedDoctor.prenom}</span>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        onClick={() => setSelectedDoctor(null)}
                                                    ></button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="col-md-6 mb-20">
                                        <label
                                            htmlFor="startDate"
                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                        >
                                            Date et heure
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type="datetime-local"
                                                className="form-control radius-8 bg-base"
                                                id="startDate"
                                                name="date_heure"
                                                value={appointmentData.date_heure}
                                                onChange={handleAppointmentChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Statut du paiement:
                                        </label>
                                        <select 
                                            className="form-select radius-8"
                                            name="statut_paiement"
                                            value={appointmentData.statut_paiement}
                                            onChange={handleAppointmentChange}
                                        >
                                            <option value="1">Payé</option>
                                            <option value="2">En attente</option>
                                            <option value="3">Paiement à l'arrivée</option>
                                        </select>
                                    </div>
                                    
                                    {appointmentData.statut_paiement === '1' && (
                                        <div className="col-md-6 mb-20">
                                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                Montant payé (DH):
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control radius-8"
                                                placeholder="Montant en dirhams"
                                                name="montant"
                                                value={appointmentData.montant}
                                                onChange={handleAppointmentChange}
                                                min="0"
                                                step="0.01"
                                                required={appointmentData.statut_paiement === '1'}
                                            />
                                        </div>
                                    )}
                                    
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
                                            name="remarques"
                                            value={appointmentData.remarques}
                                            onChange={handleAppointmentChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-top py-16 px-24">
                                <div className="d-flex align-items-center justify-content-center gap-3">
                                    <button
                                        type="button"
                                        className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                                        data-bs-dismiss="modal"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Enregistrement...
                                            </>
                                        ) : 'Enregistrer'}
                                    </button>
                                </div>
                            </div>
                        </form>
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