'use client';

import React, { createContext, ReactNode, useState } from "react";

export interface ModalsControllerProps {
    isRegisterModalActive: boolean;
    isLoginModalActive: boolean; 
};

interface GlobalEventsContextType extends ModalsControllerProps {
    setModalsController: React.Dispatch<React.SetStateAction<ModalsControllerProps>>
};

export const GlobalEventsContext = createContext<GlobalEventsContextType>({
    isRegisterModalActive: false,
    isLoginModalActive: false,
    setModalsController: () => {},
});

export const GlobalEventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [ modalsController, setModalsController ] = useState<ModalsControllerProps>({
        isRegisterModalActive: false,
        isLoginModalActive: false,
    });
    
    return (
        <GlobalEventsContext.Provider value={{ ...modalsController, setModalsController }}>
            { children }
        </GlobalEventsContext.Provider>
    )
};