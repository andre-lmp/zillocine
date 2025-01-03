import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import TopSeriesCarousel from "@/components/emblaCarousel/templates/popular";

import useTmdbFetch from "@/components/hooks/tmdb";

import { getContentId } from "@/components/utils/tmdbApiData/id";

export default async function PopularCarousel() {

    const movies: tmdbObjProps[] = [];
    const { fetchPopularSeries, fetchSeriesByIdList } = useTmdbFetch();

    const popularSeries = await fetchPopularSeries();
    const idList = await getContentId( popularSeries );
    const series = await fetchSeriesByIdList( idList );
    series && movies.push( ...series );

    return movies.length ? ( 
        <TopSeriesCarousel contentData={movies}/>
    ) : null;
};