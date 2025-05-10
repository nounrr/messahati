import React from 'react';

const Appointments = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Rendez-vous</h4>
            </div>
            <div className="card-body">
              {/* Calendrier et liste des rendez-vous à implémenter */}
              <p>Calendrier et liste des rendez-vous à venir...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sous-composant pour la création
Appointments.Create = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Nouveau Rendez-vous</h4>
            </div>
            <div className="card-body">
              {/* Formulaire de création à implémenter */}
              <p>Formulaire de création de rendez-vous à venir...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments; 