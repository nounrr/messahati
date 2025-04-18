import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCharges, deleteCharges } from '../../Redux/charges/chargeSlice';
import TableDataLayer from '../Components/tables/TableDataLayer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Swal from 'sweetalert2';
import Charge from '../Components/Popup/Charge';

const ListeCharges = () => {
    const dispatch = useDispatch();
    const { items: charges, status, error } = useSelector((state) => state.charges);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCharge, setSelectedCharge] = useState(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCharges());
        }
    }, [status, dispatch]);

    const handleAdd = () => {
        setSelectedCharge(null);
        setShowPopup(true);
    };

    const handleEdit = (charge) => {
        setSelectedCharge(charge);
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
                await dispatch(deleteCharges([id])).unwrap();
                Swal.fire(
                    'Supprimé!',
                    'La charge a été supprimée avec succès.',
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
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Nom',
            selector: row => row.nom,
            sortable: true,
        },
        {
            name: 'Prix unitaire',
            selector: row => row.prix_unitaire,
            format: row => `${row.prix_unitaire.toLocaleString('fr-FR')} MAD`,
            sortable: true,
        },
        {
            name: 'Quantité',
            selector: row => row.quantite,
            sortable: true,
        },
        {
            name: 'Partenaire',
            selector: row => row.partenaire ? row.partenaire.nom : 'N/A',
            sortable: true,
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
                <h1 className="text-2xl font-bold">Liste des Charges</h1>
                <button
                    onClick={handleAdd}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Ajouter une charge
                </button>
            </div>

            <TableDataLayer
                columns={columns}
                data={charges}
                onEdit={handleEdit}
                onDelete={(row) => handleDelete(row.id)}
                title="Liste des Charges"
            />

            {showPopup && (
                <Charge
                    charge={selectedCharge}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </div>
    );
};

export default ListeCharges; 