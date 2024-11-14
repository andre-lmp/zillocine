'use client';

import React, { createContext, Dispatch, ReactNode, useState } from "react";

interface UserDataProps {
    isLoggedIn: boolean;
    name: null | string;
    email: null | string;
    photoUrl: null | string;
    favoriteMovies: null | string[];
    favoriteSeries: null | string[];
    uid: null | string;
};

interface ContextProps extends UserDataProps {
    setUserData: Dispatch<React.SetStateAction<UserDataProps>>;
};

export const UserDataContext = createContext<ContextProps>({
    isLoggedIn: false,
    name: null,
    email: null,
    photoUrl: null,
    favoriteMovies: null,
    favoriteSeries: null,
    uid: null,
    setUserData: () => {}
});

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [ userData, setUserData ] = useState<UserDataProps>({
        isLoggedIn: false,
        name: null,
        email: null,
        photoUrl: null,
        favoriteMovies: null,
        favoriteSeries: null,
        uid: null
    });

    return (
        <UserDataContext.Provider value={{ ...userData, setUserData }}>
            { children }
        </UserDataContext.Provider>
    )
};