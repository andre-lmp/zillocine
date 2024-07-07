import { createContext} from "react";

export const TmdbContext = createContext();

export const TmdbProvider = ({children}) => {
    const apiKey = 'e1534e69b483f2e9d62ea1c394850e4e';

    return(
        <TmdbContext.Provider value={{token: apiKey}}>
            {children}
        </TmdbContext.Provider>
    );
};