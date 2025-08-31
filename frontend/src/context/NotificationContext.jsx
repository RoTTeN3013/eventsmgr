//Context a felhasználó adataihoz

import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [message, setMessage] = useState(null);
    const [status, setStatus] = useState('');

    const showNotification = (msg) => {
        setMessage(msg);
        setStatus('show');
        setTimeout(() => {
            setMessage(null);
            setStatus('');
        },
        5000); 
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {message && (
            <div className={`${status} d-flex align-items-end notification-box flex-column gap-2`}>
                {Array.isArray(message) ? (
                    message.map((msg, index) => (
                    <div key={index} className="d-flex justify-content-center align-items-center notification_container">
                        <p className="text-white fs-6 p-0 m-0">
                            <i className="fa fa-circle-info"></i> {msg}
                        </p>
                    </div>
                    ))
                ) : typeof message === "object" ? (
                    Object.values(message).map((msg, index) => (
                        <div key={index} className="d-flex justify-content-center align-items-center notification_container">
                            <p className="text-white fs-6 p-0 m-0">
                                <i className="fa fa-circle-info"></i> {msg}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="d-flex justify-content-center align-items-center notification_container">
                        <p className="text-white fs-6 p-0 m-0">
                            <i className="fa fa-circle-info"></i> {message}
                        </p>
                    </div>
                )}
            </div>
        )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);