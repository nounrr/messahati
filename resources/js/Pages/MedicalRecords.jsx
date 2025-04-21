import React from 'react';

const MedicalRecords = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Dossiers Médicaux</h4>
            </div>
            <div className="card-body">
              {/* Liste des dossiers médicaux à implémenter */}
              <p>Liste des dossiers médicaux à venir...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sous-composant pour la création
MedicalRecords.Create = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Nouveau Dossier Médical</h4>
            </div>
            <div className="card-body">
              {/* Formulaire de création à implémenter */}
              <p>Formulaire de création de dossier médical à venir...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords; 