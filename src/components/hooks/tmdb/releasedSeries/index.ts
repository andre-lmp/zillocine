import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// busca series lançamentos com base na data fornecida
export const fetchReleasedSeries = async ( page: number = 1 ): Promise<tmdbObjProps[] | undefined> => {
    const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const newDate = new Date().toISOString().split('T')[0];

    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${token}&include_adult=false&language=pt-BRS&sort_by=popularity.desc&air_date.lte={max_date}&air_date.gte=${newDate}&include_image_language=pt&page=${page}`);
        if ( response.ok ) {
            const fetchData = await response.json();
            return fetchData.results;
        };
    } catch (error) {
        console.error(error);
    };
};