import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// Busca series com base no genero fornecido
export const fetchSeriesByGenre = async ( genre: string, page: number = 1 ): Promise<tmdbObjProps[] | undefined> => {
    const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${token}&language=pt-BR&with_genres=${genre}&page=${page}&include_image_language=pt`);
        
        if ( response.ok ) {
            const fetchData = await response.json();
            return fetchData.results;
        };
    } catch (error) {
        console.error(error);
    };
};