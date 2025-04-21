import React from 'react';

const Prescriptions = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Prescriptions</h4>
            </div>
            <div className="card-body">
              {/* Liste des prescriptions à implémenter */}
              <p>Liste des prescriptions à venir...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sous-composant pour la création
Prescriptions.Create = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Nouvelle Prescription</h4>
            </div>
            <div className="card-body">
              {/* Formulaire de création à implémenter */}
              <p>Formulaire de création de prescription à venir...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prescriptions; 