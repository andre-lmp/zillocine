'use client'

import HeaderCarousel from '@/components/headerCarousel/index';
import CategoryBar from '@/components/categoryBar/index';
import ContentCarousel from '@/components/contentCarousel/index';

import { useContext, useState } from 'react';
import { TmdbContext } from '@/components/contexts/tmdbContext/index';

export default function SeriesPage() {
    const tmdb = useContext( TmdbContext );
    const [ isPageLoaded, setIsPageLoaded ] = useState<boolean>( false );
    const [ selectedGenre, setSelectedGenre ] = useState( tmdb.serieGenres.release[0] );

    const carouselsList =  Object.keys( tmdb.serieGenres ).map(( key, index ) => (
        key !== 'allGenres' && 
            <ContentCarousel 
                key={`series-${key}`} 
                contentGenre={ tmdb.serieGenres[selectedGenre][0] } 
                contentType='serie' 
                sectionTitle={ index === 0 ? tmdb.serieGenres[ selectedGenre][1] : null } 
                pageNumber={ index + 1 }
                navigation={{ prevEl: `button-prev-${index}`, nextEl: `button-next-${index}` }}
            />
    ));

    return (
        <div className='w-full min-h-screen'>
            <HeaderCarousel isLoaded={setIsPageLoaded} currentPage='series'/>
            { isPageLoaded && <CategoryBar genresList={tmdb.serieGenres} selectGenre={setSelectedGenre}/> }

            { isPageLoaded && <div className='flex flex-col gap-y-5 pb-6'>
                { carouselsList }
            </div> }
        </div>
    );
};