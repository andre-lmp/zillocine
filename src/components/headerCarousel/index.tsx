'use server';

// Hook personalizado do TMDB com funções de busca de conteudo
import useTmdbFetch from '@/components/hooks/tmdbHook/index';

import React from 'react';

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from '@/components/contexts/tmdbContext/index';

import dynamic from 'next/dynamic';
const Carousel = dynamic(() => import('./swiper/index'), { ssr: false });

interface CarouselProps {
    currentPage: string;
};

export default async function HeaderCarousel( props: CarouselProps ) {
    
    const contentData: tmdbObjProps[] = [];
    const tmdbHook = useTmdbFetch();
    const contentType =  props.currentPage === 'series' ? 'serie' : 'movie';

    // Seleciona somente o conteudo que possuir imagens disponiveis
    const checkAvailability = async ( data: tmdbObjProps[] ) => {
        const filteredContent: tmdbObjProps[] = await new Promise( resolve => {
            const filtered = data.filter( item => item.poster_path || item.backdrop_path );
            resolve( filtered );
        });

        return filteredContent;
    };

    const fetchContentByIdList = async ( idsList: string[], type: string ) => {
        try {
            const response = await tmdbHook.fetchSelectedIds( idsList, type );
            return response;
        } catch (error) {
            throw new Error( 'Erro ao buscar conteudo' + error );   
        };
    };

    /*Função que seleciona os primeiros 7 ids de filmes ou series e faz uma nova requisição a api para buscar informações mais detalhadas sobre os ids*/
    const selectContent = async ( data: tmdbObjProps[] ) => {
        const selectedIds: string[] = await new Promise( resolve => {
            const idsList = [];
            for ( let i = 0; i <= 7; i++ ) {
                idsList.push( data[i].id );
            };
            resolve( idsList );
        });

        return selectedIds;
    }; 

    const handleFetchPromise = async ( promise: Promise<any> ) => {
        try {
            const response = await promise;
            return response;
        } catch (error) {
            throw new Error( 'Erro ao buscar conteudo' + error );   
        };
    };

    if ( props.currentPage === 'home' ) {
        const releasedMovies = await handleFetchPromise(tmdbHook.fetchReleasedMovies());
        const selectedIds = await selectContent( releasedMovies );
        const content = await fetchContentByIdList( selectedIds, contentType );
        const filteredContent = await checkAvailability( content );
        contentData.push( ...filteredContent );
    };
    
    if ( props.currentPage === 'movies' ) {
        const popularMovies = await handleFetchPromise(tmdbHook.fetchPopularMovies());
        const selectedIds = await selectContent( popularMovies );
        const content = await fetchContentByIdList( selectedIds, contentType );
        const filteredContent = await checkAvailability( content );
        contentData.push( ...filteredContent );
    };

    if ( props.currentPage === 'series' ) {
        const popularSeries = await handleFetchPromise(tmdbHook.fetchPopularSeries());
        const selectedIds = await selectContent( popularSeries );
        const content = await fetchContentByIdList( selectedIds, contentType );
        const filteredContent = await checkAvailability( content );
        contentData.push( ...filteredContent );
    };           

    return contentData.length ? (
           <Carousel contentData={contentData} currentPage={props.currentPage}/>
    ) : null
};



