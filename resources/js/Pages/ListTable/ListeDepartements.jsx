import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartements, deleteDepartements } from '../../Redux/departements/departementSlice';
import TableDataLayer from '../../Components/TableDataLayer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Swal from 'sweetalert2';
import Departement from '../Components/Popup/Departement';

const ListeDepartements = () => {
    const dispatch = useDispatch();
    const { items: departements, status, error } = useSelector((state) => state.departements);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDepartement, setSelectedDepartement] = useState(null);

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
            confirmButtonText: 'Oui, supprimer!',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deleteDepartements([id])).unwrap();
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

    const columns = [
        {
            Header: 'Nom',
            accessor: 'nom',
        },
        {
            Header: 'Description',
            accessor: 'description',
        },
        {
            Header: 'Image',
            accessor: 'img_path',
            Cell: ({ value }) => value ? (
                <img 
                    src={`/storage/${value}`} 
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
            Header: 'Date de création',
            accessor: 'created_at',
            Cell: ({ value }) => format(new Date(value), 'dd MMMM yyyy', { locale: fr }),
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(row.original)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Modifier
                    </button>
                    <button
                        onClick={() => handleDelete(row.original.id)}
                        className="text-red-600 hover:text-red-800"
                    >
                        Supprimer
                    </button>
                </div>
            ),
        },
    ];

    if (status === 'loading') {
        return <div>Chargement...</div>;
    }

    if (status === 'failed') {
        return <div>Erreur: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Liste des Départements</h1>
                <button
                    onClick={handleAdd}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Ajouter un département
                </button>
            </div>

            <TableDataLayer
                columns={columns}
                data={departements}
            />

            {showPopup && (
                <Departement
                    departement={selectedDepartement}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </div>
    );
};

export default ListeDepartements; 