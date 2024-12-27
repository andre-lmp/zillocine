'use client';

import { useContext, MouseEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import useFirebase from "@/components/hooks/firebaseHook";

import * as Style from '@/components/contentCarousel/styles';
import { TrendingImageContainer } from '../styles';

// Componentes do Swiper.js para carousel de slides
import { SwiperSlide } from "swiper/react";
import SwiperDefaultConfig from '../swiperDefaultConfig';

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

// Icones com React-icons
import { FaRegHeart, FaHeart, FaPlay } from "react-icons/fa";

import { UserDataContext } from '@/components/contexts/authenticationContext';
import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";

import { tmdbObjProps } from '@/components/contexts/tmdbContext';
import SwiperControllers from '../carouselControlArrows';

type CarouselProps = {
    navigation: { nextEl: string, prevEl: string };
    contentType: string;
    contentData: tmdbObjProps[];
};

export default function TopSeriesCarousel( props: CarouselProps ) {
    
    const router = useRouter(); 
    const userData = useContext( UserDataContext );
    const globalEvents = useContext( GlobalEventsContext );
    const { addUserFavoritesToDb, deleteUserFavoritesOnDb } = useFirebase();
    const [ swiperState, setSwiperState ] = useState({
        isBeginning: true,
        isOver: false
    });

    // Define se o filme/serie e favorito ou nao, caso seja, salva no banco de dados
    const toggleFavoriteButton = ( e: MouseEvent<HTMLButtonElement>, contentId: string ) => {
        if ( userData.isLoggedIn ) {
            if ( !e.currentTarget.classList.contains('favorite-button')) {
                addUserFavoritesToDb( contentId, 'serie' );
            } else {
                deleteUserFavoritesOnDb( contentId, 'serie' );
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

    /*Função que obtem o ano de lançamento de um filme ou serie*/
    const getReleaseDate = ( date: string ) => {
        if ( !date ) return;
        const newDate = [];
        for ( let i = 0; i < 4; i++ ) {
            newDate.push( date[i] );
        }
        return newDate.join('');
    };

    return (             
        <Style.SwiperContainer >
            <SwiperDefaultConfig
               navigation={props.navigation}
               swiperState={setSwiperState}
            >
                {/* Gerando slides a partir de um array de objetos retornados pela api do TMDB */}
                {props.contentData.map((item, index) => (
                    <SwiperSlide
                        key={`main-slides-${item.id}`}
                        style={{ width: 'auto', borderRadius: '4px', overflow: 'hidden' }}
                    >
                        {
                            item.poster_path || item.backdrop_path ? (
                                <TrendingImageContainer>
                                    <div className="w-96 max-w-[calc(100%-16px)] relative overflow-hidden">
                                        {/* Opção para adicionar o filme/serie aos favoritos */}
                                        <button
                                            onClick={(e) => toggleFavoriteButton(e, item.id)}
                                            className={`${userData.favoriteMovies?.includes(item.id) || userData.favoriteSeries?.includes(item.id) ? 'favorite-button' : ''} absolute right-0 top-0 w-16 h-16 flex items-start justify-end z-30`}
                                        >
                                            <FaRegHeart className="not-favorited text-white absolute top-3 right-3 text-[22px]" />
                                            <FaHeart className="favorited text-orangered absolute top-3 right-3 text-[22px]" />
                                        </button>
                                    
                                        {/* Imagem do conteudo a ser exibido */}
                                        <div className="w-full relative h-60 md:h-64">
                                            <LazyLoadImage
                                                src={`https://image.tmdb.org/t/p/original${item.poster_path ?? item.backdrop_path}`}
                                                alt={`${item.name} movie/serie presentation image`}
                                                effect="opacity"
                                                width={'100%'}
                                                height={'100%'}
                                                placeholderSrc={`https://image.tmdb.org/t/p/w92/${item.poster_path ?? item.backdrop_path}`}
                                                className='w-full h-full object-cover bg-darkpurple rounded-md'
                                            />
                                        </div>

                                        {/* overlay */}
                                        <div 
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundImage: 'linear-gradient(to bottom, rgba(2, 5, 21, 0.8), rgba(2, 5, 21, 0.5), rgba(2, 5, 21, 0.8)',
                                            zIndex: 1,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0
                                        }}
                                        ></div>

                                        {/* posição do slide dentro da lista dos conteudos em 'trending' */}
                                        <div className='absolute h-16 w-16 bottom-0 left-0 bg-darkpurple flex items-center justify-center rounded-tr-xl rounded-bl-[5px] z-[3]'>
                                            <span className='text-4xl lg:text-5xl font-bold font-raleway text-white'>
                                                { index + 1 }
                                            </span>
                                        </div>

                                        {/* container com informações do filmes/serie */}
                                        <div className='absolute top-3 left-3 font-raleway pr-3 z-[2]'>
                                            <span className='text-neutral-400 text-lg'>
                                                { item.number_of_seasons ? 
                                                    `Temporadas (${item.number_of_seasons})` : null 
                                                }
                                            </span>

                                            <h4 className='text-xl font-bold'>
                                                { item.name }
                                            </h4>

                                            <span className='text-neutral-400 text-lg'>
                                                {getReleaseDate( item.first_air_date )}
                                            </span>
                                        </div>

                                        <button 
                                            onClick={() => router.push(`player/serie/${item.id}`, { scroll: true })}
                                            className='btn absolute bottom-2 right-4 w-[calc(100%-96px)] h-[54px] rounded-lg bg-orangered md:bg-orange-950 md:hover:bg-orangered z-[4] text-lg font-raleway font-medium duration-200 ease-linear outline-none border-none text-white md:text-neutral-400 md:hover:text-white'
                                            >
                                            <FaPlay className='text-xl'/> Ir para a série
                                        </button>
                                    </div>
                                </TrendingImageContainer>
                            ) : null
                        }
                    </SwiperSlide>
                ))}
            </SwiperDefaultConfig>

            <SwiperControllers navigation={props.navigation} swiperState={swiperState}/>
        </Style.SwiperContainer>
    );
};