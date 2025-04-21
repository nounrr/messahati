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

export default function Calendar() {
    const dispatch = useDispatch()
    const { items: rendezVousList, status } = useSelector(state => state.rendezvous)
    const [events, setEvents] = useState([])
    const calendarRef = useRef(null)

    // Récupérer les rendez-vous au chargement du composant
    useEffect(() => {
        dispatch(fetchRendezVous())
    }, [dispatch])

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
                } else if (rdv.patient && rdv.patient.name) {
                    title += `${rdv.patient.name}`;
                }

                // Ajouter le nom du patient si disponible et pas déjà ajouté
                if (rdv.patient && rdv.patient.name && title !== rdv.patient.name) {
                    title += title ? ` • ${rdv.patient.name}` : rdv.patient.name;
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

    function handleEventClick(clickInfo) {
        const rdv = clickInfo.event.extendedProps.rdvDetails;
        console.log('Détails du rendez-vous cliqué:', rdv);
        
        // Formatter les données pour l'affichage
        const formattedDate = new Date(rdv.date_heure).toLocaleString('fr-FR');
        const statutText = getStatusText(rdv.statut);
        const statutColor = getStatusColor(rdv.statut);
        
        // Préparer les informations pour l'affichage
        const traitementInfo = getTraitementInfo(rdv);
        const patient = rdv.patient && rdv.patient.name ? rdv.patient.name : 'Non spécifié';
        const docteur = rdv.docteur && rdv.docteur.name ? rdv.docteur.name : 'Non spécifié';
        const departement = rdv.departement && rdv.departement.nom ? rdv.departement.nom : 'Non spécifié';
        
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
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className='calendar-container'>
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
                    selectable={false}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    events={events}
                    eventClick={handleEventClick}
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
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    }}
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }}
                    firstDay={1} // Commence par lundi
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


