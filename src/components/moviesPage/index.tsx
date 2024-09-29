'use client'

import HeaderCarousel from '@/components/headerCarousel/index';
import CategoryBar from '@/components/categoryBar/index';
import ContentCarousel from '@/components/contentCarousel/index';

import { useContext, useState } from 'react';
import { TmdbContext } from '@/components/contexts/tmdbContext/index';

export default function MoviesPage() {
    const tmdb = useContext( TmdbContext );
    const [ isPageLoaded, setIsPageLoaded ] = useState<boolean>( false )
    const [ selectedGenre, setSelectedGenre ] = useState( tmdb.movieGenres.release[0] );

    const carouselsList =  Object.keys( tmdb.movieGenres ).map(( key, index ) => (
        key !== 'allGenres' && <ContentCarousel key={`movies-${key}`} contentGenre={ tmdb.movieGenres[selectedGenre][0] } contentType='movie' sectionTitle={ index === 0 ? tmdb.movieGenres[ selectedGenre][1] : null } pageNumber={ index + 1 }/>
    ));

    return (
        <div className='w-full min-h-dvh'>
            <HeaderCarousel isLoaded={setIsPageLoaded} currentPage='movies'/>
            { isPageLoaded && <CategoryBar genresList={tmdb.movieGenres} selectGenre={setSelectedGenre}/> }

            { isPageLoaded && <div className='flex flex-col gap-y-5 pb-6'>
                { carouselsList }
            </div> }
        </div>
    );
};