'use client';

import { useContext, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import useFirebase from "@/components/hooks/firebase";

import EmblaCarousel from '@/components/emblaCarousel';

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

// Icones com React-icons
import { FaRegHeart, FaHeart } from "react-icons/fa";

import { UserDataContext } from '@/components/contexts/authenticationContext';
import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";

import { getReleaseDate } from '@/components/utils/tmdbApiData/releaseDate';

import { tmdbObjProps } from '@/components/contexts/tmdbContext';

import './index.css';

type CarouselProps = {
    contentData: tmdbObjProps[];
};

export default function TrendingCarousel( props: CarouselProps ) {
    
    const router = useRouter(); 
    const userData = useContext( UserDataContext );
    const globalEvents = useContext( GlobalEventsContext );
    const { addUserFavoritesToDb, deleteUserFavoritesOnDb } = useFirebase();

    // Define se o filme/serie e favorito ou nao, caso seja, salva no banco de dados
    const toggleFavoriteButton = ( e: MouseEvent<HTMLButtonElement>, contentId: string, mediaType: string ) => {
        if ( userData.isLoggedIn ) {
            const contentType = mediaType === 'tv' ? 'serie' : 'movie';

            if ( !e.currentTarget.classList.contains('favorite-button')) {
                addUserFavoritesToDb( contentId, contentType );
                return;
            };
            
            deleteUserFavoritesOnDb( contentId, contentType );
            e.currentTarget.classList.toggle('favorite-button');
            return;
        };

        globalEvents.setModalsController( prev => ({
            ...prev,
            isRegisterModalActive: !prev.isRegisterModalActive,
            formInstructionsMessage: 'Faça login ou crie uma conta para adicionar filmes e series aos seus favoritos'
        }));
    };

    return (             
        <div className='trending-wrapper'>
            <EmblaCarousel navigationType='default'>
                {/* Gerando slides a partir de um array de objetos retornados pela api do TMDB */}
                { props.contentData.map((item, index) => (
                    <div
                        key={`main-slides-${item.id}`}
                        className='embla__slide'>
                        {
                            item.poster_path || item.backdrop_path ? (
                                <div
                                    className="slide-container">
                                    {/* Opção para adicionar o filme/serie aos favoritos */}
                                    <button
                                        onClick={(e) => toggleFavoriteButton(e, item.id, item.media_type)}
                                        className={`${userData.favoriteMovies?.includes(item.id) || userData.favoriteSeries?.includes(item.id) ? 'favorite-button' : ''} absolute right-0 top-0 w-fit h-fit z-30`}
                                    >
                                        <FaRegHeart className="not-favorited text-white absolute top-3 right-3 text-[22px]" />
                                        <FaHeart className="favorited text-orangered absolute top-3 right-3 text-[22px]" />
                                    </button>
            
                                    {/* Imagem do conteudo a ser exibido */}
                                    <div
                                        className="w-full relative h-60 md:h-64 rounded-md cursor-pointer"
                                        onClick={() => router.push(`/player/${item.media_type}/${item.id}`, {scroll: true})}>
                                        <LazyLoadImage
                                            src={`https://image.tmdb.org/t/p/original${item.poster_path ?? item.backdrop_path}`}
                                            alt={`${item.title ?? item.name} movie/serie presentation image`}
                                            width={176}
                                            effect="opacity"
                                            height={'100%'}
                                            placeholderSrc={`https://image.tmdb.org/t/p/w92/${item.poster_path ?? item.backdrop_path}`}
                                            className='w-44 h-full object-cover rounded-md opacity-30'
                                        />
                                    </div>
                                    {/* posição do slide dentro da lista dos conteudos em 'trending' */}
                                    <div className='absolute h-16 w-16 bottom-0 left-0 bg-darkpurple flex items-center justify-center rounded-tr-xl rounded-bl-[5px] z-[2]'>
                                        <span className='text-4xl lg:text-5xl font-bold font-raleway text-white'>
                                            { index + 1 }
                                        </span>
                                    </div>
                                    {/* container com informações do filmes/serie */}
                                    <div className='absolute top-3 left-3 font-raleway z-[3]'>
                                        <span className='text-neutral-400 text-lg'>
                                            { item.media_type === 'movie' ? 'filme' : 'serie' }
                                        </span>
                                        <h4 className='text-xl font-bold'>
                                            { item.name ?? item.title }
                                        </h4>
                                        <span className='text-neutral-400 text-lg'>
                                            {getReleaseDate( item.first_air_date ?? item.release_date )}
                                        </span>
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                ))}
            </EmblaCarousel>
        </div>
    );
};