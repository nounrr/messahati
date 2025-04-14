import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createMessages } from '../../../Redux/messages/messageSlice';
import { fetchUsers } from '../../../Redux/users/userSlice';
import { X } from 'lucide-react';

function Message({ onClose }) {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.users);
    const [messages, setMessages] = useState([{
        expediteur_id: '',
        destinataire_id: '',
        sujet: '',
        contenu: '',
        statut: 'non_lu'
    }]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleAddField = () => {
        setMessages([...messages, {
            expediteur_id: '',
            destinataire_id: '',
            sujet: '',
            contenu: '',
            statut: 'non_lu'
        }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...messages];
        updated[index][field] = value;
        setMessages(updated);
    };

    const handleRemoveField = (index) => {
        const updated = [...messages];
        updated.splice(index, 1);
        setMessages(updated);
    };

    const handleSubmit = () => {
        const isValid = messages.every(message => 
            message.expediteur_id !== '' && 
            message.destinataire_id !== '' &&
            message.sujet !== '' &&
            message.contenu !== ''
        );

        if (!isValid) {
            Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        dispatch(createMessages(messages))
            .unwrap()
            .then(() => {
                Swal.fire('Succès', 'Messages envoyés avec succès.', 'success');
                setMessages([{
                    expediteur_id: '',
                    destinataire_id: '',
                    sujet: '',
                    contenu: '',
                    statut: 'non_lu'
                }]);
                onClose();
            })
            .catch((error) => {
                console.error('Erreur:', error);
                Swal.fire('Erreur', 'Une erreur s\'est produite.', 'error');
            });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
                <X size={22} />
            </button>
            <div className='text-center mb-6'>
                <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-4 w-28 h-auto' />
                <h4 className='text-2xl font-semibold mb-1'>Envoyez des Messages</h4>
                <h6 className='text-gray-500 text-md'>Veuillez fournir les informations suivantes :</h6>
            </div>

            {messages.map((message, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative">
                    {messages.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveField(index)}
                        >
                            <X size={18} />
                        </button>
                    )}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expéditeur</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={message.expediteur_id}
                            onChange={(e) => handleChange(index, 'expediteur_id', e.target.value)}
                        >
                            <option value="">Sélectionnez l'expéditeur</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Destinataire</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={message.destinataire_id}
                            onChange={(e) => handleChange(index, 'destinataire_id', e.target.value)}
                        >
                            <option value="">Sélectionnez le destinataire</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                        <input
                            type="text"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={message.sujet}
                            onChange={(e) => handleChange(index, 'sujet', e.target.value)}
                            placeholder='Entrez le sujet du message'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                        <textarea
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={message.contenu}
                            onChange={(e) => handleChange(index, 'contenu', e.target.value)}
                            placeholder='Entrez le contenu du message'
                            rows='4'
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <select
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={message.statut}
                            onChange={(e) => handleChange(index, 'statut', e.target.value)}
                        >
                            <option value="non_lu">Non lu</option>
                            <option value="lu">Lu</option>
                        </select>
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    className='bg-green-600 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleAddField}
                >
                    Ajouter un autre message
                </button>
                <button
                    className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition'
                    onClick={handleSubmit}
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
}

export default Message; 