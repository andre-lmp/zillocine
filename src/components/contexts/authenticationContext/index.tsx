'use client';

import React, { createContext, Dispatch, ReactNode, useState } from "react";

interface UserDataProps {
    isLoogedIn: boolean;
    name: null | string;
    email: null | string;
    photoUrl: null | string;
    uid: null | string;
};

interface ContextProps extends UserDataProps {
    setUserData: Dispatch<React.SetStateAction<UserDataProps>>;
};

export const UserDataContext = createContext<ContextProps>({
    isLoogedIn: false,
    name: null,
    email: null,
    photoUrl: null,
    uid: null,
    setUserData: () => {}
});

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [ userData, setUserData ] = useState<UserDataProps>({
        isLoogedIn: false,
        name: null,
        email: null,
        photoUrl: null,
        uid: null
    });

    return (
        <UserDataContext.Provider value={{ ...userData, setUserData }}>
            { children }
        </UserDataContext.Provider>
    )
};