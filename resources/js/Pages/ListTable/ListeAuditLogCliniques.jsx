import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuditLogCliniques } from '@/Redux/auditLogCliniques/auditLogCliniqueSlice';
import TableDataLayer from '../Components/tables/TableDataLayer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ListeAuditLogCliniques = () => {
    const dispatch = useDispatch();
    const { items: auditLogs, status, error } = useSelector((state) => state.auditLogCliniques);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAuditLogCliniques());
        }
    }, [status, dispatch]);

    const columns = [
        {
            Header: 'Utilisateur',
            accessor: 'user.name',
        },
        {
            Header: 'Action',
            accessor: 'action',
        },
        {
            Header: 'Description',
            accessor: 'description',
        },
        {
            Header: 'IP',
            accessor: 'ip_address',
        },
        {
            Header: 'Date',
            accessor: 'created_at',
            Cell: ({ value }) => format(new Date(value), 'dd MMMM yyyy HH:mm', { locale: fr }),
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
                    <h1 className="text-2xl font-bold text-gray-800">Logs d'audit de la clinique</h1>
                </div>

                <TableDataLayer
                    columns={columns}
                    data={auditLogs}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    searchable={true}
                    pagination={true}
                    pageSize={10}
                />
            </div>
        </div>
    );
};

export default ListeAuditLogCliniques; 