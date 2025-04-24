import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { fetchRendezVous } from '../../../Redux/rendezvous/rendezvousSlice'
import frLocale from '@fullcalendar/core/locales/fr'
import Swal from 'sweetalert2'
import './full-calendar.css'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import { French } from 'flatpickr/dist/l10n/fr.js'
import { Calendar as CalendarIcon, Filter, Users, UserCheck, Clock, ChevronDown, X } from 'lucide-react'

export default function Calendar() {
    const dispatch = useDispatch()
    const { items: rendezVousList, status } = useSelector(state => state.rendezvous)
    const [events, setEvents] = useState([])
    const [filteredEvents, setFilteredEvents] = useState([])
    const calendarRef = useRef(null)
    const datepickerRef = useRef(null)
    const [statusFilter, setStatusFilter] = useState('all')
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Récupérer les rendez-vous au chargement du composant
    useEffect(() => {
        dispatch(fetchRendezVous())
    }, [dispatch])

    // Appliquer les filtres aux événements
    useEffect(() => {
        if (events.length > 0) {
            if (statusFilter === 'all') {
                setFilteredEvents(events);
            } else {
                const filtered = events.filter(event => {
                    return event.extendedProps.statusText === statusFilter;
                });
                setFilteredEvents(filtered);
            }
        } else {
            setFilteredEvents([]);
        }
    }, [events, statusFilter]);

    // Configuration du datepicker après le montage du composant
    useEffect(() => {
        // Ajouter le gestionnaire de clic sur le titre du calendrier
        const setupTitleClick = () => {
            const titleElement = document.querySelector('.fc-toolbar-title');
            if (titleElement) {
                titleElement.style.cursor = 'pointer';
                titleElement.title = 'Cliquer pour sélectionner une date';
                titleElement.classList.add('calendar-title-clickable');
                
                // Supprimer les gestionnaires existants pour éviter les duplications
                titleElement.removeEventListener('click', handleTitleClick);
                titleElement.addEventListener('click', handleTitleClick);
            }
        };

        // Initialiser le setup après un petit délai pour s'assurer que le DOM est prêt
        setTimeout(setupTitleClick, 500);

        // Reconfigurer le clic sur le titre lors des changements de vue
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.on('viewDidMount', setupTitleClick);
            calendarApi.on('datesSet', setupTitleClick);
        }

        return () => {
            const titleElement = document.querySelector('.fc-toolbar-title');
            if (titleElement) {
                titleElement.removeEventListener('click', handleTitleClick);
            }
        };
    }, [calendarRef.current]);

    // Fonction pour gérer le clic sur le titre du calendrier
    const handleTitleClick = () => {
        let currentDate = new Date();
        
        // Si le calendrier est initialisé, récupérer la date courante de la vue
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            currentDate = calendarApi.getDate();
        }

        Swal.fire({
            title: 'Sélectionner une date',
            html: `
                <div class="date-selector-container">
                    <p class="date-selector-hint">Choisissez une date pour voir les rendez-vous programmés ce jour-là</p>
                    <input type="text" id="date-picker" class="date-picker-input" placeholder="Sélectionner une date" />
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Voir les rendez-vous',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#4C84FF',
            showLoaderOnConfirm: true,
            didOpen: () => {
                // Initialiser flatpickr sur l'input
                const flatpickrInstance = flatpickr('#date-picker', {
                    locale: French,
                    dateFormat: 'd/m/Y',
                    defaultDate: currentDate,
                    inline: true, // Afficher directement le calendrier
                    disableMobile: true,
                    maxDate: new Date().setFullYear(new Date().getFullYear() + 1), // Limite à 1 an dans le futur
                    onChange: (selectedDates) => {
                        // Stocker la date sélectionnée pour qu'elle soit disponible au moment de la confirmation
                        datepickerRef.current = selectedDates[0];
                    }
                });
                
                // Stocker l'instance pour pouvoir y accéder plus tard
                datepickerRef.current = currentDate;
            },
            preConfirm: () => {
                // Cette fonction est exécutée lorsque l'utilisateur clique sur "Voir les rendez-vous"
                return new Promise((resolve) => {
                    if (!datepickerRef.current) {
                        Swal.showValidationMessage('Veuillez sélectionner une date');
                        return resolve(false);
                    }
                    
                    resolve(datepickerRef.current);
                });
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const selectedDate = result.value;
                
                // Naviguer vers la date sélectionnée dans le calendrier (vue jour)
                if (calendarRef.current) {
                    const calendarApi = calendarRef.current.getApi();
                    calendarApi.changeView('timeGridDay', selectedDate);
                }
                
                // Filtrer les rendez-vous pour cette date
                const selectedDateObj = new Date(selectedDate);
                selectedDateObj.setHours(0, 0, 0, 0);
                
                const nextDay = new Date(selectedDateObj);
                nextDay.setDate(nextDay.getDate() + 1);
                
                const rdvsForDay = rendezVousList.filter(rdv => {
                    const rdvDate = new Date(rdv.date_heure);
                    return rdvDate >= selectedDateObj && rdvDate < nextDay;
                });
                
                // Si des rendez-vous existent pour cette date, les afficher
                if (rdvsForDay.length > 0) {
                    // Trier les rendez-vous par heure
                    rdvsForDay.sort((a, b) => new Date(a.date_heure) - new Date(b.date_heure));
                    
                    // Créer le contenu HTML pour afficher tous les rendez-vous
                    let htmlContent = `<div class="rdvs-list">`;
                    
                    rdvsForDay.forEach((rdv, index) => {
                        const rdvTime = new Date(rdv.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                        const patientName = rdv.patient ? getFullName(rdv.patient) : 'Patient inconnu';
                        const doctorName = rdv.docteur ? getFullName(rdv.docteur) : 'Non assigné';
                        const statutText = getStatusText(rdv.statut);
                        const statutColor = getStatusColor(rdv.statut);
                        
                        htmlContent += `
                            <div class="rdv-day-item ${index > 0 ? 'border-top' : ''}">
                                <div class="rdv-day-header">
                                    <div class="rdv-day-time">${rdvTime}</div>
                                    <div class="rdv-day-patient">${patientName}</div>
                                </div>
                                <div class="rdv-day-details">
                                    <div><strong>Docteur:</strong> ${doctorName}</div>
                                    <div>
                                        <strong>Statut:</strong> 
                                        <span class="rdv-status-badge" style="background-color: ${statutColor};">
                                            ${statutText}
                                        </span>
                                    </div>
                                    <div class="rdv-day-action">
                                        <button class="rdv-detail-btn" data-rdv-id="${rdv.id}">Voir détails</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    
                    htmlContent += `</div>`;
                    
                    // Afficher la liste des rendez-vous dans une modal
                    Swal.fire({
                        title: `Rendez-vous du ${selectedDateObj.toLocaleDateString('fr-FR')}`,
                        html: htmlContent,
                        icon: null,
                        width: '600px',
                        showConfirmButton: true,
                        confirmButtonText: 'Fermer',
                        didOpen: () => {
                            // Ajouter des gestionnaires d'événements pour les boutons "Voir détails"
                            document.querySelectorAll('.rdv-detail-btn').forEach(btn => {
                                btn.addEventListener('click', () => {
                                    const rdvId = btn.getAttribute('data-rdv-id');
                                    const rdv = rendezVousList.find(r => r.id == rdvId);
                                    
                                    // Fermer la modal actuelle
                                    Swal.close();
                                    
                                    // Simuler un clic sur l'événement correspondant pour afficher les détails
                                    if (rdv) {
                                        // Créer un faux événement pour le gestionnaire de clic
                                        const fakeEvent = {
                                            event: {
                                                extendedProps: {
                                                    rdvDetails: rdv
                                                }
                                            }
                                        };
                                        
                                        // Appeler le gestionnaire d'événements directement
                                        setTimeout(() => {
                                            handleEventClick(fakeEvent);
                                        }, 300);
                                    }
                                });
                            });
                        }
                    });
                }
                // Si aucun rendez-vous n'est trouvé pour cette date, ne rien faire d'autre
                // (le calendrier a déjà été mis à jour pour afficher la date sélectionnée)
            }
        });
    };

    // Fonction pour convertir le statut numérique en texte
    const getStatusText = (status) => {
        switch(status) {
            case 1: return 'confirmé';
            case 2: return 'en attente';
            case 3: return 'annulé';
            case '1': return 'confirmé';
            case '2': return 'en attente';
            case '3': return 'annulé';
            default: return status || 'non défini';
        }
    }

    // Fonction pour obtenir la couleur en fonction du statut
    const getStatusColor = (status) => {
        const statusText = getStatusText(status);
        switch(statusText) {
            case 'confirmé': return '#4caf50';
            case 'en attente': return '#ff9800';
            case 'annulé': return '#f44336';
            default: return '#2196f3';
        }
    }

    // Obtenir le nom du traitement à partir des relations
    const getTraitementInfo = (rdv) => {
        // Si le traitement a un typetraitement avec un nom, on l'utilise
        if (rdv.traitement && rdv.traitement.typetraitement && rdv.traitement.typetraitement.nom) {
            return rdv.traitement.typetraitement.nom;
        }
        // Sinon, on utilise la description du traitement si disponible
        if (rdv.traitement && rdv.traitement.description) {
            return rdv.traitement.description;
        }
        // Si aucune info n'est disponible, on retourne un message par défaut
        return 'Non spécifié';
    }

    // Convertir les rendez-vous en événements pour FullCalendar
    useEffect(() => {
        if (rendezVousList && rendezVousList.length > 0) {
            console.log('Rendez-vous récupérés:', rendezVousList);
            
            const formattedEvents = rendezVousList.map(rdv => {
                const backgroundColor = getStatusColor(rdv.statut);
                
                // Créer un titre avec des informations disponibles
                let title = '';
                const traitementInfo = getTraitementInfo(rdv);
                if (traitementInfo !== 'Non spécifié') {
                    title += `${traitementInfo}`;
                } else if (rdv.patient) {
                    const patientFullName = getFullName(rdv.patient);
                    title += patientFullName;
                }

                // Ajouter le nom complet du patient si disponible et pas déjà ajouté
                if (rdv.patient) {
                    const patientFullName = getFullName(rdv.patient);
                    if (title !== patientFullName) {
                        title += title ? ` • ${patientFullName}` : patientFullName;
                    }
                }

                return {
                    id: rdv.id,
                    title: title,
                    start: rdv.date_heure,
                    backgroundColor,
                    borderColor: backgroundColor,
                    textColor: '#fff',
                    className: 'rounded-event',
                    extendedProps: {
                        rdvDetails: rdv,
                        statusText: getStatusText(rdv.statut)
                    }
                }
            });
            
            setEvents(formattedEvents);
        }
    }, [rendezVousList]);

    // Fonction utilitaire pour obtenir le nom complet
    const getFullName = (person) => {
        if (!person) return 'Non spécifié';
        
        let fullName = '';
        if (person.name) fullName += person.name;
        if (person.prenom) fullName += fullName ? ` ${person.prenom}` : person.prenom;
        return fullName || 'Non spécifié';
    }
    
    // Fonction pour obtenir le nom du département d'une personne
    const getDepartementName = (person) => {
        if (!person) return 'Non spécifié';
        if (!person.departement) return 'Non spécifié';
        return person.departement.nom || 'Non spécifié';
    }

    // Fonction pour filtrer et n'afficher que les heures avec des rendez-vous
    const handleViewDidMount = (info) => {
        // Seulement pour la vue jour
        if (info.view.type === 'timeGridDay') {
            // Récupérer les heures des rendez-vous pour cette journée
            const dayStart = new Date(info.view.currentStart);
            const dayEnd = new Date(info.view.currentEnd);
            
            const hoursWithEvents = new Set();
            
            // Collecter toutes les heures où il y a des événements
            events.forEach(event => {
                const eventDate = new Date(event.start);
                if (eventDate >= dayStart && eventDate < dayEnd) {
                    hoursWithEvents.add(eventDate.getHours());
                }
            });
            
            // Si aucun événement pour cette journée, ne rien modifier
            if (hoursWithEvents.size === 0) return;
            
            // Convertir Set en tableau et trier
            const sortedHours = [...hoursWithEvents].sort((a, b) => a - b);
            
            // Définir les heures de début et de fin avec une marge de 1 heure
            const minHour = Math.max(0, sortedHours[0] - 1);
            const maxHour = Math.min(23, sortedHours[sortedHours.length - 1] + 1);
            
            // Mettre à jour la vue
            const calendarApi = info.view.calendar;
            calendarApi.setOption('slotMinTime', `${minHour}:00:00`);
            calendarApi.setOption('slotMaxTime', `${maxHour + 1}:00:00`);
        }
    };

    // Gestionnaire pour le clic sur un rendez-vous
    function handleEventClick(clickInfo) {
        const rdv = clickInfo.event.extendedProps.rdvDetails;
        console.log('Détails du rendez-vous cliqué:', rdv);
        
        // Formatter les données pour l'affichage
        const formattedDate = new Date(rdv.date_heure).toLocaleString('fr-FR');
        const statutText = getStatusText(rdv.statut);
        const statutColor = getStatusColor(rdv.statut);
        
        // Préparer les informations pour l'affichage
        const traitementInfo = getTraitementInfo(rdv);
        const patient = rdv.patient ? getFullName(rdv.patient) : 'Non spécifié';
        const docteur = rdv.docteur ? getFullName(rdv.docteur) : 'Non spécifié';
        
        // Récupérer l'information sur le département du rendez-vous
        const departement = rdv.departement && rdv.departement.nom ? rdv.departement.nom : 'Non spécifié';
        
        // Récupérer l'information sur le département du docteur
        const docteurDepartement = rdv.docteur ? getDepartementName(rdv.docteur) : 'Non spécifié';
        
        // Utilisons une approche simple sans trop de personnalisation pour éviter les problèmes
        Swal.fire({
            title: 'Détails du rendez-vous',
            html: `
                <div class="rdv-details">
                    <div class="rdv-detail-item">
                        <div class="rdv-detail-label">Date et heure:</div>
                        <div class="rdv-detail-value">${formattedDate}</div>
                    </div>
                    <div class="rdv-detail-item">
                        <div class="rdv-detail-label">Traitement:</div>
                        <div class="rdv-detail-value">${traitementInfo}</div>
                    </div>
                    <div class="rdv-detail-item">
                        <div class="rdv-detail-label">Patient:</div>
                        <div class="rdv-detail-value">${patient}</div>
                    </div>
                    <div class="rdv-detail-item">
                        <div class="rdv-detail-label">Docteur:</div>
                        <div class="rdv-detail-value">${docteur}</div>
                    </div>
                    <div class="rdv-detail-item">
                        <div class="rdv-detail-label">Dépt. docteur:</div>
                        <div class="rdv-detail-value">${docteurDepartement}</div>
                    </div>
                    <div class="rdv-detail-item">
                        <div class="rdv-detail-label">Département:</div>
                        <div class="rdv-detail-value">${departement}</div>
                    </div>
                    <div class="rdv-detail-item">
                        <div class="rdv-detail-label">Statut:</div>
                        <div class="rdv-detail-value">
                            <span class="rdv-status-badge" style="background-color: ${statutColor};">
                                ${statutText}
                            </span>
                        </div>
                    </div>
                </div>
            `,
            icon: null,
            showConfirmButton: true,
            confirmButtonText: 'Fermer',
            showCloseButton: true
        });
        
        // Ajout d'un gestionnaire d'événements global pour le bouton de fermeture
        document.addEventListener('click', function closeModalHandler(event) {
            // Si on clique sur le bouton de fermeture ou le bouton Fermer
            if (event.target.classList.contains('swal2-close') || 
                event.target.classList.contains('swal2-confirm')) {
                Swal.close();
                // Supprimer ce gestionnaire après utilisation
                document.removeEventListener('click', closeModalHandler);
            }
        });
    }

    // Gestionnaire pour le clic sur un jour
    function handleDateClick(info) {
        console.log('Date cliquée:', info.date);
        
        // Filtrer les rendez-vous pour cette date
        const selectedDate = new Date(info.date);
        selectedDate.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        const rdvsForDay = rendezVousList.filter(rdv => {
            const rdvDate = new Date(rdv.date_heure);
            return rdvDate >= selectedDate && rdvDate < nextDay;
        });
        
        // Trier les rendez-vous par heure
        rdvsForDay.sort((a, b) => new Date(a.date_heure) - new Date(b.date_heure));
        
        if (rdvsForDay.length === 0) {
            Swal.fire({
                title: `Aucun rendez-vous le ${selectedDate.toLocaleDateString('fr-FR')}`,
                text: 'Il n\'y a pas de rendez-vous programmés pour cette date.',
                icon: 'info',
                confirmButtonText: 'OK'
            });
            return;
        }
        
        // Créer le contenu HTML pour afficher tous les rendez-vous
        let htmlContent = `<div class="rdvs-list">`;
        
        rdvsForDay.forEach((rdv, index) => {
            const rdvTime = new Date(rdv.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            const patientName = rdv.patient ? getFullName(rdv.patient) : 'Patient inconnu';
            const doctorName = rdv.docteur ? getFullName(rdv.docteur) : 'Non assigné';
            const statutText = getStatusText(rdv.statut);
            const statutColor = getStatusColor(rdv.statut);
            
            htmlContent += `
                <div class="rdv-day-item ${index > 0 ? 'border-top' : ''}">
                    <div class="rdv-day-header">
                        <div class="rdv-day-time">${rdvTime}</div>
                        <div class="rdv-day-patient">${patientName}</div>
                    </div>
                    <div class="rdv-day-details">
                        <div><strong>Docteur:</strong> ${doctorName}</div>
                        <div>
                            <strong>Statut:</strong> 
                            <span class="rdv-status-badge" style="background-color: ${statutColor};">
                                ${statutText}
                            </span>
                        </div>
                        <div class="rdv-day-action">
                            <button class="rdv-detail-btn" data-rdv-id="${rdv.id}">Voir détails</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        htmlContent += `</div>`;
        
        // Afficher la liste des rendez-vous dans une modal
        Swal.fire({
            title: `Rendez-vous du ${selectedDate.toLocaleDateString('fr-FR')}`,
            html: htmlContent,
            icon: null,
            width: '600px',
            showConfirmButton: true,
            confirmButtonText: 'Fermer',
            didOpen: () => {
                // Ajouter des gestionnaires d'événements pour les boutons "Voir détails"
                document.querySelectorAll('.rdv-detail-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const rdvId = btn.getAttribute('data-rdv-id');
                        const rdv = rendezVousList.find(r => r.id == rdvId);
                        
                        // Fermer la modal actuelle
                        Swal.close();
                        
                        // Simuler un clic sur l'événement correspondant pour afficher les détails
                        if (rdv) {
                            // Créer un faux événement pour le gestionnaire de clic
                            const fakeEvent = {
                                event: {
                                    extendedProps: {
                                        rdvDetails: rdv
                                    }
                                }
                            };
                            
                            // Appeler le gestionnaire d'événements directement
                            setTimeout(() => {
                                handleEventClick(fakeEvent);
                            }, 300);
                        }
                    });
                });
            }
        });
    }
    
    // Fonction pour gérer le changement de filtre
    const handleFilterChange = (status) => {
        setStatusFilter(status);
        setIsFilterOpen(false);
    };

    // Appliquer un style personnalisé à la modal
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .rdv-details {
                margin-top: 20px;
                text-align: left;
            }
            .rdv-detail-item {
                display: flex;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
            .rdv-detail-label {
                flex: 0 0 120px;
                font-weight: 600;
                color: #666;
            }
            .rdv-detail-value {
                flex: 1;
                color: #333;
            }
            .rdv-status-badge {
                padding: 4px 10px;
                border-radius: 15px;
                color: white;
                font-size: 0.85rem;
                display: inline-block;
            }
            .rounded-event {
                border-radius: 4px !important;
                font-weight: 500 !important;
            }
            
            /* Styles pour la liste des rendez-vous par jour */
            .rdvs-list {
                max-height: 400px;
                overflow-y: auto;
                margin-top: 15px;
            }
            .rdv-day-item {
                padding: 12px 0;
                text-align: left;
            }
            .border-top {
                border-top: 1px solid #eee;
            }
            .rdv-day-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }
            .rdv-day-time {
                font-weight: bold;
                color: #444;
            }
            .rdv-day-patient {
                font-weight: bold;
            }
            .rdv-day-details {
                color: #666;
                font-size: 0.9rem;
                line-height: 1.5;
            }
            .rdv-day-action {
                margin-top: 8px;
                text-align: right;
            }
            .rdv-detail-btn {
                background-color: #4C84FF;
                color: white;
                border: none;
                padding: 5px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8rem;
                transition: background-color 0.2s;
            }
            .rdv-detail-btn:hover {
                background-color: #3a70e0;
            }
            
            /* Styles pour le sélecteur de date */
            .calendar-title-clickable {
                position: relative;
            }
            
            .calendar-title-clickable:hover {
                color: #4C84FF;
            }
            
            .calendar-title-clickable::after {
                content: "🗓️";
                margin-left: 8px;
                font-size: 0.8em;
            }
            
            .date-selector-container {
                margin: 10px 0;
            }
            
            .date-selector-hint {
                color: #666;
                margin-bottom: 15px;
                font-size: 0.9rem;
            }
            
            .date-picker-input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 1rem;
                text-align: center;
            }
            
            /* Style personnalisé pour flatpickr */
            .flatpickr-calendar {
                box-shadow: none !important;
                margin: 0 auto;
            }
            
            .flatpickr-day.selected {
                background: #4C84FF !important;
                border-color: #4C84FF !important;
            }
            
            .flatpickr-day:hover {
                background: rgba(76, 132, 255, 0.2) !important;
            }
            
            /* Amélioration de l'affichage du calendrier */
            .fc .fc-daygrid-day-top {
                display: flex;
                justify-content: center;
                padding: 4px;
            }
            
            .fc .fc-daygrid-day-number {
                font-size: 1rem;
                font-weight: 500;
                color: #444;
                text-decoration: none;
            }
            
            .fc .fc-col-header-cell-cushion {
                text-decoration: none;
                color: #333;
                font-weight: 600;
                text-transform: uppercase;
                font-size: 0.8rem;
                letter-spacing: 0.5px;
            }
            
            .fc .fc-toolbar-title {
                font-size: 1.5rem;
                font-weight: 700;
                color: #333;
                text-transform: capitalize;
            }
            
            .fc .fc-button {
                background-color: #f5f7fa;
                border-color: #e5e9f2;
                color: #444;
                font-weight: 500;
                text-transform: capitalize;
                transition: all 0.2s;
            }
            
            .fc .fc-button:hover {
                background-color: #e9ecf5;
                border-color: #d0d6e6;
            }
            
            .fc .fc-button-primary:not(:disabled):active,
            .fc .fc-button-primary:not(:disabled).fc-button-active {
                background-color: #4C84FF;
                border-color: #4C84FF;
            }
            
            .fc .fc-event {
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.85rem;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                transition: box-shadow 0.2s;
            }
            
            .fc .fc-event:hover {
                box-shadow: 0 3px 6px rgba(0,0,0,0.15);
            }
            
            .fc .fc-day-today {
                background-color: rgba(76, 132, 255, 0.05) !important;
            }
            
            .fc .fc-timegrid-slot {
                height: 40px !important;
            }
            
            .fc .fc-timegrid-axis-cushion {
                font-weight: 500;
                color: #666;
            }
            
            /* Style spécifique pour la vue jour */
            .fc-timeGridDay-view .fc-col-header-cell-cushion {
                font-size: 1.2rem;
                font-weight: 700;
                text-transform: capitalize;
                padding: 8px 0;
            }
            
            /* Amélioration de l'en-tête et des filtres */
            .calendar-custom-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding: 0 10px;
            }
            
            .calendar-title-container {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .calendar-icon {
                background-color: #4C84FF;
                color: white;
                padding: 8px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .calendar-header-title {
                font-size: 1.5rem;
                font-weight: 700;
                color: #333;
                margin: 0;
            }
            
            .calendar-filter-container {
                position: relative;
            }
            
            .filter-button {
                display: flex;
                align-items: center;
                gap: 8px;
                background-color: #f5f7fa;
                border: 1px solid #e5e9f2;
                color: #444;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.2s;
            }
            
            .filter-button:hover {
                background-color: #e9ecf5;
            }
            
            .filter-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                width: 220px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                z-index: 10;
                overflow: hidden;
                margin-top: 8px;
            }
            
            .filter-dropdown-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                border-bottom: 1px solid #e5e9f2;
            }
            
            .filter-dropdown-title {
                font-weight: 600;
                color: #333;
                margin: 0;
                font-size: 0.95rem;
            }
            
            .filter-dropdown-close {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
            }
            
            .filter-dropdown-close:hover {
                background-color: #f5f7fa;
                color: #333;
            }
            
            .filter-option-list {
                padding: 8px 0;
            }
            
            .filter-option {
                padding: 10px 16px;
                cursor: pointer;
                transition: background-color 0.2s;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .filter-option:hover {
                background-color: #f5f7fa;
            }
            
            .filter-option.active {
                background-color: #EBF2FF;
                color: #4C84FF;
                font-weight: 500;
            }
            
            .filter-option-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
            }
            
            .status-indicator {
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-right: 8px;
            }
            
            .status-confirmed {
                background-color: #4caf50;
            }
            
            .status-pending {
                background-color: #ff9800;
            }
            
            .status-cancelled {
                background-color: #f44336;
            }
            
            .status-all {
                background: linear-gradient(to right, #4caf50, #ff9800, #f44336);
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className='calendar-container'>
            {/* En-tête personnalisé */}
            <div className="calendar-custom-header">
                <div className="calendar-title-container">
                    <div className="calendar-icon">
                        <CalendarIcon size={20} />
                    </div>
                    <h2 className="calendar-header-title">Calendrier des rendez-vous</h2>
                </div>
                <div className="calendar-filter-container">
                    <button 
                        className="filter-button"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <Filter size={18} />
                        Filtrer par statut
                        <ChevronDown size={16} />
                    </button>
                    
                    {isFilterOpen && (
                        <div className="filter-dropdown">
                            <div className="filter-dropdown-header">
                                <h3 className="filter-dropdown-title">Filtrer les rendez-vous</h3>
                                <button 
                                    className="filter-dropdown-close"
                                    onClick={() => setIsFilterOpen(false)}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="filter-option-list">
                                <div 
                                    className={`filter-option ${statusFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('all')}
                                >
                                    <div className="filter-option-icon">
                                        <span className="status-indicator status-all"></span>
                                    </div>
                                    Tous les rendez-vous
                                </div>
                                <div 
                                    className={`filter-option ${statusFilter === 'confirmé' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('confirmé')}
                                >
                                    <div className="filter-option-icon">
                                        <span className="status-indicator status-confirmed"></span>
                                    </div>
                                    Rendez-vous confirmés
                                </div>
                                <div 
                                    className={`filter-option ${statusFilter === 'en attente' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('en attente')}
                                >
                                    <div className="filter-option-icon">
                                        <span className="status-indicator status-pending"></span>
                                    </div>
                                    Rendez-vous en attente
                                </div>
                                <div 
                                    className={`filter-option ${statusFilter === 'annulé' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('annulé')}
                                >
                                    <div className="filter-option-icon">
                                        <span className="status-indicator status-cancelled"></span>
                                    </div>
                                    Rendez-vous annulés
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {status === 'loading' && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Chargement des rendez-vous...</div>
                </div>
            )}
            
            {events.length === 0 && status === 'succeeded' && (
                <div className="no-events-message">
                    <div className="no-events-icon">📅</div>
                    <div className="no-events-text">Aucun rendez-vous trouvé</div>
                </div>
            )}
            
            <div className='calendar-wrapper'>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'title',
                        center: 'timeGridDay,timeGridWeek,dayGridMonth',
                        right: 'prev,next today'
                    }}
                    initialView='dayGridMonth'
                    editable={false}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    events={filteredEvents}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    eventContent={renderEventContent}
                    locale={frLocale}
                    height="auto"
                    viewDidMount={handleViewDidMount}
                    allDaySlot={false}
                    slotDuration={'00:30:00'}
                    scrollTime={'08:00:00'}
                    slotLabelFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }}
                    buttonText={{
                        today: "Aujourd'hui",
                        month: 'Mois',
                        week: 'Semaine',
                        day: 'Jour'
                    }}
                    dayHeaderFormat={{
                        weekday: 'short'
                    }}
                    views={{
                        timeGridDay: {
                            dayHeaderFormat: {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                omitCommas: true
                            }
                        },
                        timeGridWeek: {
                            dayHeaderFormat: {
                                weekday: 'short',
                                day: 'numeric',
                                omitCommas: true
                            },
                            slotLabelFormat: {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            }
                        },
                        dayGridMonth: {
                            dayHeaderFormat: {
                                weekday: 'short'
                            }
                        }
                    }}
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }}
                    firstDay={1}
                />
            </div>
            
            <style jsx>{`
                .calendar-container {
                    position: relative;
                    width: 100%;
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                    padding: 20px;
                    margin-bottom: 20px;
                }
                
                .calendar-wrapper {
                    width: 100%;
                    margin-top: 20px;
                }
                
                /* Ajout de styles pour rendre les jours plus cliquables visuellement */
                :global(.fc-daygrid-day) {
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                :global(.fc-daygrid-day:hover) {
                    background-color: rgba(76, 132, 255, 0.1);
                }
                
                :global(.fc-daygrid-day.fc-day-today:hover) {
                    background-color: rgba(255, 220, 40, 0.2);
                }
                
                /* Style pour les événements */
                :global(.fc-event-main) {
                    padding: 2px 4px !important;
                }
                
                :global(.fc-toolbar-chunk) {
                    display: flex;
                    align-items: center;
                }
                
                :global(.fc-button-group) {
                    margin-left: 8px !important;
                }
                
                .loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.8);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 10;
                    border-radius: 12px;
                }
                
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #4C84FF;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 15px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .loading-text {
                    font-size: 16px;
                    color: #666;
                }
                
                .no-events-message {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                    color: #666;
                }
                
                .no-events-icon {
                    font-size: 40px;
                    margin-bottom: 15px;
                }
                
                .no-events-text {
                    font-size: 18px;
                }
            `}</style>
        </div>
    )
}

function renderEventContent(eventInfo) {
    const statusText = eventInfo.event.extendedProps.statusText;
    
    return (
        <div className="event-content">
            {eventInfo.timeText && <div className="event-time">{eventInfo.timeText}</div>}
            <div className="event-title">{eventInfo.event.title}</div>
            <div className="event-status">{statusText}</div>
            
            <style jsx>{`
                .event-content {
                    padding: 2px 4px;
                    overflow: hidden;
                    width: 100%;
                }
                
                .event-time {
                    font-weight: bold;
                    font-size: 0.85em;
                    margin-bottom: 2px;
                }
                
                .event-title {
                    font-weight: 500;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 2px;
                }
                
                .event-status {
                    font-size: 0.75em;
                    opacity: 0.9;
                }
            `}</style>
        </div>
    )
}


