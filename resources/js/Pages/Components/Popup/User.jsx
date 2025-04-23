import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createUsers, updateUsers, fetchUsers } from '../../../Redux/users/userSlice';
import { fetchDepartements } from '../../../Redux/departements/departementSlice';
import { fetchAllRoles } from '../../../Redux/roles/roleSlice';
import { X } from 'lucide-react';

function User({ onClose, user = null }) {
    const dispatch = useDispatch();
    const departements = useSelector((state) => state.departements.items);
    const roles = useSelector((state) => state.roles.items);
    const [users, setUsers] = useState([{
        name: '',
        prenom: '',
        cin: '',
        email: '',
        telephone: '',
        adresse: '',
        departement_id: '',
        role: 'user',
        status: 'actif',
        password: '',
        password_confirmation: ''
    }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load départements and roles on component mount
    useEffect(() => {
        dispatch(fetchDepartements());
        dispatch(fetchAllRoles());
    }, [dispatch]);

    // Initialize data if in edit mode
    useEffect(() => {
        if (user) {
            setUsers([{
                id: user.id,
                name: user.name || '',
                prenom: user.prenom || '',
                cin: user.cin || '',
                email: user.email || '',
                telephone: user.telephone || '',
                adresse: user.adresse || '',
                departement_id: user.departement_id || '',
                role: user.role || 'user',
                status: user.status || 'actif',
                password: '',
                password_confirmation: ''
            }]);
        }
    }, [user]);

    const handleAddField = () => {
        setUsers([...users, {
            name: '',
            prenom: '',
            cin: '',
            email: '',
            telephone: '',
            adresse: '',
            departement_id: '',
            role: 'user',
            status: 'actif',
            password: '',
            password_confirmation: ''
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...users];
        updated[index][field] = value;
        setUsers(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...users];
        updated.splice(index, 1);
        setUsers(updated);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        
        // Validate form
        const isValid = users.every(user => 
            user.name.trim() !== '' && 
            user.email.trim() !== '' && 
            (user.id || (user.password.trim() !== '' && user.password === user.password_confirmation))
        );
        
        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs requis correctement.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            if (user) {
                // Edit mode - remove password fields if empty
                const userData = {...users[0]};
                if (!userData.password) {
                    delete userData.password;
                    delete userData.password_confirmation;
                }
                
                await dispatch(updateUsers([userData])).unwrap();
                
                // Refresh data after update
                await dispatch(fetchUsers());
                
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'L\'utilisateur a été modifié avec succès.'
                });
            } else {
                // Creation mode
                await dispatch(createUsers(users)).unwrap();
                
                // Refresh data after creation
                await dispatch(fetchUsers());
                
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: 'Les utilisateurs ont été créés avec succès.'
                });
            }
            
            // Close modal after a short delay
            setTimeout(() => {
                onClose();
            }, 500);
        } catch (error) {
            console.error('Erreur lors de l\'opération:', error);
            
            // Display detailed error message
            let errorMessage = 'Une erreur est survenue lors de l\'opération.';
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Erreur !',
                text: errorMessage
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <button 
                onClick={onClose} 
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                disabled={isSubmitting}
            >
                <X size={22} />
            </button>
            <div className='text-center mb-6'>
                <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-4 w-28 h-auto' />
                <h4 className='text-2xl font-semibold mb-1'>
                    {user ? 'Modifier l\'utilisateur' : 'Ajouter des utilisateurs'}
                </h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {users.map((userData, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {users.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                            disabled={isSubmitting}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input
                                type='text'
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Nom'
                                value={userData.name}
                                onChange={(e) => handleChange(index, 'name', e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                            <input
                                type='text'
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Prénom'
                                value={userData.prenom}
                                onChange={(e) => handleChange(index, 'prenom', e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">CIN</label>
                            <input
                                type='text'
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='CIN'
                                value={userData.cin}
                                onChange={(e) => handleChange(index, 'cin', e.target.value)}
                                required
                                disabled={isSubmitting || user}
                            />
                        </div>
                        
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type='email'
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Email'
                                value={userData.email}
                                onChange={(e) => handleChange(index, 'email', e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                            <input
                                type='text'
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Téléphone'
                                value={userData.telephone}
                                onChange={(e) => handleChange(index, 'telephone', e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                            <input
                                type='text'
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Adresse'
                                value={userData.adresse}
                                onChange={(e) => handleChange(index, 'adresse', e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                            <select
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={userData.departement_id}
                                onChange={(e) => handleChange(index, 'departement_id', e.target.value)}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">Sélectionner un département</option>
                                {departements && departements.length > 0 ? (
                                    departements.map(departement => (
                                        <option key={departement.id} value={departement.id}>
                                            {departement.nom}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>Aucun département disponible</option>
                                )}
                            </select>
                        </div>
                        
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                            <select
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={userData.role}
                                onChange={(e) => handleChange(index, 'role', e.target.value)}
                                disabled={isSubmitting}
                            >
                                <option value="">Sélectionner un rôle</option>
                                {roles && roles.length > 0 ? (
                                    roles.map(role => (
                                        <option key={role.id} value={role.name}>
                                            {role.name}
                                        </option>
                                    ))
                                ) : (
                                    <>
                                        <option value="user">Utilisateur</option>
                                        <option value="admin">Administrateur</option>
                                        <option value="manager">Manager</option>
                                    </>
                                )}
                            </select>
                        </div>
                        
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                            <select
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={userData.status}
                                onChange={(e) => handleChange(index, 'status', e.target.value)}
                                disabled={isSubmitting}
                            >
                                <option value="actif">Actif</option>
                                <option value="inactif">Inactif</option>
                                <option value="congé">Congé</option>
                                <option value="absent">Absent</option>
                            </select>
                        </div>
                        
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {user ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
                            </label>
                            <input
                                type='password'
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Mot de passe'
                                value={userData.password}
                                onChange={(e) => handleChange(index, 'password', e.target.value)}
                                required={!user}
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation du mot de passe</label>
                            <input
                                type='password'
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Confirmation du mot de passe'
                                value={userData.password_confirmation}
                                onChange={(e) => handleChange(index, 'password_confirmation', e.target.value)}
                                required={!user}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                {!user && (
                    <button
                        className='bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition'
                        onClick={handleAddField}
                        disabled={isSubmitting}
                    >
                        Ajouter un autre utilisateur
                    </button>
                )}
                <button
                    className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Traitement en cours...' : (user ? 'Modifier' : 'Enregistrer')}
                </button>
            </div>
        </div>
    );
}

export default User; 