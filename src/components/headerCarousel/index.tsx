'use client';

import React, { useEffect, useState, useContext } from 'react';

import { Carousel } from './carousel';

import useTmdbFetch from '@/components/hooks/tmdbHook/index';
import { TmdbContext } from '@/components/contexts/tmdbContext/index';
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
    const tmdb = useContext( TmdbContext );
    const { fetchAllGenres, fetchReleasedMovies } = useTmdbFetch();

    const checkAvailability = ( data: tmdbObjProps[] ) => {
        const filtered = data.filter( item => item.poster_path || item.backdrop_path );
        setContentData( filtered );
        console.log( filtered );
        props.isLoaded && props.isLoaded( true );
    };

    /*Função que seleciona os primeiros 7 filmes ou series das lista retornada pela api*/
    const selectContent = ( data: any ) => {
        const selectedContent = [];
        for ( let i = 0; i <= 7; i++ ) {
            selectedContent.push( data[i] );
        }

        checkAvailability( selectedContent );
    };

    /*Função que seleciona os filmes ou series mais bem avaliados*/
    const selectTopReviews = async ( data: any[] ) => {
        const selectedContent = [];

        const select = ( data: tmdbObjProps[] ) => {
            let bestReview = 0;
            let bestReviewIndex = '0';

            return new Promise(( resolve ) => { 
                for ( let index in data ) {
                    if ( data[index].vote_average > bestReview ) {
                        bestReviewIndex = index;
                        bestReview = data[index].vote_average;
                    };
                };

                resolve( data[Number(bestReviewIndex)] );
             });
        };

        for ( let item of data ) {
            const response = await select( item );
            selectedContent.push( response );
        };

        setContentData( selectedContent )
        props.isLoaded && props.isLoaded( true )
    };

    useEffect(() => {
        const fetchHandler = async ( fetchResponse: Promise<any> ) => {
            const response = await fetchResponse;
            if ( response.length ) { 
                props.currentPage === 'home' ? selectContent( response ) : selectTopReviews( response );
            };
        };

       if ( props.currentPage === 'home' ) {
            fetchHandler( fetchReleasedMovies() );
       } else {
            if ( props.currentPage === 'movies' ) {
                fetchHandler( fetchAllGenres( tmdb.movieGenres.allGenres, 'movie' ))
            } else {
                fetchHandler( fetchAllGenres( tmdb.serieGenres.allGenres, 'serie' ))
            }
       }
    }, []);

    return (
        contentData.length ? (
           <Carousel contentData={contentData} currentPage={props.currentPage}/>
        ) : null
    );
};



