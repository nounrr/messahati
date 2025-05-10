import React from 'react';
import { X } from 'lucide-react';

function OrdonnanceDetails({ ordonnance, onClose }) {
    if (!ordonnance) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Détails de l'ordonnance</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* En-tête */}
                    <div className="border-b pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold text-blue-600">Dr. {ordonnance.docteur?.name}</h3>
                                <p className="text-gray-600">{ordonnance.docteur?.specialite}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-600">Date: {new Date(ordonnance.date_emission).toLocaleDateString()}</p>
                                <p className="text-gray-600">Expire le: {new Date(ordonnance.date_expiration).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Informations du patient */}
                    <div className="border-b pb-4">
                        <h4 className="text-lg font-semibold mb-2">Patient</h4>
                        <p className="text-gray-700">Nom: {ordonnance.patient?.name}</p>
                    </div>

                    {/* Médicaments prescrits */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Médicaments prescrits</h4>
                        <div className="space-y-2">
                            {ordonnance.medicaments?.map((medicament, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                    <p className="font-medium">{medicament.nom}</p>
                                    <p className="text-gray-600 text-sm">{medicament.posologie}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description/Notes */}
                    {ordonnance.description && (
                        <div className="border-t pt-4">
                            <h4 className="text-lg font-semibold mb-2">Notes</h4>
                            <p className="text-gray-700">{ordonnance.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrdonnanceDetails; 