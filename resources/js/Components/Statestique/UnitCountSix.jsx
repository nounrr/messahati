import React, { useEffect, useState } from "react";
import axios from "axios";
const gradients = [
  "from-red-500 to-red-300",
  "from-blue-500 to-blue-300",
  "from-green-500 to-green-300",
  "from-yellow-500 to-yellow-300",
];

const UnitCountSix = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("/api/dashboard-stats")
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  if (!stats) {
    return (
      <div className="p-4 text-gray-600 text-center">
        Chargement des statistiques...
      </div>
    );
  }

  const statCards = [
    { count: stats.total_avance ?? 0, label: "Total Avances", color: "orange", icon: "ri-wallet-3-fill" },
    { count: stats.total_paye ?? 0, label: "Total Payé", color: "emerald", icon: "ri-bank-card-fill" },
    { count: stats.total_presents ?? 0, label: "Présents", color: "sky", icon: "ri-user-follow-fill" },
    { count: Array.isArray(stats.absents) ? stats.absents.length : 0, label: "Absents", color: "rose", icon: "ri-user-unfollow-fill" },
    { count: Array.isArray(stats.reclamations) ? stats.reclamations.length : 0, label: "Réclamations", color: "red", icon: "ri-error-warning-fill" },
    { count: stats.reclamations_today ?? 0, label: "Réclamations Aujourd’hui", color: "yellow", icon: "ri-error-warning-line" },
    { count: stats.total_vendus ?? 0, label: "Total Vendus", color: "blue", icon: "ri-capsule-fill" },
    { count: stats.total_patients_actifs ?? 0, label: "Patients Actifs", color: "violet", icon: "ri-user-heart-fill" },
    { count: stats.total_rendez_vous_aujourdhui ?? 0, label: "Rendez-vous Aujourd’hui", color: "indigo", icon: "ri-calendar-check-fill" },
    { count: stats.total_rendez_vous_prevus ?? 0, label: "Rendez-vous Prévus", color: "teal", icon: "ri-calendar-event-fill" },
    { count: stats.patients_passes ?? 0, label: "Patients Passés", color: "pink", icon: "ri-user-star-fill" },
    { count: stats.capacite_lits_occupes ?? 0, label: "Lits Occupés", color: "gray", icon: "ri-hotel-bed-fill" },
    { count: stats.disponibilite_stock ?? 0, label: "Stock Disponible", color: "fuchsia", icon: "ri-box-3-fill" },
    { count: stats.medecin_rating?.rating ?? 0, label: "Note Médecin", color: "lime", icon: "ri-stethoscope-fill" },
    { count: stats.infirmiere_rating?.rating ?? 0, label: "Note Infirmière", color: "amber", icon: "ri-nurse-fill" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {statCards.map((item, index) => {
        const gradient = gradients[index % gradients.length];
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${gradient} text-white p-4 rounded-xl shadow-md`}
          >
            <div className="flex items-center space-x-4">
              <i className={`text-3xl ${item.icon}`}></i>
              <div>
                <h6 className="text-xl font-bold">{item.count}</h6>
                <p className="text-sm">{item.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UnitCountSix;
