'use client';

import { useEffect } from 'react';

import DefaultCarousel from '@/components/emblaCarousel/templates/default';
import CarouselTitle from '../../homePage/carouselTitle';

// Barra com alguns generos de filmes/series
import CategoryBar from '@/components/categoryBar';

import { useContext, useState } from 'react';

import { TmdbContext, tmdbObjProps } from '@/components/contexts/tmdbContext';

export default function Carousel() {

    const tmdb = useContext( TmdbContext );
    const [ moviesData, setMoviesData ] = useState<Array<tmdbObjProps[]>>([]);
    const [ genre, setGenre ] = useState( tmdb.movieGenres.release[0] );

    useEffect(() => {
        ( async () => {
            try {
                const data: Array<tmdbObjProps[]> = await new Promise(( resolve, reject ) => {
                    Promise.all(Array.from({length: 5}).map( async (_, index) => {
                        const response = await fetch(`/api/movies/${genre}?page=${index + 1}`);
                        if ( !response.ok ) {
                            throw new Error(`Error: ${response.status}`);
                        };
                        const data = await response.json();
                        return data.movies;
                    })).then( result => {
                        resolve( result );
                    }).catch(( error ) => {
                        console.error( error );
                        reject( error );
                    });
                });

                setMoviesData([ ...data ]);
            } catch ( error ) {
                console.error( error );  
            };         
        })();
    },[ genre ]);

    // Gera um carousel de slides para cada genero dentro do contexto
    const carouselsList =  moviesData.map(( moviesArray, index) => (
        <div key={`movies-page-carousel-${index}`}>
            { index === 0 ? (
                <CarouselTitle type='focus'>
                    <h2 className='normal-title'>{ tmdb.movieGenres.release[1] }</h2>
                    <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'/>
                </CarouselTitle>
            ) : null }
            <DefaultCarousel contentType='movie' contentData={moviesArray}/>
        </div>
    ));

    // Animação de carregamento da pagina
    const loadingAnimation = (
        <div className='w-full h-96 absolute top-0 left-0 z-[400] flex justify-center items-center'>
            <span className="loading loading-spinner loading-lg text-neutral-400"></span>
        </div>
    );

    return (
        <div className='w-full min-h-screen'>
            <CategoryBar genresList={tmdb.movieGenres} selectGenre={setGenre}/>

            <div className='flex flex-col gap-y-[30px] pb-6 mt-2 px-4 md:px-6 lg:px-8 relative'>
                { moviesData.length ? carouselsList : loadingAnimation }
            </div>
        </div>
    );
};