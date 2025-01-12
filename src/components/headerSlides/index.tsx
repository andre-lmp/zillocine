'use server';

// Hook personalizado do TMDB com funções de busca de conteudo
import useTmdbFetch from '@/components/hooks/tmdb/index';

import React from 'react';

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from '@/components/contexts/tmdbContext/index';

import Carousel from '@/components/emblaCarousel/templates/header';

import { handlePromise } from '@/components/utils/tmdbApiData/promise/index';
import { checkAvailability } from '@/components/utils/tmdbApiData/availability';
import { getContentId } from '@/components/utils/tmdbApiData/id';

interface CarouselProps {
    currentPage: string;
};

export default async function HeaderCarousel( props: CarouselProps ) {
    
    const contentData: tmdbObjProps[] = [];
    const { 
        fetchSeriesByIdList, 
        fetchMoviesByIdList, 
        fetchReleasedMovies, 
        fetchPopularMovies,
        fetchPopularSeries        
    } = useTmdbFetch(); 

    if ( props.currentPage === 'home' ) {
        const releasedMovies = await handlePromise(fetchReleasedMovies());
        const selectedIds = await getContentId( releasedMovies );
        const movies = await fetchMoviesByIdList( selectedIds );
        const filteredContent = await checkAvailability( movies );
        contentData.push( ...filteredContent );
    };
    
    if ( props.currentPage === 'movies' ) {
        const popularMovies = await handlePromise(fetchPopularMovies());
        const selectedIds = await getContentId( popularMovies );
        const movies = await fetchMoviesByIdList( selectedIds );
        const filteredContent = await checkAvailability( movies );
        contentData.push( ...filteredContent );
    };

    if ( props.currentPage === 'series' ) {
        const popularSeries = await handlePromise(fetchPopularSeries());
        const selectedIds = await getContentId( popularSeries );
        const series = await fetchSeriesByIdList( selectedIds )
        const filteredContent = await checkAvailability( series );
        contentData.push( ...filteredContent );
    };

    return contentData.length ? (
           <Carousel contentData={contentData} currentPage={props.currentPage}/>
    ) : null
};



