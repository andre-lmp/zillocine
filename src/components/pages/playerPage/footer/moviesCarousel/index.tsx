// Hook personalizado do TMDB com funções de busca de conteudo
import useTmdbFetch from "@/components/hooks/tmdb";

// // Interface de tipo para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import DefaultCarousel from "@/components/emblaCarousel/templates/default";
import '@/components/emblaCarousel/templates/default/index.css';

import CarouselTitle from '@/components/pages/homePage/carouselTitle';

type carouselProps = {
    movieId: string;
};
import { checkAvailability } from "@/components/utils/tmdbApiData/availability";
import dynamic from "next/dynamic";

export default async function FetchCarouselData( props: carouselProps ) {

    const contentData: tmdbObjProps[] = [];
    const { fetchSimilarMovies } = useTmdbFetch();

    const movies = await fetchSimilarMovies( props.movieId )

    if ( movies ) {
        const filteredMovies = await checkAvailability( movies );
        contentData.push( ...filteredMovies );
    };

    return contentData.length ? (
        <div className="mt-6 px-4 md:px-6 lg:px-8">
            <CarouselTitle type="normal">
                <h2 className="normal-title">Talvez você goste</h2>
                <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'/>
            </CarouselTitle>

            <DefaultCarousel contentData={contentData} contentType='movie'/>
        </div>
    ) : null;
};