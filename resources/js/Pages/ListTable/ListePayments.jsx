import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayments, deletePayment } from '@/Redux/payments/paymentSlice';
import TableDataLayer from '../Components/tables/TableDataLayer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Swal from 'sweetalert2';
import Payment from '@/Pages/Components/Popup/Payment';

const ListePayments = () => {
    const dispatch = useDispatch();
    const { items: payments, status, error } = useSelector((state) => state.payments);
    const [selectedRows, setSelectedRows] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPayments());
        }
    }, [status, dispatch]);

    const handleAdd = () => {
        setSelectedPayment(null);
        setShowPopup(true);
    };

    const handleEdit = (payment) => {
        setSelectedPayment(payment);
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
                await dispatch(deletePayment(id)).unwrap();
                Swal.fire(
                    'Supprimé !',
                    'Le paiement a été supprimé avec succès.',
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
            Header: 'Date',
            accessor: 'date',
            Cell: ({ value }) => format(new Date(value), 'dd MMMM yyyy', { locale: fr }),
        },
        {
            Header: 'Montant',
            accessor: 'montant',
            Cell: ({ value }) => `${value.toLocaleString('fr-FR')} FCFA`,
        },
        {
            Header: 'Mode de paiement',
            accessor: 'mode_paiement',
            Cell: ({ value }) => (
                <span className="capitalize">{value}</span>
            ),
        },
        {
            Header: 'Statut',
            accessor: 'statut',
            Cell: ({ value }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    value === 'complete' ? 'bg-green-100 text-green-800' :
                    value === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {value === 'complete' ? 'Complété' :
                     value === 'en_attente' ? 'En attente' :
                     'Annulé'}
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
                    <h1 className="text-2xl font-bold text-gray-800">Paiements</h1>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                    >
                        Nouveau paiement
                    </button>
                </div>

                <TableDataLayer
                    columns={columns}
                    data={payments}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    searchable={true}
                    pagination={true}
                    pageSize={10}
                />
            </div>

            {showPopup && (
                <Payment
                    payment={selectedPayment}
                    onClose={() => {
                        setShowPopup(false);
                        setSelectedPayment(null);
                    }}
                />
            )}
        </div>
    );
};

export default ListePayments; 