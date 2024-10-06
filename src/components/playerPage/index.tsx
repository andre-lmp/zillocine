'use client'

import { useEffect, useState } from 'react';

import * as Style from '@/components/playerPage/styles';

import Header from './header';
import Main from './main'
import SimilarMovies from './moviesCarousel';
import SerieSeasons from './seasonsCarousel';

import useTmdbFetch from '@/components/hooks/tmdbHook/index';
import { tmdbObjProps } from '../contexts/tmdbContext';

type PlayerPageProps = {
    contentId: string;
    contentType: string;
};

export default function PlayerPage( props: PlayerPageProps ) {

    const { fetchSingleMovie, fetchSingleSerie } = useTmdbFetch();
    const [ isLoaded, setIsLoaded ] = useState( false );
    const [ contentData, setContentData ] = useState<tmdbObjProps[]>([]);

    const checkAvailability = ( data: Record<string, any> ) => {
        if ( data.backdrop_path || data.poster_path ) {
            setIsLoaded( true )
            setContentData([ data ]);
            return;
        }

        return;
    };

    useEffect(() => {
        const fetchHandler = async ( fetchResponse: Promise<any> ) => {
            const response = await fetchResponse;
            if ( response) {
                checkAvailability( response );
            };
        };

        props.contentType === 'movie' ? 
            fetchHandler(fetchSingleMovie( props.contentId )) : 
                fetchHandler(fetchSingleSerie( props.contentId ));
    }, []);

    return isLoaded ? (
        <section className='min-h-screen'>
            <Header playerData={contentData}/>
            <Main playerData={contentData} contentType={ props.contentType }/>
            { props.contentType === 'movie' ? 
                <SimilarMovies contentId={props.contentId} contentType={props.contentType}/> :
                <SerieSeasons serieName={contentData[0].name} serieId={props.contentId} seasons={contentData[0].seasons}/>    
            }
        </section>
    ) : null;
};