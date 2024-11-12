'use client';

import React, { createContext, ReactNode, useState } from "react";

export interface ModalsControllerProps {
    isRegisterModalActive: boolean;
    isLoginModalActive: boolean; 
    isProfileModalActive: boolean,
    loginErrorMessage: null | string;
    registerErrorMessage: null | string;
    formInstructionsMessage: null | string;
    googleAuthErrorMessage: null | string;
    githubAuthErrorMessage: null | string;
    isProfilePhotoUpdating: boolean;
    verificationErrorMessage: null | string;
    isUserCreatingAnAccount: boolean;
    isUserLoggingIntoAccount: boolean;
    clicksCount: number;
};

interface GlobalEventsContextType extends ModalsControllerProps {
    setModalsController: React.Dispatch<React.SetStateAction<ModalsControllerProps>>
};

export const GlobalEventsContext = createContext<GlobalEventsContextType>({
    isRegisterModalActive: false,
    isLoginModalActive: false,
    isProfileModalActive: false,
    loginErrorMessage: null,
    registerErrorMessage: null,
    formInstructionsMessage: null,
    googleAuthErrorMessage: null,
    githubAuthErrorMessage: null,
    isProfilePhotoUpdating: false,
    verificationErrorMessage: null,
    isUserCreatingAnAccount: false,
    isUserLoggingIntoAccount: false,
    clicksCount: 0,
    setModalsController: () => {}
});

export const GlobalEventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [ modalsController, setModalsController ] = useState<ModalsControllerProps>({
        isRegisterModalActive: false,
        isLoginModalActive: false,
        isProfileModalActive: false,
        loginErrorMessage: null,
        registerErrorMessage: null,
        formInstructionsMessage: null,
        googleAuthErrorMessage: null,
        githubAuthErrorMessage: null,
        isProfilePhotoUpdating: false,
        verificationErrorMessage: null,
        isUserLoggingIntoAccount: false,
        isUserCreatingAnAccount: false,
        clicksCount: 0
    });
    
    return (
        <GlobalEventsContext.Provider value={{ ...modalsController, setModalsController }}>
            { children }
        </GlobalEventsContext.Provider>
    )
};