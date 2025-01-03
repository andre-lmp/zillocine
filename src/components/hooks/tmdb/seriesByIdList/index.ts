import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import { fetchSeriebyId } from "../serieById";

// Busca multiplas series a partir de uma lista de ids
export const fetchSeriesByIdList = async ( idsList: string[] ): Promise<(tmdbObjProps | undefined)[]> => {
    return new Promise(( resolve, reject ) => {
        try {
            Promise.all(idsList.map(async ( id ) => {
                const response = await fetchSeriebyId( id );
                return response;
            })).then( result => {
                resolve( result );
            });
        } catch (error) {
            console.error( error );  
            reject( error ); 
        };
    });
};