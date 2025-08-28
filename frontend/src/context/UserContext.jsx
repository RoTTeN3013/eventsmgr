//Context a felhasználó adataihoz

import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [checked, setChecked] = useState(false);

    //Login status ellenőrzése
    useEffect(() => {
        axios.get('http://localhost:8000/api/get-user-data', {
            withCredentials: true,
            withXSRFToken: true
        })
        .then(res => {
            if (res.data) setUser(res.data.user); 
        })
        .catch(() => setUser(null))
        .finally(() => setChecked(true));
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, checked, setChecked }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);