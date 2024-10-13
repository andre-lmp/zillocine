'use client';

import React, { useEffect, useState } from 'react';

import { Carousel } from './carousel';

import useTmdbFetch from '@/components/hooks/tmdbHook/index';
import { tmdbObjProps } from '@/components/contexts/tmdbContext/index';

import 'swiper/css';
import 'swiper/element/css/autoplay';
import 'swiper/element/css/pagination';
import 'swiper/element/css/navigation';

interface CarouselProps {
    isLoaded?: React.Dispatch<React.SetStateAction<boolean>>;
    currentPage: string;
};

export default function HeaderCarousel(props: CarouselProps) {
    
    const [ contentData, setContentData ] = useState<any[]>([])
    const tmdbHook = useTmdbFetch();

    const checkAvailability = ( data: tmdbObjProps[] ) => {
        const filtered = data.filter( item => item.poster_path || item.backdrop_path );
        setContentData( filtered );
        props.isLoaded && props.isLoaded( true );
    };

    /*Função que seleciona os primeiros 7 filmes ou series das lista retornada pela api*/
    const selectContent = ( data: any ) => {
        const selectedIds = [];
        for ( let i = 0; i <= 7; i++ ) {
            selectedIds.push( data[i].id );
        };

        handleSecondFetch(tmdbHook.fetchSelectedIds( selectedIds, props.currentPage === 'series' ? 'serie' : 'movie' ));
    }; 
    
    const handleSecondFetch = async ( fetchResponse: Promise<any> ) => {
        const response = await fetchResponse;
        if ( response.length ) { 
            checkAvailability( response );
        };
    };

    // Logo apos a pagina ser carregada, e feita uma verificação para chamar uma função de busca especifica para cada pagina.
    useEffect(() => {

        const handleFirstFetch = async ( fetchResponse: Promise<any> ) => {
            const response = await fetchResponse;
            if ( response.length ) { 
                selectContent( response );
            };
        };

       if ( props.currentPage === 'home' ) {
            handleFirstFetch(tmdbHook.fetchReleasedMovies());
       } else {
            if ( props.currentPage === 'movies' ) {
               handleFirstFetch(tmdbHook.fetchPopularMovies()) 
            }
            if ( props.currentPage === 'series' ) {
                handleFirstFetch(tmdbHook.fetchPopularSeries());
            }
       }
    }, []);

    return (
        contentData.length ? (
           <Carousel contentData={contentData} currentPage={props.currentPage}/>
        ) : null
    );
};



