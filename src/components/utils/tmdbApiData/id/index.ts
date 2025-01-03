import { tmdbObjProps } from "@/components/contexts/tmdbContext";

/*Seleciona os primeiros 7 ids de filmes/series*/
export const getContentId = async ( data: tmdbObjProps[] | undefined ) => {
    if ( !data ) {
        return [];
    };

    const selectedIds: string[] = await new Promise( resolve => {
        const idsList = [];
        for ( let i = 0; i <= 7; i++ ) {
            idsList.push( data[i].id );
        };
        resolve( idsList );
    });

    return selectedIds;
};