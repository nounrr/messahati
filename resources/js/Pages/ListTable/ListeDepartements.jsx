

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartements, deleteDepartement, exportDepartements, importDepartements } from '../../Redux/departements/departementSlice';
import TableDataLayer from '../Components/tables/TableDataLayer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Swal from 'sweetalert2';
import Departement from '../Components/Popup/Departement';
import { Upload, Download, Trash2, Plus } from 'lucide-react';

const ListeDepartements = () => {
    const dispatch = useDispatch();
    const { items: departements, status, error } = useSelector((state) => state.departements);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDepartement, setSelectedDepartement] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDepartements());
        }
    }, [status, dispatch]);

    const handleAdd = () => {
        setSelectedDepartement(null);
        setShowPopup(true);
    };

    const handleEdit = (departement) => {
        setSelectedDepartement(departement);
        setShowPopup(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Cette action ne peut pas être annulée!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer!'
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deleteDepartement(id)).unwrap();
                Swal.fire(
                    'Supprimé!',
                    'Le département a été supprimé avec succès.',
                    'success'
                );
            } catch (error) {
                Swal.fire(
                    'Erreur!',
                    'Une erreur est survenue lors de la suppression.',
                    'error'
                );
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRows.length === 0) return;

        const result = await Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Cette action ne peut pas être annulée!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer!'
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deleteDepartement(selectedRows)).unwrap();
                setSelectedRows([]);
                Swal.fire(
                    'Supprimé!',
                    'Les départements ont été supprimés avec succès.',
                    'success'
                );
            } catch (error) {
                Swal.fire(
                    'Erreur!',
                    'Une erreur est survenue lors de la suppression.',
                    'error'
                );
            }
        }
    };

    const handleExport = async () => {
        try {
            await dispatch(exportDepartements()).unwrap();
            Swal.fire('Succès', 'Export réussi!', 'success');
        } catch (error) {
            Swal.fire('Erreur', 'Erreur lors de l\'export.', 'error');
        }
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            await dispatch(importDepartements(file)).unwrap();
            Swal.fire('Succès', 'Import réussi!', 'success');
            dispatch(fetchDepartements());
        } catch (error) {
            Swal.fire('Erreur', 'Erreur lors de l\'import.', 'error');
        }
        event.target.value = '';
    };

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows || []);
    };

    const columns = [
        {
            name: 'Nom',
            selector: row => row.nom,
            sortable: true,
        },
        {
            name: 'Description',
            selector: row => row.description || 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Image',
            selector: row => row.img_path,
            cell: row => row.img_path ? (
                <img 
                    src={`/storage/${row.img_path}`} 
                    alt="Département" 
                    className="w-10 h-10 rounded-full object-cover"
                />
            ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">N/A</span>
                </div>
            ),
        },
        {
            name: 'Date de création',
            selector: row => row.created_at,
            sortable: true,
            format: row => format(new Date(row.created_at), 'dd MMMM yyyy', { locale: fr }),
        }
    ];

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="text-center text-red-600 p-4">
                <p className="text-xl">Une erreur est survenue</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Liste des Départements</h1>
                <div className="flex flex-wrap gap-3">
                    <input
                        type="file"
                        id="import-file"
                        className="hidden"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleImport}
                    />
                    <label
                        htmlFor="import-file"
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer"
                    >
                        <Upload size={18} />
                        Importer
                    </label>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
                    >
                        <Download size={18} />
                        Exporter
                    </button>
                    {selectedRows.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                        >
                            <Trash2 size={18} />
                            Supprimer ({selectedRows.length})
                        </button>
                    )}
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        <Plus size={18} />
                        Ajouter
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <TableDataLayer
                    columns={columns}
                    data={departements}
                    onSelectedRowsChange={handleRowSelected}
                    selectedRows={selectedRows}
                    isLoading={isLoading || status === 'loading'}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showCheckbox={true}
                    pageLength={10}
                    dense
                    pagination
                    highlightOnHover
                    pointerOnHover
                    responsive
                />
            </div>

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <Departement
                            departement={selectedDepartement}
                            onClose={() => {
                                setShowPopup(false);
                                dispatch(fetchDepartements());
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListeDepartements; 