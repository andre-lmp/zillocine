import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// busca series populares entre os usuarios do TMDB
export const fetchPopularSeries = async (): Promise<tmdbObjProps[] | undefined> => {
    const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    try{
        const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${token}&include_adult=false&language=pt-BR&include_image_language=pt&page=1&sort_by=vote_average.desc&vote_count.gte=200`);
        if ( response.ok ){
            const fetchData = await response.json();
            return fetchData.results;
        }

    } catch (error){
        console.error(error);
    };
};