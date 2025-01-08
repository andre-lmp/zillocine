import { useRouter } from 'next/navigation';
import { useContext, MouseEvent } from 'react';
import useFirebase from '@/components/hooks/firebase';

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// Componente para o carregamento preguiçoso de imagens
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import { FaRegHeart, FaHeart, FaPlay, FaStar } from "react-icons/fa";

import { UserDataContext } from '@/components/contexts/authenticationContext';
import { GlobalEventsContext } from '@/components/contexts/globalEventsContext';

import { getReleaseDate } from '@/components/utils/tmdbApiData/releaseDate';

type componentProps = {
    fetchData: tmdbObjProps[];
    typeOfId: string;
};

export default function SearchResults( props: componentProps ) {

    const router = useRouter();
    const userData = useContext( UserDataContext );
    const globalEvents = useContext( GlobalEventsContext );
    const { addUserFavoritesToDb, deleteUserFavoritesOnDb } = useFirebase();

    const nextNavigate = ( content: tmdbObjProps ) => {
        const contentObjKeys = Object.keys( content );

        if (contentObjKeys.includes( 'first_air_date' )) {
            router.push(`player/serie/${content.id}`, { scroll: true });
            return;
        };

        router.push(`player/movie/${content.id}`, { scroll: true });
    };

    // Define se o filme/serie e favorito ou nao, caso seja, salva no banco de dados
    const toggleFavoriteButton = ( e: MouseEvent<HTMLButtonElement>, contentId: string ) => {
        if ( userData.isLoggedIn ) {
            if ( !e.currentTarget.classList.contains('favorite-button')) {
                addUserFavoritesToDb( contentId, props.typeOfId );
                return;
            }; 
                
            deleteUserFavoritesOnDb( contentId, props.typeOfId );
            e.currentTarget.classList.toggle('favorite-button');
            return;
        };

        globalEvents.setModalsController( prev => ({
            ...prev,
            isRegisterModalActive: !prev.isRegisterModalActive,
            formInstructionsMessage: 'Faça login ou crie uma conta para adicionar filmes e series aos seus favoritos'
        })); 
    };

    return props.fetchData[0] ? (
        <>
            <p className="text-[17px] lg:text-lg font-noto_sans font-medium">
                Resultados - {props.fetchData.length}
            </p>

            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>
    
            <div className='results-container'>
                { props.fetchData.map(( content, index ) => (
                    <div key={`${content.id}-${index}`}>
                        <div className='card'>
                            {/* Opção para adicionar o filme/serie aos favoritos */}
                            <button
                                onClick={(e) => toggleFavoriteButton(e, content.id)}
                                className={`${userData.favoriteMovies?.includes(content.id) || userData.favoriteSeries?.includes(content.id) ? 'favorite-button' : ''} absolute right-0 top-0 w-fit h-fit z-30`}
                            >
                                <FaRegHeart className="not-favorited text-white absolute top-3 right-3 text-[22px]"/>
                                <FaHeart className="favorited text-orangered absolute top-3 right-3 text-[22px]"/>
                            </button>

                            <FaPlay className="play-icon" onClick={() => {nextNavigate( content )}} />

                            <div onClick={() => {nextNavigate( content )}} className='image-box'>
                                {/* Imagem do conteudo */}
                                <LazyLoadImage
                                    src={`https://image.tmdb.org/t/p/original${content.poster_path ?? content.backdrop_path}`}
                                    alt={`${content.title ?? content.name} serie/movie presentation image`}
                                    width='100%'
                                    height='100%'
                                    effect="opacity"
                                    placeholderSrc={`https://image.tmdb.org/t/p/w92/${content.poster_path ?? content.backdrop_path}`}
                                    className="w-full h-full object-cover bg-darkpurple rounded-md cursor-pointer"
                                />    
                            </div>
                        </div>

                        {/* Container de informações sobre o conteudo */}
                        <div className="mt-2 relative pl-3">
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
        </>
    ) : null;
};