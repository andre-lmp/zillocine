import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// busca filmes similares ao escolhido pelo usuario
export const fetchSimilarMovies = async ( movieId: string ): Promise<tmdbObjProps[] | undefined> => {
    const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${token}&language=pt-BR&page=1&include_image_language=pt`);  
        
        if ( response.ok ) {
            const fetchData = await response.json();
            return fetchData.results
        };
    } catch (error) {
        console.error(error);
    };
};