import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import TopSeriesCarousel from "@/components/emblaCarousel/templates/popular";

import useTmdbFetch from "@/components/hooks/tmdb";
import { checkAvailability } from "@/components/utils/tmdbApiData/availability";

import { getContentId } from "@/components/utils/tmdbApiData/id";

export default async function PopularCarousel() {

    const seriesList: tmdbObjProps[] = [];
    const { fetchPopularSeries, fetchSeriesByIdList } = useTmdbFetch();

    const popularSeries = await fetchPopularSeries();
    const idList = await getContentId( popularSeries );
    const series = await fetchSeriesByIdList( idList );
    const filtered = await checkAvailability( series );
    seriesList.push( ...filtered );

    return seriesList.length ? ( 
        <TopSeriesCarousel contentData={seriesList}/>
    ) : null;
};