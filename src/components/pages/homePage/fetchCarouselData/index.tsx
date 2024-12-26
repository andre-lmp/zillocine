'use server';

// Hook personalizado do TMDB com funções de busca de conteudo
import useTmdbFetch from "@/components/hooks/tmdbHook";

// // Interface de tipo para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

type carouselProps = {
    contentType: string;
    contentGenre: string;
    pageNumber: number;
    navigation: { nextEl: string, prevEl: string };
    children?: JSX.Element[];
};

import { ContentWrapper as CarouselWrapper } from "@/components/contentCarousel/styles";
import MoviesCarousel from "../movieSlides";
import TrendingCarousel from "../trendingSlides";

export default async function FetchCarouselData( props: carouselProps ) {

    const contentData: tmdbObjProps[] = [];
    const { fetchMovies, fetchReleasedMovies, fetchTrendingContent } = useTmdbFetch();

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


    const movies: tmdbObjProps[] = [];

    // Define qual o tipo do conteudo a ser buscado com base na pagina atual
    if ( props.contentType === 'movie' ) {

        if ( props.contentGenre === 'release' ) {
            const response = await handleFetchPromise(fetchReleasedMovies( props.pageNumber ));
            if ( response ) movies.push( ...response );
        }; 

        if ( props.contentGenre !== 'release' ) {
            const response = await handleFetchPromise(fetchMovies( props.contentGenre, props.pageNumber ));
            if ( response ) movies.push( ...response );
        };
    };
    
    if ( props.contentType === 'trending' ) {
        const response = await fetchTrendingContent();
        if ( response ) movies.push( ...response );
    };

    if ( movies.length ) {
        const filteredMovies = await checkAvailability( movies );
        contentData.push( ...filteredMovies );
    };

    return contentData.length ? (
        <CarouselWrapper>
            <div className='px-4 w-full md:px-6 lg:px-8'>
                { props.children }

                {/* carousel de slides com estrutura base */}
                { props.contentType === 'movie' ? (
                    <MoviesCarousel
                        contentData={contentData}
                        contentType={props.contentType}
                        navigation={props.navigation}
                    />
                ) : null }

                {/* carousel de slides com conteudos em 'Trending' */}
                { props.contentType === 'trending' ? (
                    <TrendingCarousel
                        contentData={contentData}
                        contentType={props.contentType}
                        navigation={props.navigation}
                    />
                ) : null }
            </div>
        </CarouselWrapper>
    ) : null;
};