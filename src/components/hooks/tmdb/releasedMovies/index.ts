import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// busca filmes lançamentos com base na data fornecida
export const fetchReleasedMovies = async ( page: number = 1 ): Promise<tmdbObjProps[] | undefined> => {
    const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const newDate = new Date().toISOString().split('T')[0];

    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${token}&primary_release_date.gte=${newDate}&sort=primary_release_date.desc&language=pt-BR&include_image_language=pt&page=${page}`);
        if ( response.ok ) {
            const fetchData = await response.json();
            return fetchData.results;
        }
    } catch (error) {
        console.error(error);
    };
};