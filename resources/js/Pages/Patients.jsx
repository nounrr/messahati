import React from 'react';

const Patients = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Liste des Patients</h4>
            </div>
            <div className="card-body">
              {/* Table des patients à implémenter */}
              <p>Contenu de la liste des patients à venir...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sous-composant pour la création
Patients.Create = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Nouveau Patient</h4>
            </div>
            <div className="card-body">
              {/* Formulaire de création à implémenter */}
              <p>Formulaire de création de patient à venir...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients; 