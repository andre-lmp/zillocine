'use client';

import ContentCarousel from '@/components/contentCarousel';
// Barra com alguns generos de filmes/series
import CategoryBar from '@/components/categoryBar';

import { useContext, useState, Suspense } from 'react';

import { TmdbContext } from '@/components/contexts/tmdbContext';

export default function SeriesCarousel() {

    const tmdb = useContext( TmdbContext );
    const [ selectedGenre, setSelectedGenre ] = useState( tmdb.serieGenres.release[0] );

    // Gera um carousel de slides para cada genero dentro do contexto
    const carouselsList =  Object.keys( tmdb.serieGenres ).map(( key, index ) => (
        <ContentCarousel 
            key={`movies-${key}`} 
            contentGenre={ tmdb.serieGenres[selectedGenre][0] } 
            contentType='serie' 
            sectionTitle={ index === 0 ? tmdb.serieGenres[ selectedGenre][1] : undefined } 
            pageNumber={ index + 1 }
            navigation={{ prevEl: `button-prev-${index}`, nextEl: `button-next-${index}` }}
        />
    ));

    // Animação de carregamento da pagina
    const loading = (
        <div className='w-screen h-screen fixed z-[400] flex justify-center items-center'>
            <span className="loading loading-spinner loading-lg text-neutral-400"></span>
        </div>
    );

    return (
        <div className='w-full min-h-screen'>
            <CategoryBar genresList={tmdb.serieGenres} selectGenre={setSelectedGenre}/>

            <div className='flex flex-col gap-y-[30px] pb-6 mt-2'>
                <Suspense fallback={loading}>
                    { carouselsList }
                </Suspense>
            </div>
        </div>
    );
};