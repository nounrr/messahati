import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedicaments, deleteMedicament } from '../../Redux/medicaments/medicamentSlice';
import TableDataLayer from '../../Components/TableDataLayer';
import Medicament from '../Components/Popup/Medicament';
import Swal from 'sweetalert2';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';

function ListeMedicaments() {
    const dispatch = useDispatch();
    const { items: medicaments, status } = useSelector((state) => state.medicaments);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedMedicament, setSelectedMedicament] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Charger les médicaments au chargement du composant
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchMedicaments());
        }
    }, [status, dispatch]);

    // Gérer la sélection d'une ligne
    const handleRowSelect = (row) => {
        setSelectedRows([row]);
    };

    // Gérer l'ajout d'un nouveau médicament
    const handleAdd = () => {
        setSelectedMedicament(null);
        setShowPopup(true);
    };

    // Gérer l'édition d'un médicament existant
    const handleEdit = (medicament) => {
        setSelectedMedicament(medicament);
        setShowPopup(true);
    };

    // Gérer la suppression d'un médicament
    const handleDelete = async (id) => {
        try {
            setIsLoading(true);
            await dispatch(deleteMedicament(id)).unwrap();
            
            Swal.fire({
                icon: 'success',
                title: 'Succès !',
                text: 'Le médicament a été supprimé avec succès.'
            });
            
            // Rafraîchir la liste
            dispatch(fetchMedicaments());
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            
            Swal.fire({
                icon: 'error',
                title: 'Erreur !',
                text: 'Une erreur est survenue lors de la suppression.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Fermer le popup
    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedMedicament(null);
    };

    // Configuration des colonnes pour le tableau
    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Nom', accessor: 'nom' },
        { header: 'Type', accessor: 'type_medicament.nom' },
        { header: 'Description', accessor: 'description' },
        { header: 'Prix', accessor: 'prix' },
        { header: 'Stock', accessor: 'stock' },
        {
            header: 'Actions',
            accessor: 'actions',
            cell: (row) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Modifier"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Supprimer"
                    >
                        <Trash2 size={18} />
                    </button>
                    <button
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Voir les détails"
                    >
                        <Eye size={18} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Médicaments</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <Plus size={18} className="mr-1" />
                        Ajouter
                    </button>
                </div>
            </div>

            <TableDataLayer
                data={medicaments}
                columns={columns}
                onRowSelect={handleRowSelect}
                selectedRows={selectedRows}
                isLoading={isLoading || status === 'loading'}
            />

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <Medicament onClose={handleClosePopup} medicament={selectedMedicament} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListeMedicaments; 