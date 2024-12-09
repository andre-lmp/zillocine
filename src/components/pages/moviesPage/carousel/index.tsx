'use client';

import ContentCarousel from '@/components/contentCarousel';
// Barra com alguns generos de filmes/series
import CategoryBar from '@/components/categoryBar';

import { useContext, useState, Suspense } from 'react';

import { TmdbContext } from '@/components/contexts/tmdbContext';

export default function Carousel() {

    const tmdb = useContext( TmdbContext );
    const [ selectedGenre, setSelectedGenre ] = useState( tmdb.movieGenres.release[0] );

    // Gera um carousel de slides para cada genero dentro do contexto
    const carouselsList =  Object.keys( tmdb.movieGenres ).map(( key, index ) => (
        <ContentCarousel 
            key={`movies-${key}`} 
            contentGenre={ tmdb.movieGenres[selectedGenre][0] } 
            contentType='movie' 
            sectionTitle={ index === 0 ? tmdb.movieGenres[ selectedGenre][1] : undefined } 
            pageNumber={ index + 1 }
            navigation={{ prevEl: `button-prev-${index}`, nextEl: `button-next-${index}` }}
        />
    ));

    // Animação de carregamento da pagina
    const loading = (
        <div className='w-full h-screen fixed z-[400] flex justify-center items-center'>
            <span className="loading loading-spinner loading-lg text-neutral-400"></span>
        </div>
    );

    return (
        <div className='w-full min-h-screen'>
            <CategoryBar genresList={tmdb.movieGenres} selectGenre={setSelectedGenre}/>

            <div className='flex flex-col gap-y-[30px] pb-6 mt-2'>
                <Suspense fallback={loading}>
                    { carouselsList }
                </Suspense>
            </div>
        </div>
    );
};