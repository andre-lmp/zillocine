'use client';

import { useContext, MouseEvent, useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useFirebase from "@/components/hooks/firebaseHook";

import * as Style from '@/components/contentCarousel/styles';

// Componentes do Swiper.js para carousel de slides
import { SwiperSlide } from "swiper/react";
import SwiperDefaultConfig from '../swiperDefaultConfig';

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

// Icones com React-icons
import { FaRegHeart, FaHeart, FaPlay, FaStar } from "react-icons/fa";

import { UserDataContext } from '@/components/contexts/authenticationContext';
import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";

import { tmdbObjProps } from '@/components/contexts/tmdbContext';
import SwiperControllers from '../carouselControlArrows';

type CarouselProps = {
    navigation: { nextEl: string, prevEl: string };
    contentType: string;
    contentData: tmdbObjProps[];
};

export default function MoviesCarousel( props: CarouselProps ) {
    
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
                addUserFavoritesToDb( contentId, props.contentType );
            } else {
                deleteUserFavoritesOnDb( contentId, props.contentType );
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
                {props.contentData.map((item) => (
                    <SwiperSlide
                        key={`main-slides-${item.id}`}
                        style={{ width: 'auto', borderRadius: '4px', overflow: 'hidden' }}
                    >
                        {
                            item.poster_path || item.backdrop_path ? (
                                <div className="max-w-44 overflow-hidden">
                                    <Style.imageBox>
                                        {/* Opção para adicionar o filme/serie aos favoritos */}
                                        <button
                                            onClick={(e) => toggleFavoriteButton(e, item.id)}
                                            className={`${userData.favoriteMovies?.includes(item.id) || userData.favoriteSeries?.includes(item.id) ? 'favorite-button' : ''} absolute right-0 top-0 w-16 h-16 flex items-start justify-end z-30`}
                                        >
                                            <FaRegHeart className="not-favorited text-white absolute top-3 right-3 text-[22px]" />
                                            <FaHeart className="favorited text-orangered absolute top-3 right-3 text-[22px]" />
                                        </button>
                                        <FaPlay className="play-icon" onClick={() => router.push(`/player/${props.contentType}/${item.id}`, {scroll: true})} />
                                        {/* Imagem do conteudo a ser exibido */}
                                        <div className="w-full relative cursor-pointer h-60 md:h-64" onClick={() => router.push(`/player/${props.contentType}/${item.id}`, {scroll: true})}>
                                            <LazyLoadImage
                                                src={`https://image.tmdb.org/t/p/original${item.poster_path ?? item.backdrop_path}`}
                                                alt={`${item.title ?? item.name} movie/serie presentation image`}
                                                width={176}
                                                effect="opacity"
                                                height={'100%'}
                                                placeholderSrc={`https://image.tmdb.org/t/p/w92/${item.poster_path ?? item.backdrop_path}`}
                                                className='image w-44 h-full object-cover bg-darkpurple rounded-md'
                                            />
                                        </div>
                                    </Style.imageBox>
                                    {/* Container de informações sobre o conteudo */}
                                    <div className="mt-2 relative pl-3">
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5/6 bg-neutral-400 rounded-md"></div>
                                        {/* Titulo */}
                                        <p className="font-raleway font-bold text-[15px] text-white line-clamp-1">{item.title ?? item.name}</p>
                                        <div className="flex items-center gap-x-3 font-normal font-noto_sans text-neutral-400">
                                            {/* Data de lançamento */}
                                            <p className="text-[15px]">
                                                {getReleaseDate(item.release_date ?? item.first_air_date)}
                                            </p>
                                            {/* Nota do publico ao conteudo */}
                                            <p className="text-[15px] flex items-center gap-x-1">
                                                <FaStar className="" />
                                                {(item.vote_average).toFixed(0)}/10
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        }
                    </SwiperSlide>
                ))}
            </SwiperDefaultConfig>

            <SwiperControllers navigation={props.navigation} swiperState={swiperState}/>
        </Style.SwiperContainer>
    );
};