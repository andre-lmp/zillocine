import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// busca series com base em palavras chaves
export const fetchSerieByTerm = async ( term: string ): Promise<tmdbObjProps[] | undefined> => {
    const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    try{
        const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${token}&language=pt-BR&include_image_language=pt&query=${term}`);
        
        if (response.ok) {
            const fetchData = await response.json();
            return fetchData.results;
        };
    } catch (error) {
        console.error(error);
    };
};