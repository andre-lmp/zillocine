import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// busca as temporadas de uma serie com base no id da serie e numero da temporada
export const fetchSeasons = async ( serieId: string, seasonNumber: string ): Promise<tmdbObjProps[] | undefined> => {
    const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${serieId}/season/${seasonNumber}?api_key=${token}&language=pt-BR&include_image_language=pt`);
        if ( response.ok ) {
            const fetchData = await response.json();
            return fetchData;
        };
    } catch ( error ) {
        console.error( error );
    };
};