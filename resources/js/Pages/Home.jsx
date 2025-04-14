import React, { useState } from "react";
import { SafetyStatus, DangerStatus, WarningStatus } from "../Components/Child/Status";
import Departement from "./Components/Popup/Departement";
import Clinique from "./Components/Popup/Clinique";
import Partenaire from "./Components/Popup/Partenaire";
import TypePartenaire from "./Components/Popup/TypePartenaire";
import TypeCertificat from "./Components/Popup/TypeCertificat";
import TypeMedicament from "./Components/Popup/TypeMedicament";
import TypeTraitement from "./Components/Popup/TypeTraitement";
import Mutuel from './Components/Popup/Mutuel';
import Medicament from "./Components/Popup/Medicament";
import Traitement from "./Components/Popup/Traitement";
import CertificatMedical from "./Components/Popup/CertificatMedical";
import Ordonnance from "./Components/Popup/Ordonnance";
import Tache from "./Components/Popup/Tache";
import RendezVous from "./Components/Popup/RendezVous";
import Reclamation from "./Components/Popup/Reclamation";
import Payment from "./Components/Popup/Payment";
import Message from "./Components/Popup/Message";
import Notification from "./Components/Popup/Notification";
import Salaire from "./Components/Popup/Salaire";
import Charge from "./Components/Popup/Charge";
import AuditLogClinique from "./Components/Popup/AuditLogClinique";
import Feedback from "./Components/Popup/Feedback";

const Home = () => {
    // États pour chaque popup
    const [isDepartementActive, setIsDepartementActive] = useState(false);
    const [isCliniqueActive, setIsCliniqueActive] = useState(false);
    const [isMutuelActive, setIsMutuelActive] = useState(false);
    const [isPartenaireActive, setIsPartenaireActive] = useState(false);
    const [isTypePartenaireActive, setIsTypePartenaireActive] = useState(false);
    const [isTypeCertificatActive, setIsTypeCertificatActive] = useState(false);
    const [isTypeMedicamentActive, setIsTypeMedicamentActive] = useState(false);
    const [isTypeTraitementActive, setIsTypeTraitementActive] = useState(false);
    const [isMedicamentActive, setIsMedicamentActive] = useState(false);
    const [isTraitementActive, setIsTraitementActive] = useState(false);
    const [isCertificatMedicalActive, setIsCertificatMedicalActive] = useState(false);
    const [isOrdonnanceActive, setIsOrdonnanceActive] = useState(false);
    const [isTacheActive, setIsTacheActive] = useState(false);
    const [isRendezVousActive, setIsRendezVousActive] = useState(false);
    const [isReclamationActive, setIsReclamationActive] = useState(false);
    const [isPaymentActive, setIsPaymentActive] = useState(false);
    const [isMessageActive, setIsMessageActive] = useState(false);
    const [isNotificationActive, setIsNotificationActive] = useState(false);
    const [isSalaireActive, setIsSalaireActive] = useState(false);
    const [isChargeActive, setIsChargeActive] = useState(false);
    const [isAuditLogCliniqueActive, setIsAuditLogCliniqueActive] = useState(false);
    const [isFeedbackActive, setIsFeedbackActive] = useState(false);

    // Fonctions d'activation/désactivation pour chaque popup
    const activateDepartement = () => setIsDepartementActive(true);
    const desactivateDepartement = () => setIsDepartementActive(false);
    
    const activateClinique = () => setIsCliniqueActive(true);
    const desactivateClinique = () => setIsCliniqueActive(false);
    
    const activateMutuel = () => setIsMutuelActive(true);
    const desactivateMutuel = () => setIsMutuelActive(false);
    
    const activatePartenaire = () => setIsPartenaireActive(true);
    const desactivatePartenaire = () => setIsPartenaireActive(false);
    
    const activateTypePartenaire = () => setIsTypePartenaireActive(true);
    const desactivateTypePartenaire = () => setIsTypePartenaireActive(false);
    
    const activateTypeCertificat = () => setIsTypeCertificatActive(true);
    const desactivateTypeCertificat = () => setIsTypeCertificatActive(false);
    
    const activateTypeMedicament = () => setIsTypeMedicamentActive(true);
    const desactivateTypeMedicament = () => setIsTypeMedicamentActive(false);
    
    const activateTypeTraitement = () => setIsTypeTraitementActive(true);
    const desactivateTypeTraitement = () => setIsTypeTraitementActive(false);

    const activateMedicament = () => setIsMedicamentActive(true);
    const desactivateMedicament = () => setIsMedicamentActive(false);

    const activateTraitement = () => setIsTraitementActive(true);
    const desactivateTraitement = () => setIsTraitementActive(false);

    const activateCertificatMedical = () => setIsCertificatMedicalActive(true);
    const desactivateCertificatMedical = () => setIsCertificatMedicalActive(false);

    const activateOrdonnance = () => setIsOrdonnanceActive(true);
    const desactivateOrdonnance = () => setIsOrdonnanceActive(false);

    const activateTache = () => setIsTacheActive(true);
    const desactivateTache = () => setIsTacheActive(false);

    const activateRendezVous = () => setIsRendezVousActive(true);
    const desactivateRendezVous = () => setIsRendezVousActive(false);

    const activateReclamation = () => setIsReclamationActive(true);
    const desactivateReclamation = () => setIsReclamationActive(false);

    const activatePayment = () => setIsPaymentActive(true);
    const desactivatePayment = () => setIsPaymentActive(false);

    const activateMessage = () => setIsMessageActive(true);
    const desactivateMessage = () => setIsMessageActive(false);

    const activateNotification = () => setIsNotificationActive(true);
    const desactivateNotification = () => setIsNotificationActive(false);

    const activateSalaire = () => setIsSalaireActive(true);
    const desactivateSalaire = () => setIsSalaireActive(false);

    const activateCharge = () => setIsChargeActive(true);
    const desactivateCharge = () => setIsChargeActive(false);

    const activateAuditLogClinique = () => setIsAuditLogCliniqueActive(true);
    const desactivateAuditLogClinique = () => setIsAuditLogCliniqueActive(false);

    const activateFeedback = () => setIsFeedbackActive(true);
    const desactivateFeedback = () => setIsFeedbackActive(false);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Gestion de la Clinique</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Configuration */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Configuration</h2>
                    <div className="space-y-2">
                        <button onClick={activateDepartement} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                            Départements
                        </button>
                        <button onClick={activateClinique} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                            Clinique
                        </button>
                        <button onClick={activateMutuel} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                            Mutuelles
                        </button>
                    </div>
                </div>

                {/* Types */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Types</h2>
                    <div className="space-y-2">
                        <button onClick={activateTypePartenaire} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                            Types de Partenaires
                        </button>
                        <button onClick={activateTypeCertificat} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                            Types de Certificats
                        </button>
                        <button onClick={activateTypeMedicament} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                            Types de Médicaments
                        </button>
                        <button onClick={activateTypeTraitement} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                            Types de Traitements
                        </button>
                    </div>
                </div>

                {/* Partenaires */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Partenaires</h2>
                    <div className="space-y-2">
                        <button onClick={activatePartenaire} className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600">
                            Partenaires
                        </button>
                    </div>
                </div>

                {/* Médical */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Médical</h2>
                    <div className="space-y-2">
                        <button onClick={activateMedicament} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">
                            Médicaments
                        </button>
                        <button onClick={activateTraitement} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">
                            Traitements
                        </button>
                        <button onClick={activateCertificatMedical} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">
                            Certificats Médicaux
                        </button>
                        <button onClick={activateOrdonnance} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">
                            Ordonnances
                        </button>
                    </div>
                </div>

                {/* Rendez-vous et Tâches */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Planification</h2>
                    <div className="space-y-2">
                        <button onClick={activateRendezVous} className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
                            Rendez-vous
                        </button>
                        <button onClick={activateTache} className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
                            Tâches
                        </button>
                    </div>
                </div>

                {/* Communication */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Communication</h2>
                    <div className="space-y-2">
                        <button onClick={activateMessage} className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600">
                            Messages
                        </button>
                        <button onClick={activateNotification} className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600">
                            Notifications
                        </button>
                        <button onClick={activateReclamation} className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600">
                            Réclamations
                        </button>
                        <button onClick={activateFeedback} className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600">
                            Feedbacks
                        </button>
                    </div>
                </div>

                {/* Finances */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Finances</h2>
                    <div className="space-y-2">
                        <button onClick={activatePayment} className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600">
                            Paiements
                        </button>
                        <button onClick={activateSalaire} className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600">
                            Salaires
                        </button>
                        <button onClick={activateCharge} className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600">
                            Charges
                        </button>
                    </div>
                </div>

                {/* Audit */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Audit</h2>
                    <div className="space-y-2">
                        <button onClick={activateAuditLogClinique} className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
                            Journal d'Audit
                        </button>
                    </div>
                </div>
            </div>

            {/* Popups */}
            {isDepartementActive && <Departement onClose={desactivateDepartement} />}
            {isCliniqueActive && <Clinique onClose={desactivateClinique} />}
            {isMutuelActive && <Mutuel onClose={desactivateMutuel} />}
            {isPartenaireActive && <Partenaire onClose={desactivatePartenaire} />}
            {isTypePartenaireActive && <TypePartenaire onClose={desactivateTypePartenaire} />}
            {isTypeCertificatActive && <TypeCertificat onClose={desactivateTypeCertificat} />}
            {isTypeMedicamentActive && <TypeMedicament onClose={desactivateTypeMedicament} />}
            {isTypeTraitementActive && <TypeTraitement onClose={desactivateTypeTraitement} />}
            {isMedicamentActive && <Medicament onClose={desactivateMedicament} />}
            {isTraitementActive && <Traitement onClose={desactivateTraitement} />}
            {isCertificatMedicalActive && <CertificatMedical onClose={desactivateCertificatMedical} />}
            {isOrdonnanceActive && <Ordonnance onClose={desactivateOrdonnance} />}
            {isTacheActive && <Tache onClose={desactivateTache} />}
            {isRendezVousActive && <RendezVous onClose={desactivateRendezVous} />}
            {isReclamationActive && <Reclamation onClose={desactivateReclamation} />}
            {isPaymentActive && <Payment onClose={desactivatePayment} />}
            {isMessageActive && <Message onClose={desactivateMessage} />}
            {isNotificationActive && <Notification onClose={desactivateNotification} />}
            {isSalaireActive && <Salaire onClose={desactivateSalaire} />}
            {isChargeActive && <Charge onClose={desactivateCharge} />}
            {isAuditLogCliniqueActive && <AuditLogClinique onClose={desactivateAuditLogClinique} />}
            {isFeedbackActive && <Feedback onClose={desactivateFeedback} />}
        </div>
    );
};

export default Home;
          