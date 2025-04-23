import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from '@inertiajs/react';
import ChatMessageLayer from './ChatMessageLayer';
import ChatProfileLayer from './ChatProfileLayer';
import { setChatOpen, resetUnreadMessages } from '../../../Redux/chat/chatSlice';

const ChatMainLayer = () => {
    const dispatch = useDispatch();
    const [showMessages, setShowMessages] = useState(true);
    const { unreadMessages, isOpen } = useSelector(state => state.chat);

    const toggleChat = () => {
        const newState = !isOpen;
        dispatch(setChatOpen(newState));
        if (newState) {
            setShowMessages(true);
            dispatch(resetUnreadMessages());
        }
    };

    const toggleView = () => {
        setShowMessages(!showMessages);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Button */}
            <button 
                onClick={toggleChat} 
                className="relative bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        {unreadMessages > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadMessages}
                            </span>
                        )}
                    </>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-96 h-96 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-semibold">Messages</h3>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={toggleView}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    {showMessages ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    )}
                                </button>
                                <Link
                                    href={route('chat.view')}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto">
                            {showMessages ? (
                                <div className="h-full">
                                    <ChatMessageLayer isMinimized={true} />
                                </div>
                            ) : (
                                <div className="h-full">
                                    <ChatProfileLayer isMinimized={true} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatMainLayer; 