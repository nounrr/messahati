import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCertificatsMedicales, deleteCertificatMedical } from '@/Redux/certificatsMedicales/certificatMedicalSlice';
import TableDataLayer from '../Components/tables/TableDataLayer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Swal from 'sweetalert2';
import CertificatMedical from '@/Pages/Components/Popup/CertificatMedical';

const ListeCertificatsMedicales = () => {
    const dispatch = useDispatch();
    const { items: certificats, status, error } = useSelector((state) => state.certificatsMedicales);
    const [selectedRows, setSelectedRows] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCertificat, setSelectedCertificat] = useState(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCertificatsMedicales());
        }
    }, [status, dispatch]);

    const handleAdd = () => {
        setSelectedCertificat(null);
        setShowPopup(true);
    };

    const handleEdit = (certificat) => {
        setSelectedCertificat(certificat);
        setShowPopup(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Cette action est irréversible !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deleteCertificatMedical(id)).unwrap();
                Swal.fire(
                    'Supprimé !',
                    'Le certificat médical a été supprimé avec succès.',
                    'success'
                );
            } catch (error) {
                Swal.fire(
                    'Erreur !',
                    'Une erreur est survenue lors de la suppression.',
                    'error'
                );
            }
        }
    };

    const columns = [
        {
            Header: 'Patient',
            accessor: 'patient.name',
        },
        {
            Header: 'Type de certificat',
            accessor: 'type_certificat.type_certificat',
        },
        {
            Header: 'Date de délivrance',
            accessor: 'date_delivrance',
            Cell: ({ value }) => format(new Date(value), 'dd MMMM yyyy', { locale: fr }),
        },
        {
            Header: 'Date d\'expiration',
            accessor: 'date_expiration',
            Cell: ({ value }) => format(new Date(value), 'dd MMMM yyyy', { locale: fr }),
        },
        {
            Header: 'Statut',
            accessor: 'statut',
            Cell: ({ value }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    value === 'valide' ? 'bg-green-100 text-green-800' :
                    value === 'expire' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    {value === 'valide' ? 'Valide' :
                     value === 'expire' ? 'Expiré' :
                     'En attente'}
                </span>
            ),
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
        return <div className="text-center py-4">Chargement...</div>;
    }

    if (status === 'failed') {
        return <div className="text-center py-4 text-red-500">Erreur: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Certificats médicaux</h1>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                    >
                        Nouveau certificat
                    </button>
                </div>

                <TableDataLayer
                    columns={columns}
                    data={certificats}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    searchable={true}
                    pagination={true}
                    pageSize={10}
                />
            </div>

            {showPopup && (
                <CertificatMedical
                    certificat={selectedCertificat}
                    onClose={() => {
                        setShowPopup(false);
                        setSelectedCertificat(null);
                    }}
                />
            )}
        </div>
    );
};

export default ListeCertificatsMedicales; 