'use client';

import React, { createContext, ReactNode, useState } from "react";

export interface ModalsControllerProps {
    isRegisterModalActive: boolean;
    isLoginModalActive: boolean; 
    loginErrorMessage: null | string;
    registerErrorMessage: null,
    formInstructionsMessage: null | string;
    googleAuthErrorMessage: null,
    githubAuthErrorMessage: null,
};

interface GlobalEventsContextType extends ModalsControllerProps {
    setModalsController: React.Dispatch<React.SetStateAction<ModalsControllerProps>>
};

export const GlobalEventsContext = createContext<GlobalEventsContextType>({
    isRegisterModalActive: false,
    isLoginModalActive: false,
    loginErrorMessage: null,
    registerErrorMessage: null,
    formInstructionsMessage: null,
    googleAuthErrorMessage: null,
    githubAuthErrorMessage: null,
    setModalsController: () => {}
});

export const GlobalEventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [ modalsController, setModalsController ] = useState<ModalsControllerProps>({
        isRegisterModalActive: false,
        isLoginModalActive: false,
        loginErrorMessage: null,
        registerErrorMessage: null,
        formInstructionsMessage: null,
        googleAuthErrorMessage: null,
        githubAuthErrorMessage: null,
    });
    
    return (
        <GlobalEventsContext.Provider value={{ ...modalsController, setModalsController }}>
            { children }
        </GlobalEventsContext.Provider>
    )
};