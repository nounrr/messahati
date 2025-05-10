import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/Redux/users/userSlice';
import { fetchAllPermissions } from '@/Redux/permissions/permissionSlice';
import { fetchAllRoles } from '@/Redux/roles/roleSlice';

export default function Dashboard() {
    const dispatch = useDispatch();
    const { items: users, status: usersStatus, error: usersError } = useSelector((state) => state.users);
    const { items: allPermissions, status: permissionsStatus, error: permissionsError } = useSelector((state) => state.permissions);
    const { items: allRoles, status: rolesStatus, error: rolesError } = useSelector((state) => state.roles);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    
    // Charger les utilisateurs, les rôles et les permissions au chargement du composant
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            
            // Charger les utilisateurs, les rôles et toutes les permissions
            await Promise.all([
                dispatch(fetchUsers()),
                dispatch(fetchAllPermissions()),
                dispatch(fetchAllRoles())
            ]);
            
            setIsLoading(false);
        };
        
        loadData();
    }, [dispatch]);
    
    // Sélectionner un utilisateur pour voir ses détails
    const handleSelectUser = (user) => {
        setSelectedUser(selectedUser?.id === user.id ? null : user);
    };
    
    // Gérer les erreurs
    const error = usersError || permissionsError || rolesError;
    
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {isLoading && <p>Chargement des données...</p>}
                            
                            {!isLoading && error && (
                                <div className="text-red-500">
                                    <p>Erreur lors du chargement des données: {error}</p>
                                </div>
                            )}
                            
                            {!isLoading && !error && (
                                <div>
                                    <p>Vous êtes connecté!</p>
                                    
                                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
                                            <h3 className="mb-3 text-lg font-semibold">Utilisateurs</h3>
                                            <p className="text-xl font-bold text-blue-600">{users.length}</p>
                                            <p className="text-sm text-gray-500">Total des utilisateurs</p>
                                        </div>
                                        
                                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
                                            <h3 className="mb-3 text-lg font-semibold">Permissions</h3>
                                            <p className="text-xl font-bold text-purple-600">{allPermissions.length}</p>
                                            <p className="text-sm text-gray-500">Total des permissions disponibles</p>
                                        </div>
                                        
                                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
                                            <h3 className="mb-3 text-lg font-semibold">Rôles</h3>
                                            <p className="text-xl font-bold text-green-600">{allRoles.length}</p>
                                            <p className="text-sm text-gray-500">Total des rôles disponibles</p>
                                        </div>
                                    </div>
                                    
                                    {/* Liste des utilisateurs */}
                                    <div className="mt-8">
                                        <h3 className="mb-4 text-lg font-semibold">Liste des utilisateurs et leurs permissions</h3>
                                        
                                        <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
                                            {users.map(user => (
                                                <div 
                                                    key={user.id}
                                                    className={`p-4 transition-colors ${
                                                        selectedUser?.id === user.id 
                                                            ? 'bg-blue-50' 
                                                            : 'hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div 
                                                        className="flex cursor-pointer items-center justify-between"
                                                        onClick={() => handleSelectUser(user)}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                                                                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">{user.name} {user.prenom}</h4>
                                                                <p className="text-sm text-gray-500">{user.email}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        {user.role && (
                                                            <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                                                {user.role}
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Afficher les permissions quand l'utilisateur est sélectionné */}
                                                    {selectedUser?.id === user.id && (
                                                        <div className="mt-4 border-t border-dashed border-gray-200 pt-4">
                                                            <h5 className="mb-2 text-sm font-semibold text-gray-700">Permissions:</h5>
                                                            
                                                            <div className="flex flex-wrap gap-2">
                                                                {user.permissions && user.permissions.length > 0 ? (
                                                                    user.permissions.map((permission, index) => (
                                                                        <span 
                                                                            key={index}
                                                                            className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800"
                                                                        >
                                                                            {permission.name || permission}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-sm text-gray-500">Aucune permission spécifique</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Liste des permissions disponibles */}
                                    {allPermissions.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="mb-4 text-lg font-semibold">Toutes les permissions disponibles</h3>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                {allPermissions.map((permission, index) => (
                                                    <span 
                                                        key={index}
                                                        className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"
                                                    >
                                                        {permission.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Liste des rôles disponibles */}
                                    {allRoles.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="mb-4 text-lg font-semibold">Tous les rôles disponibles</h3>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                {allRoles.map((role, index) => (
                                                    <span 
                                                        key={index}
                                                        className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                                                    >
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
