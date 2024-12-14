'use server';

// Hook personalizado do TMDB com funções de busca de conteudo
import useTmdbFetch from "@/components/hooks/tmdbHook";

// // Interface de tipo para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

type carouselProps = {
    movieId: string;
};

import { ContentWrapper } from "@/components/contentCarousel/styles";
import dynamic from "next/dynamic";
const Carousel = dynamic(() => import('./carousel/index'), { ssr: false });

export default async function FetchCarouselData( props: carouselProps ) {

    const contentData: tmdbObjProps[] = [];
    const { fetchSimilarMovies } = useTmdbFetch();

    // Seleciona somente o conteudo que possuir imagens disponiveis
    const checkAvailability = async ( data: tmdbObjProps[] ) => {
        const filteredContent: tmdbObjProps[] = await new Promise( resolve => {
            const filtered = data.filter( item => item.poster_path || item.backdrop_path );
            resolve( filtered );
        });

        return filteredContent;
    };

    const movies = await fetchSimilarMovies(props.movieId)
    if ( movies ) {
        const filteredMovies = await checkAvailability( movies );
        contentData.push( ...filteredMovies );
    };

    return contentData.length ? (
         <ContentWrapper>
            <Carousel 
                contentData={contentData} 
                movieId={props.movieId}
            />
        </ContentWrapper>
    ) : null;
};