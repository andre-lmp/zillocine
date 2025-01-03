import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// Busca filmes com base no genero fornecido
export const fetchMoviesByGenre = async ( genre: string, page: number = 1 ): Promise<tmdbObjProps[] | undefined> => {
    const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${token}&with_genres=${genre}&language=pt-BR&include_image_language=pt&page=${page}`);
        if ( response.ok ) {
            const fetchData = await response.json();
            return fetchData.results
        };

    } catch (error) {
        console.error(error);
        return;
    }
};