'use client';

import React, { useEffect, useState } from 'react';

// Hook personalizado do TMDB com funções de busca de conteudo
import useTmdbFetch from '@/components/hooks/tmdbHook/index';

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from '@/components/contexts/tmdbContext/index';

import { Carousel } from './slides';

interface CarouselProps {
    isLoaded?: React.Dispatch<React.SetStateAction<boolean>>;
    currentPage: string;
};

export default function HeaderCarousel(props: CarouselProps) {
    
    const [ contentData, setContentData ] = useState<tmdbObjProps[]>([])
    const tmdbHook = useTmdbFetch();

    // Seleciona somente o conteudo que possuir imagens disponiveis
    const checkAvailability = ( data: tmdbObjProps[] ) => {
        const filtered = data.filter( item => item.poster_path || item.backdrop_path );
        setContentData( filtered );
        props.isLoaded && props.isLoaded( true );
    };

    /*Função que seleciona os primeiros 7 ids de filmes ou series e faz uma nova requisição a api para buscar informações mais detalhadas sobre os ids*/
    const selectContent = ( data: tmdbObjProps[] ) => {
        const selectedIds = [];
        for ( let i = 0; i <= 7; i++ ) {
            selectedIds.push( data[i].id );
        };

        const contentType =  props.currentPage === 'series' ? 'serie' : 'movie';
        handleSecondFetch(tmdbHook.fetchSelectedIds( selectedIds, contentType ));
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

    return contentData.length ? (
           <Carousel contentData={contentData} currentPage={props.currentPage}/>
    ) : null
};



