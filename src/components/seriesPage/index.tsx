'use client'

// Carouseis de conteudo
import HeaderCarousel from '@/components/headerCarousel/index';
import ContentCarousel from '@/components/contentCarousel/index';

// Barra com categorias de conteudo
import CategoryBar from '@/components/categoryBar/index';

// Hooks
import { useContext, useState } from 'react';

// Contextos
import { TmdbContext } from '@/components/contexts/tmdbContext/index';

export default function SeriesPage() {

    const tmdb = useContext( TmdbContext );
    const [ isPageLoaded, setIsPageLoaded ] = useState<boolean>( false );
    const [ selectedGenre, setSelectedGenre ] = useState( tmdb.serieGenres.release[0] );

    // Gera um carousel de slides para cada genero dentro do contexto
    const carouselsList =  Object.keys( tmdb.serieGenres ).map(( key, index ) => (
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