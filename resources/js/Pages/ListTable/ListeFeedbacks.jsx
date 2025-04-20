import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks, deleteFeedback } from '../../Redux/feedbacks/feedbackSlice';
import TableDataLayer from '../Components/tables/TableDataLayer';
import Feedback from '../Components/Popup/Feedback';
import Swal from 'sweetalert2';
import { Plus, Pencil, Trash2, Eye, Star } from 'lucide-react';
import { Icon } from '@iconify/react';

function ListeFeedbacks() {
    const dispatch = useDispatch();
    const { items: feedbacks, status } = useSelector((state) => state.feedbacks);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchFeedbacks());
        }
    }, [status, dispatch]);

    const handleRowSelect = (row) => {
        setSelectedRows([row]);
    };

    const handleAdd = () => {
        setSelectedFeedback(null);
        setShowPopup(true);
    };

    const handleEdit = (feedback) => {
        setSelectedFeedback(feedback);
        setShowPopup(true);
    };

    const handleDelete = async (id) => {
        try {
            setIsLoading(true);
            await dispatch(deleteFeedback(id)).unwrap();
            
            Swal.fire({
                icon: 'success',
                title: 'Succès !',
                text: 'Le feedback a été supprimé avec succès.'
            });
            
            dispatch(fetchFeedbacks());
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

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedFeedback(null);
    };

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, index) => (
            <Star
                key={index}
                size={16}
                className={index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
            />
        ));
    };

    const getStatusColor = (status) => {
        const colors = {
            'en_attente': 'bg-yellow-100 text-yellow-800',
            'traite': 'bg-green-100 text-green-800',
            'ignore': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            width: '80px'
        },
        {
            name: 'Utilisateur',
            selector: row => row.user?.name || 'Non assigné',
            sortable: true,
            grow: 1
        },
        {
            name: 'Contenu',
            selector: row => row.contenu,
            sortable: true,
            grow: 2
        },
        {
            name: 'Note',
            selector: row => row.note,
            cell: row => (
                <div className="flex">
                    {[...Array(5)].map((_, index) => (
                        <Icon 
                            key={index}
                            icon={index < row.note ? "material-symbols:star" : "material-symbols:star-outline"}
                            className={index < row.note ? "text-yellow-400" : "text-gray-300"}
                        />
                    ))}
                </div>
            ),
            sortable: true,
            width: '150px'
        },
        {
            name: 'Date',
            selector: row => row.created_at,
            format: row => row.created_at ? new Date(row.created_at).toLocaleDateString('fr-FR') : 'Non définie',
            sortable: true,
            grow: 1
        },
        {
            name: 'Statut',
            selector: row => row.status,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-sm ${
                    row.status === 'En attente' ? 'bg-warning-focus text-warning-main' :
                    row.status === 'Traité' ? 'bg-success-focus text-success-main' :
                    'bg-danger-focus text-danger-main'
                }`}>
                    {row.status}
                </span>
            ),
            sortable: true,
            width: '120px'
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="w-8 h-8 bg-success-focus text-success-main rounded-full flex items-center justify-center"
                        title="Modifier"
                    >
                        <Icon icon="lucide:edit" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="w-8 h-8 bg-danger-focus text-danger-main rounded-full flex items-center justify-center"
                        title="Supprimer"
                    >
                        <Icon icon="mingcute:delete-2-line" />
                    </button>
                    <button
                        className="w-8 h-8 bg-primary-light text-primary-600 rounded-full flex items-center justify-center"
                        title="Voir les détails"
                    >
                        <Icon icon="iconamoon:eye-light" />
                    </button>
                </div>
            ),
            width: '150px',
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Feedbacks</h1>
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
                data={feedbacks}
                columns={columns}
                onRowSelect={handleRowSelect}
                selectedRows={selectedRows}
                isLoading={isLoading || status === 'loading'}
            />

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <Feedback onClose={handleClosePopup} feedback={selectedFeedback} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListeFeedbacks; 