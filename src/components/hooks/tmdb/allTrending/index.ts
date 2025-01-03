import { tmdbObjProps } from "@/components/contexts/tmdbContext";

export const fetchAllTrending = async (): Promise<tmdbObjProps[] | undefined> => {
    const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${token}&language=pt-BR`);
        if ( response.ok ) {
            const data = await response.json();
            return data.results;
        };
    } catch (error) {
        console.error( 'Erro ao buscar conteudo em alta' + error );  
    };
};