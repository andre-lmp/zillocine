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
import TopSeriesCarousel from "../serieSlides";

export default async function FetchCarouselData( props: carouselProps ) {

    const contentData: tmdbObjProps[] = [];
    const { 
        fetchMovies, 
        fetchReleasedMovies, 
        fetchTrendingContent,
        fetchPopularSeries,
        fetchSelectedIds
    } = useTmdbFetch();

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

    const fetchContentByIdList = async ( idsList: string[], type: string ) => {
        try {
            const response = await fetchSelectedIds( idsList, type );
            return response;
        } catch (error) {
            throw new Error( 'Erro ao buscar conteudo' + error );   
        };
    };

    /*Função que seleciona os primeiros 7 ids de filmes ou series e faz uma nova requisição a api para buscar informações mais detalhadas sobre os ids*/
    const getContentId = async ( data: tmdbObjProps[] ) => {
        if ( !data.length ) {
            return [''];
        };

        const contentIds: string[] = await new Promise( resolve => {
            const idsList: string[] = [];
            data.forEach(( item: tmdbObjProps ) => {
                idsList.push( item.id );
            });
            resolve( idsList );
        });

        return contentIds;
    }; 

    const contentList: tmdbObjProps[] = [];

    // Define qual o tipo do conteudo a ser buscado com base na pagina atual
    if ( props.contentType === 'movie' ) {

        if ( props.contentGenre === 'release' ) {
            const response = await handleFetchPromise(fetchReleasedMovies( props.pageNumber ));
            if ( response ) contentList.push( ...response );
        }; 

        if ( props.contentGenre !== 'release' ) {
            const response = await handleFetchPromise(fetchMovies( props.contentGenre, props.pageNumber ));
            if ( response ) contentList.push( ...response );
        };
    };
    
    if ( props.contentType === 'trending' ) {
        const response = await fetchTrendingContent();
        if ( response ) contentList.push( ...response );
    };

    if ( props.contentType === 'TopRatedSeries' ) {
        const popularSeries = await handleFetchPromise(fetchPopularSeries());
        const selectedIds = await getContentId( popularSeries ?? [] );
        const content = await fetchContentByIdList( selectedIds, 'serie' );
        if ( content ) contentList.push( ...content );
    };

    if ( contentList.length ) {
        const filteredMovies = await checkAvailability( contentList );
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

                {/* carousel de slides as series mais avaliadas no TMDB */}
                { props.contentType === 'TopRatedSeries' ? (
                    <TopSeriesCarousel
                        contentData={contentData}
                        contentType={props.contentType}
                        navigation={props.navigation}
                    />
                ) : null }
            </div>
        </CarouselWrapper>
    ) : null;
};