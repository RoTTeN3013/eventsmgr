//Context a felhasználó adataihoz

import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [checked, setChecked] = useState(false);

    const loadUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/get-user-data', {
                withCredentials: true,
                withXSRFToken: true
            })
            setUser(response.data.user || null)
        }catch {
            setUser(null);
        }finally {
            setChecked(true);
        }
    }

    //Session ellenőrzés
    const refreshUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/get-user-data', {
                withCredentials: true,
                withXSRFToken: true
            })
            setUser(response.data.user || null)
        }catch {
            setUser(null);
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