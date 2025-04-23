import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdonances } from '@/Redux/ordonances/ordonanceSlice';
import OrdonnanceList from '@/Pages/Components/OrdonnanceList';

function Index() {
    const dispatch = useDispatch();
    const { items: ordonnances, status } = useSelector((state) => state.ordonances);

    useEffect(() => {
        dispatch(fetchOrdonances());
    }, [dispatch]);

    if (status === 'loading') {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2l font-bold text-gray-900">Gestion des Ordonnances</h1>
                    <p className="mt-2 text-gray-600">Consultez et gérez les ordonnances des patients</p>
                </div>

                {/* Liste des ordonnances */}
                <OrdonnanceList ordonnances={ordonnances} />
            </div>
        </div>
    );
}

export default Index; 