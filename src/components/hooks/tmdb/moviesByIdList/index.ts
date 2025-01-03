import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import { fetchMovieById } from "../movieById";

// Busca multiplos filmes a partir de uma lista de ids
export const fetchMoviesByIdList = async ( idsList: string[] ): Promise<(tmdbObjProps | undefined)[]> => {
    return new Promise(( resolve, reject ) => {
        try {
            Promise.all(idsList.map(async ( id ) => {
                const response = await fetchMovieById( id );
                return response;
            })).then( result => {
                resolve( result );
            });
        } catch (error) {
            console.error( error );  
            reject( error ); 
        }
    });
};