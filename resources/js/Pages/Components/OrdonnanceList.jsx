import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react';
import OrdonnanceDetails from './Popup/OrdonnanceDetails';

function OrdonnanceList({ ordonnances = [] }) {
    const [selectedOrdonnance, setSelectedOrdonnance] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrevDay = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() - 1);
            return newDate;
        });
    };
    OrdonnanceList
    const handleNextDay = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + 1);
            return newDate;
        });
    };

    const handleDownloadPDF = (ordonnance) => {
        // Logique pour télécharger le PDF
        console.log('Télécharger PDF pour:', ordonnance.id);
    };

    const handleViewDetails = (ordonnance) => {
        setSelectedOrdonnance(ordonnance);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Les Ordonnances</h2>
                <div className="flex items-center space-x-4">
                    <button onClick={handlePrevDay} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-lg font-medium">
                        {currentDate.toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                        })}
                    </span>
                    <button onClick={handleNextDay} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {ordonnances.map((ordonnance) => (
                    <div key={ordonnance.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span className="font-medium">Dr. {ordonnance.docteur?.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleDownloadPDF(ordonnance)}
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    title="Télécharger PDF"
                                >
                                    <Download size={20} />
                                </button>
                                <button
                                    onClick={() => handleViewDetails(ordonnance)}
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    title="Voir les détails"
                                >
                                    <Eye size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="text-gray-600">Patient : {ordonnance.patient?.name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date(ordonnance.date_emission).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedOrdonnance && (
                <OrdonnanceDetails
                    ordonnance={selectedOrdonnance}
                    onClose={() => setSelectedOrdonnance(null)}
                />
            )}
        </div>
    );
}

export default OrdonnanceList; 