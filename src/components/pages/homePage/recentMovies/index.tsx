import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import DefaultCarousel from "@/components/emblaCarousel/templates/default";

import useTmdbFetch from "@/components/hooks/tmdb";

export default async function ReleaseCarousel() {

    const movies: tmdbObjProps[] = [];
    const { fetchReleasedMovies } = useTmdbFetch();

    const response = await fetchReleasedMovies();
    response && movies.push( ...response );

    return movies.length ? ( 
        <DefaultCarousel contentData={movies} contentType="movie"/>
    ) : null;
};