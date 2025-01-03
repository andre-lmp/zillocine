import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// busca filmes populares entre os usuarios do TMDB
export const fetchPopularMovies = async (): Promise<tmdbObjProps[] | undefined> => {
    const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?&api_key=${token}&include_adult&include_video&language=pt-BR&page=1&sort_by=popularity.desc&include_image_language=pt`);
        if ( response.ok ) {
            const fetchData = await response.json();
            return fetchData.results
        };
    } catch (error) {
        console.error( error );
    };
};