// Hooks
import { useRouter } from 'next/navigation';
import { useContext, MouseEvent } from 'react';
import useFirebase from '@/components/hooks/firebaseHook';

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// Componente para o carregamento preguiçoso de imagens
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

// Icones com React-icons
import { FaRegHeart, FaHeart, FaPlay, FaStar } from "react-icons/fa";

// Estilos com styled componentes
import { SearchResultWrapper } from '../styles';
import { imageBox as SearchImageBox } from '@/components/contentCarousel/styles';

// Contextos
import { UserDataContext } from '@/components/contexts/authenticationContext';
import { GlobalEventsContext } from '@/components/contexts/globalEventsContext';

type componentProps = {
    fetchData: tmdbObjProps[];
    typeOfId: string;
};

export default function ShowResults( props: componentProps ) {

    const router = useRouter();
    const userData = useContext( UserDataContext );
    const globalEvents = useContext( GlobalEventsContext );
    const { addUserFavoritesToDb, deleteUserFavoritesOnDb } = useFirebase();

    const nextNavigate = ( content: tmdbObjProps ) => {
        const contentObjKeys = Object.keys( content );

        if (contentObjKeys.includes( 'first_air_date' )) {
            router.push(`player/serie/${content.id}`, { scroll: true });
        };

        if (!contentObjKeys.includes( 'first_air_date' )) {
            router.push(`player/movie/${content.id}`, { scroll: true });
        };
    };

    /*Função que obtem o ano de lançamento de um filme ou serie*/
    const getReleaseDate = ( date: string ) => {
        if ( !date ) return
        const newDate = [];
        for ( let i = 0; i < 4; i++ ) {
            newDate.push( date[i] );
        }
        return newDate.join('');
    };

    // Define se o filme/serie e favorito ou nao, caso seja, salva no banco de dados
    const toggleFavoriteButton = ( e: MouseEvent<HTMLButtonElement>, contentId: string ) => {
        if ( userData.isLoggedIn ) {
            if ( !e.currentTarget.classList.contains('favorite-button')) {
                addUserFavoritesToDb( contentId, props.typeOfId );
            } else {
                deleteUserFavoritesOnDb( contentId, props.typeOfId );
            };
    
            e.currentTarget.classList.toggle('favorite-button');
        } else {
            globalEvents.setModalsController( prev => ({
                ...prev,
                isRegisterModalActive: !prev.isRegisterModalActive,
                formInstructionsMessage: 'Faça login ou crie uma conta para adicionar filmes e series aos seus favoritos'
            }));
        }
    };

    return props.fetchData[0] && (
        <SearchResultWrapper>

            <p className="text-[17px] lg:text-lg font-noto_sans font-medium">Resultados - {props.fetchData.length}</p>
            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>
    
            <div className='result-container mt-3'>
                { props.fetchData.map(( content, index ) => (
                    <div key={`${content.id}-${index}`} className=''>
                        <SearchImageBox>
                        
                            {/* Opção para adicionar o filme/serie aos favoritos */}
                            <button
                                onClick={(e) => toggleFavoriteButton(e, content.id)}
                                className={`${userData.favoriteMovies?.includes(content.id) || userData.favoriteSeries?.includes(content.id) ? 'favorite-button' : ''} absolute right-0 top-0 w-16 h-16 flex contents-start justify-end z-30`}
                            >
                                <FaRegHeart className="not-favorited text-white absolute top-3 right-3 text-[22px]"/>
                                <FaHeart className="favorited text-orangered absolute top-3 right-3 text-[22px]"/>
                            </button>

                            <FaPlay className="play-icon" onClick={() => {nextNavigate( content )}} />

                            {/* controla a navegação para o player */}
                            <div onClick={() => {nextNavigate( content )}} className='"w-full relative cursor-pointer h-60 md:h-64'>
                                {/* Imagem do conteudo */}
                                <LazyLoadImage
                                    src={`https://image.tmdb.org/t/p/original${content.poster_path ?? content.backdrop_path}`}
                                    alt={`${content.title ?? content.name} serie/movie presentation image`}
                                    width='100%'
                                    height='100%'
                                    effect="opacity"
                                    placeholderSrc={`https://image.tmdb.org/t/p/w92/${content.poster_path ?? content.backdrop_path}`}
                                    className="image w-full h-full object-cover bg-darkpurple rounded-md"
                                />    
                            </div>
                        </SearchImageBox>

                        {/* Container de informações sobre o conteudo */}
                        <div className="mt-2 relative pl-3">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5/6 bg-neutral-400 rounded-md"></div>

                            {/* Titulo */}
                            <p className="font-raleway font-bold text-[15px] text-white line-clamp-1">
                                { content.title ?? content.name }
                            </p>

                            <div className="flex items-center gap-x-3 font-normal font-noto_sans text-neutral-400">
                                {/* Data de lançamento */}
                                <p className="text-[15px]">
                                    {getReleaseDate( content.release_date ?? content.first_air_date )}
                                </p>

                                {/* Nota do publico ao conteudo */}
                                <p className="text-[15px] flex contents-center gap-x-1">
                                    <FaStar className=""/> 
                                    {( content.vote_average).toFixed(0 )}/10
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </SearchResultWrapper>
    );
};