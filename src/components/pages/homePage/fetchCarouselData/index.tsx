'use server';

// Hook personalizado do TMDB com funções de busca de conteudo
import useTmdbFetch from "@/components/hooks/tmdbHook";

// // Interface de tipo para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

type carouselProps = {
    sectionTitle?: string
    contentType: string;
    contentGenre: string;
    pageNumber: number;
    navigation: { nextEl: string, prevEl: string };
};

import { ContentWrapper } from "@/components/contentCarousel/styles";
import dynamic from "next/dynamic";
const Carousel = dynamic(() => import('../carousel/index'), { ssr: false });

export default async function FetchCarouselData( props: carouselProps ) {

    const contentData: tmdbObjProps[] = [];
    const { fetchMovies, fetchReleasedMovies, fetchSeries, fetchReleasedSeries } = useTmdbFetch();

     // Seleciona somente o conteudo que possuir imagens disponiveis
     const checkAvailability = async ( data: tmdbObjProps[] ) => {
        const filteredContent: tmdbObjProps[] = await new Promise( resolve => {
            const filtered = data.filter( item => item.poster_path || item.backdrop_path );
            resolve( filtered );
        });

        return filteredContent;
    };

    // Lida com a promise retornada por uma função de busca do useTmdbFetch
    const handleFetchPromise = async ( promise: Promise<tmdbObjProps[] | undefined> ) => {
        try {
            const response = await promise;
            return response;

        } catch (error) {
            throw new Error( 'Erro ao buscar conteudo' + error );   
        };
    };

        // Define qual o tipo do conteudo a ser buscado com base na pagina atual
       if ( props.contentType === 'movie' ) {
            const movies: tmdbObjProps[] = [];

            if ( props.contentGenre !== 'release' ) {
                const response = await handleFetchPromise(fetchMovies( props.contentGenre, props.pageNumber ));
                if ( response ) movies.push( ...response );
            } else {
                const response = await handleFetchPromise(fetchReleasedMovies( props.pageNumber ));
                if ( response ) movies.push( ...response );
            };

            if ( movies.length ) {
                const filteredMovies = await checkAvailability( movies );
                contentData.push( ...filteredMovies );
            };
       }; 
       
    //    if () {
    //         if ( props.contentGenre !== 'release' ) {
    //             handleFetchPromise(fetchSeries( props.contentGenre, props.pageNumber ));
    //         } else {
    //             handleFetchPromise(fetchReleasedSeries( props.pageNumber ));
    //         }
    //    };

    return contentData.length ? (
        <ContentWrapper>
            <Carousel 
                contentData={contentData} 
                contentType={props.contentType}
                sectionTitle={props.sectionTitle}
                navigation={{ prevEl: props.navigation.prevEl, nextEl: props.navigation.nextEl }}
            />
        </ContentWrapper>
    ) : null;
};