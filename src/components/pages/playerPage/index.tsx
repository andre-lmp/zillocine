import SimilarMovies from './footerCarousel/moviesCarousel';

// Hook personalizado com funções para busca de conteudo no TMDB
import useTmdbFetch from '@/components/hooks/tmdbHook';

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from '../../contexts/tmdbContext';
import dynamic from 'next/dynamic';

type PlayerPageProps = {
    contentId: string;
    contentType: string;
};

const Header = dynamic(() => import('./header/index'), { ssr: false });
const SerieSeasons = dynamic(() => import('./footerCarousel/seasonsCarousel'), { ssr: false });
import Main from './main/index';

export default async function PlayerPage( props: PlayerPageProps ) {

    const { fetchSingleMovie, fetchSingleSerie } = useTmdbFetch();
    const contentData: tmdbObjProps[] = [];

    if ( props.contentType === 'movie' ) {
        const movie: tmdbObjProps | undefined = await fetchSingleMovie(props.contentId);
        if ( movie ) {
            contentData.push( movie );
        };
    };

    if ( props.contentType === 'serie' ) {
        const serie: tmdbObjProps | undefined = await fetchSingleSerie(props.contentId);
        if ( serie ) {
            contentData.push( serie );
        };
    };

    return contentData.length ? (
        <section className='min-h-screen mb-6'>
            <Header playerData={contentData}/>

            <Main contentData={contentData[0]} contentType={ props.contentType }/>
            
            { props.contentType === 'movie' ? 
                <SimilarMovies movieId={props.contentId}/> :
                <SerieSeasons serieName={contentData[0].name} serieId={props.contentId} seasons={contentData[0].seasons}/>    
            }
        </section>
    ) : null;
};