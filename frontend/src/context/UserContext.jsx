//Context a felhasználó adataihoz

import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'
import logClientError from '../utils/logError';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [checked, setChecked] = useState(false);

    const baseURL = import.meta.env.VITE_API_URL;

    const loadUser = async () => {
        try {
            const response = await axios.get(baseURL + '/get-user-data', {
                withCredentials: true,
                withXSRFToken: true
            })
            setUser(response.data.user || null)
        }catch(error) {
            setUser(null);
            logClientError(error);
        }finally {
            setChecked(true);
        }
    }

    //Session ellenőrzés
    const refreshUser = async () => {
        try {
            const response = await axios.get(baseURL + '/get-user-data', {
                withCredentials: true,
                withXSRFToken: true
            })
            setUser(response.data.user || null)
        }catch(error) {
            setUser(null);
            logClientError(error);
        }finally {
            setChecked(true);
        }
    }

    //Login status ellenőrzése
    useEffect(() => {
        loadUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, checked, setChecked, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);