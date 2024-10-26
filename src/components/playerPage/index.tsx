'use client'

import { useEffect, useState } from 'react';

import Header from './header';
import Main from './main'
import SimilarMovies from './moviesCarousel';
import SerieSeasons from './seasonsCarousel';

// Hook personalizado com funções para busca de conteudo no TMDB
import useTmdbFetch from '@/components/hooks/tmdbHook/index';

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from '../contexts/tmdbContext';

type PlayerPageProps = {
    contentId: string;
    contentType: string;
};

export default function PlayerPage( props: PlayerPageProps ) {

    const { fetchSingleMovie, fetchSingleSerie } = useTmdbFetch();
    const [ isLoaded, setIsLoaded ] = useState( false );
    const [ contentData, setContentData ] = useState<tmdbObjProps[]>([]);

    const checkAvailability = ( data: tmdbObjProps ) => {
        if ( data.backdrop_path || data.poster_path ) {
            setIsLoaded( true )
            setContentData([ data ]);
            return;
        }

        return;
    };

    // Lida com a promise retornada por uma função de busca do useTmdbFetch
    const fetchHandler = async ( fetchResponse: Promise<any> ) => {
        const response = await fetchResponse;
        if ( response) {
            checkAvailability( response );
        };
    };

    useEffect(() => {
        if ( props.contentType === 'movie' ) {
            fetchHandler(fetchSingleMovie( props.contentId ));
        } else {
            fetchHandler(fetchSingleSerie( props.contentId ));
        };                
    }, []);

    return isLoaded ? (
        <section className='min-h-screen'>
            <Header playerData={contentData}/>

            <Main contentData={contentData[0]} contentType={ props.contentType }/>
            
            { props.contentType === 'movie' ? 
                <SimilarMovies contentId={props.contentId} contentType={props.contentType}/> :
                <SerieSeasons serieName={contentData[0].name} serieId={props.contentId} seasons={contentData[0].seasons}/>    
            }
        </section>
    ) : null;
};