import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchModelPermissions, 
    fetchUserModelPermissions, 
    assignPermissionToUser, 
    removePermissionFromUser 
} from '../../Redux/modelPermissions/modelPermissionSlice';
import { fetchAllPermissions } from '../../Redux/permissions/permissionSlice';
import { fetchUsers } from '../../Redux/users/userSlice';

const ModelPermissionManager = () => {
    const dispatch = useDispatch();
    const { items: modelPermissions, userPermissions, status, error } = useSelector(state => state.modelPermissions);
    const { items: permissions } = useSelector(state => state.permissions);
    const { items: users } = useSelector(state => state.users);
    
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedPermissionId, setSelectedPermissionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    // Charger les données initiales
    useEffect(() => {
        dispatch(fetchModelPermissions());
        dispatch(fetchAllPermissions());
        dispatch(fetchUsers());
    }, [dispatch]);
    
    // Gérer le changement d'utilisateur sélectionné
    const handleUserChange = (e) => {
        const userId = e.target.value;
        setSelectedUserId(userId);
        
        if (userId) {
            dispatch(fetchUserModelPermissions(userId));
        }
    };
    
    // Attribuer une permission à un utilisateur
    const handleAssignPermission = async () => {
        if (!selectedUserId || !selectedPermissionId) {
            setMessage('Veuillez sélectionner un utilisateur et une permission');
            return;
        }
        
        setLoading(true);
        try {
            await dispatch(assignPermissionToUser({
                userId: parseInt(selectedUserId), 
                permissionId: parseInt(selectedPermissionId)
            })).unwrap();
            
            setMessage('Permission attribuée avec succès');
            // Rafraîchir les données
            dispatch(fetchUserModelPermissions(selectedUserId));
        } catch (error) {
            setMessage(`Erreur: ${error.message || 'Une erreur est survenue'}`);
        } finally {
            setLoading(false);
        }
    };
    
    // Retirer une permission d'un utilisateur
    const handleRemovePermission = async (permissionId) => {
        if (!selectedUserId) {
            setMessage('Aucun utilisateur sélectionné');
            return;
        }
        
        setLoading(true);
        try {
            await dispatch(removePermissionFromUser({
                userId: parseInt(selectedUserId), 
                permissionId: parseInt(permissionId)
            })).unwrap();
            
            setMessage('Permission retirée avec succès');
            // Rafraîchir les données
            dispatch(fetchUserModelPermissions(selectedUserId));
        } catch (error) {
            setMessage(`Erreur: ${error.message || 'Une erreur est survenue'}`);
        } finally {
            setLoading(false);
        }
    };
    
    // Obtenir les permissions d'un utilisateur
    const getUserPermissions = (userId) => {
        return userPermissions[userId] || [];
    };
    
    // Obtenir les détails d'une permission
    const getPermissionDetails = (permissionId) => {
        return permissions.find(p => p.id === permissionId) || { name: `Permission ${permissionId}` };
    };
    
    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24">
                <h5 className="card-title mb-0">Gestionnaire de Permissions Directes</h5>
            </div>
            <div className="card-body p-24">
                {status === 'loading' && <div className="text-center">Chargement...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                
                {message && (
                    <div className={`alert ${message.includes('Erreur') ? 'alert-danger' : 'alert-success'} mb-3`}>
                        {message}
                        <button 
                            type="button" 
                            className="btn-close float-end" 
                            onClick={() => setMessage('')}
                        ></button>
                    </div>
                )}
                
                <div className="row mb-4">
                    <div className="col-md-6">
                        <label className="form-label">Sélectionner un utilisateur:</label>
                        <select 
                            className="form-select" 
                            value={selectedUserId} 
                            onChange={handleUserChange}
                        >
                            <option value="">-- Sélectionner un utilisateur --</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {selectedUserId && (
                        <div className="col-md-6">
                            <label className="form-label">Ajouter une permission:</label>
                            <div className="input-group">
                                <select 
                                    className="form-select" 
                                    value={selectedPermissionId} 
                                    onChange={(e) => setSelectedPermissionId(e.target.value)}
                                >
                                    <option value="">-- Sélectionner une permission --</option>
                                    {permissions.map(permission => (
                                        // Ne pas montrer les permissions déjà attribuées
                                        !getUserPermissions(selectedUserId).includes(permission.id) && (
                                            <option key={permission.id} value={permission.id}>
                                                {permission.name}
                                            </option>
                                        )
                                    ))}
                                </select>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleAssignPermission}
                                    disabled={loading || !selectedPermissionId}
                                >
                                    {loading ? 'En cours...' : 'Ajouter'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {selectedUserId && (
                    <div className="mt-4">
                        <h6>Permissions directes de l'utilisateur:</h6>
                        {getUserPermissions(selectedUserId).length === 0 ? (
                            <p className="text-muted">Aucune permission directe attribuée</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nom de la permission</th>
                                            <th width="100">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getUserPermissions(selectedUserId).map(permissionId => (
                                            <tr key={permissionId}>
                                                <td>{permissionId}</td>
                                                <td>{getPermissionDetails(permissionId).name}</td>
                                                <td>
                                                    <button 
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleRemovePermission(permissionId)}
                                                        disabled={loading}
                                                    >
                                                        Retirer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                
                <div className="mt-4">
                    <h6>Toutes les attributions de permissions:</h6>
                    {modelPermissions.length === 0 ? (
                        <p className="text-muted">Aucune attribution de permission trouvée</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>ID Permission</th>
                                        <th>Nom Permission</th>
                                        <th>Type de modèle</th>
                                        <th>ID du modèle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modelPermissions.map((mp, index) => (
                                        <tr key={index}>
                                            <td>{mp.permission_id}</td>
                                            <td>{getPermissionDetails(mp.permission_id).name}</td>
                                            <td>{mp.model_type}</td>
                                            <td>{mp.model_id}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModelPermissionManager; 