import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// faz uma busca mais detalhada de uma serie com o id fornecido
export const fetchSeriebyId = async ( serieId: string ): Promise<tmdbObjProps | undefined> => {
    const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${serieId}?api_key=${token}&language=pt-BR&page=1&include_image_language=pt&append_to_response=videos,credits`);
        
        if ( response.ok ) {
            const fetchData = await response.json();
            return fetchData;
        };
    } catch (error) {
        console.log(error);
    };
};