import React from 'react';

const Consultations = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Consultations</h4>
            </div>
            <div className="card-body">
              {/* Liste des consultations à implémenter */}
              <p>Liste des consultations à venir...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sous-composant pour la création
Consultations.Create = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Nouvelle Consultation</h4>
            </div>
            <div className="card-body">
              {/* Formulaire de création à implémenter */}
              <p>Formulaire de création de consultation à venir...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultations; 