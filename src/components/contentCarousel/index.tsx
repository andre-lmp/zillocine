'use client';

import { useEffect, useState, MouseEvent, useContext } from "react";
// Hook personalizado do TMDB com funções de busca de conteudo
import useTmdbFetch from "@/components/hooks/tmdbHook";
// // Interface de tipo para objetos retornados pela api do TMDB
import { tmdbObjProps } from "../contexts/tmdbContext";

import Carousel from "./swiper";

import * as Style from './styles';

type carouselProps = {
    sectionTitle?: string;
    contentType: string;
    contentGenre: string;
    pageNumber: number;
    navigation: { nextEl: string, prevEl: string };
};

export default function ContentCarousel( props: carouselProps ) {

    const [ contentData, setContentData ] = useState<tmdbObjProps[]>([]);
    const { fetchMovies, fetchReleasedMovies, fetchSeries, fetchReleasedSeries } = useTmdbFetch();

    // Lida com a promise retornada por uma função de busca do useTmdbFetch
    const handleFetchResponse = async ( fetchContent: Promise<any> ) => {
        const response = await fetchContent;
        if ( response.length ) {
            checkAvailability( response );
        };
    };

    useEffect(() => {
        // Define qual o tipo do conteudo a ser buscado com base na pagina atual
       if ( props.contentType === 'movie' ) {
            if ( props.contentGenre !== 'release' ) {
                handleFetchResponse(fetchMovies( props.contentGenre, props.pageNumber ));
            } else {
                handleFetchResponse(fetchReleasedMovies( props.pageNumber ));
            }
       } else {
            if ( props.contentGenre !== 'release' ) {
                handleFetchResponse(fetchSeries( props.contentGenre, props.pageNumber ));
            } else {
                handleFetchResponse(fetchReleasedSeries( props.pageNumber ));
            }
       };

    }, [ props.contentGenre ]);

    const checkAvailability = ( data: tmdbObjProps[] ) => {
        const filtered = data.filter(( item ) => ( item.backdrop_path || item.poster_path ) !== null );
        setContentData( filtered );
    };

    return contentData.length ? (
        <Style.ContentWrapper>
            <Carousel 
                contentData={contentData} 
                contentType={props.contentType}
                sectionTitle={props.sectionTitle}
                navigation={{ prevEl: props.navigation.prevEl, nextEl: props.navigation.nextEl }}
            />
        </Style.ContentWrapper>
    ) : null;
};