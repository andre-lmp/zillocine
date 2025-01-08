import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// Filtra e seleciona somente o filme/serie que possuir imagens disponiveis
export const checkAvailability = async ( data: tmdbObjProps[] | undefined | (tmdbObjProps | undefined)[] ) => {
    if ( !data ) {
        return [];
    };

    const filteredContent: tmdbObjProps[] = await new Promise( resolve => {
        const filtered = data.filter( item => item && ( item.poster_path || item.backdrop_path ));
        resolve( filtered as tmdbObjProps[] );
    });

    return filteredContent;
};