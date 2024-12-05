'use client';

import { useEffect, useState, MouseEvent, useContext } from "react";
import { useRouter } from 'next/navigation';

// Hook personalizado do TMDB com funções de busca de conteudo
import useTmdbFetch from "@/components/hooks/tmdbHook";
import useFirebase from "@/components/hooks/firebaseHook";

// Componentes do Swiper.js para carousel de slides
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

// Icones com React-icons
import { FaRegHeart, FaHeart, FaPlay, FaStar } from "react-icons/fa";

// // Interface de tipo para objetos retornados pela api do TMDB
import { tmdbObjProps } from "../contexts/tmdbContext";

import { UserDataContext } from "../contexts/authenticationContext";
import { GlobalEventsContext } from "../contexts/globalEventsContext";

import * as Style from './styles';

type carouselProps = {
    sectionTitle: string | null
    contentType: string;
    contentGenre: string;
    pageNumber: number;
    navigation: { nextEl: string, prevEl: string };
};

export default function ContentCarousel( props: carouselProps ) {

    const [ contentData, setContentData ] = useState<tmdbObjProps[]>([]);
    const [ isLoading, setIsLoading ] = useState( true );
    const swiperBreakPoints = { 1024: { spaceBetween: 20 }};
    const { fetchMovies, fetchReleasedMovies, fetchSeries, fetchReleasedSeries } = useTmdbFetch();
    const userData = useContext( UserDataContext );
    const { addUserFavoritesToDb, deleteUserFavoritesOnDb } = useFirebase();
    const globalEvents = useContext( GlobalEventsContext );
    const router = useRouter(); 

    // Lida com a promise retornada por uma função de busca do useTmdbFetch
    const fetchHandler = async ( fetchContent: Promise<any> ) => {
        const response = await fetchContent;
        if ( response.length ) {
            checkAvailability( response );
        };
    };

    useEffect(() => {
        // Define qual o tipo do conteudo a ser buscado com base na pagina atual
       if ( props.contentType === 'movie' ) {
            if ( props.contentGenre !== 'release' ) {
                fetchHandler(fetchMovies( props.contentGenre, props.pageNumber ));
            } else {
                fetchHandler(fetchReleasedMovies( props.pageNumber ));
            }
       } else {
            if ( props.contentGenre !== 'release' ) {
                fetchHandler(fetchSeries( props.contentGenre, props.pageNumber ));
            } else {
                fetchHandler(fetchReleasedSeries( props.pageNumber ));
            }
       };

    }, [ props.contentGenre ]);

    useEffect(() => {
        setIsLoading( false );
    }, []);

    /*Função que obtem o ano de lançamento de um filme ou serie*/
    const getReleaseDate = ( date: string ) => {
        if ( !date ) return;
        const newDate = [];
        for ( let i = 0; i < 4; i++ ) {
            newDate.push( date[i] );
        }
        return newDate.join('');
    };

    const checkAvailability = ( data: tmdbObjProps[] ) => {
        const filtered = data.filter(( item ) => ( item.backdrop_path || item.poster_path ) !== null );
        setContentData( filtered );
    };

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

    return contentData.length ? (
        <div style={{ opacity: isLoading ? 0 : 1 }} className='px-4 w-full md:px-6 lg:px-8 ease-linear duration-200'>

            { props.sectionTitle && (
                <p className="mb-1 text-[17px] font-medium font-noto_sans xl:text-lg">{ props.sectionTitle }</p>
            )}

            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>

            {/* Carousel de slides */}
            <Style.SwiperContainer>
                <Swiper
                    slidesPerGroupAuto
                    slidesPerView={'auto'}
                    spaceBetween={15}
                    navigation={{
                        nextEl: `.${props.navigation.nextEl}`,
                        prevEl: `.${props.navigation.prevEl}`,
                    }}
                    breakpoints={swiperBreakPoints}
                    modules={[ Navigation ]}
                    resistanceRatio={0.1}
                >

                    {/* Gerando slides a partir de um array de objetos retornados pela api do TMDB */}
                    { contentData.map(( item ) => (

                        <SwiperSlide 
                            key={`main-slides-${item.id}`} 
                            style={{ width: 'auto', borderRadius: '4px', overflow: 'hidden'}}
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
                                                    <FaRegHeart className="not-favorited text-white absolute top-3 right-3 text-[22px]"/>
                                                    <FaHeart className="favorited text-orangered absolute top-3 right-3 text-[22px]"/>
                                                </button>

                                                <FaPlay className="play-icon" onClick={() => router.push(`/player/${props.contentType}/${item.id}`)}/>
                                            
                                                {/* Imagem do conteudo a ser exibido */}
                                                <div className="w-full relative cursor-pointer h-60 md:h-64" onClick={() => router.push(`/player/${props.contentType}/${item.id}`)}>
                                                    <LazyLoadImage
                                                        src={`https://image.tmdb.org/t/p/original${item.poster_path ?? item.backdrop_path}`}
                                                        alt={`${item.title ?? item.name} movie/serie presentation image`}
                                                        width={176}
                                                        effect="opacity"
                                                        height={'100%'}
                                                        placeholderSrc={`https://image.tmdb.org/t/p/w92/${item.poster_path ?? item.backdrop_path}`}
                                                        className='image w-44 object-cover bg-darkpurple rounded-md'
                                                    />
                                                </div>
                                            </Style.imageBox>

                                            {/* Container de informações sobre o conteudo */}
                                            <div className="mt-2 relative pl-3">
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5/6 bg-orangered rounded-md"></div>

                                                {/* Titulo */}
                                                <p className="font-raleway font-bold text-[15px] text-white line-clamp-1">{ item.title ?? item.name }</p>

                                                <div className="flex items-center gap-x-3 font-normal font-noto_sans text-neutral-400">
                                                    {/* Data de lançamento */}
                                                    <p className="text-[15px]">
                                                        {getReleaseDate( item.release_date ?? item.first_air_date )}
                                                    </p>

                                                    {/* Nota do publico ao conteudo */}
                                                    <p className="text-[15px] flex items-center gap-x-1">
                                                        <FaStar className=""/> 
                                                        {( item.vote_average).toFixed(0 )}/10
                                                    </p>
                                                </div>
                                            </div>
                                        </div> 
                                    ) : null
                                }
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Botão para o slide anterior */}
                <div className={`absolute left-0 top-[260px] -translate-y-[140px] z-50 w-[45px] h-[45px] rounded-full -translate-x-1/2 bg-deepnight cursor-pointer swiper-controllers ${props.navigation.prevEl}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </div>

                {/* Botão para o proximo slide */}
                <div className={`absolute right-0 top-[260px] -translate-y-[140px] z-50 w-[45px] h-[45px] rounded-full translate-x-1/2 bg-deepnight cursor-pointer swiper-controllers ${props.navigation.nextEl}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </Style.SwiperContainer>
        </div>
    ) : null;
};