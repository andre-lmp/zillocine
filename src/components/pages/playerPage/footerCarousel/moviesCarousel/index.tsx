// Hooks
import { useEffect, useState, useContext, MouseEvent } from "react";
import useFirebase from "@/components/hooks/firebaseHook";

// Hook personalizado do TMDB com funções de busca de conteudo
import useTmdbFetch from "@/components/hooks/tmdbHook";

// Componentes do Swiper.js
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/opacity.css';

import Link from "next/link";

// Contextos
import { UserDataContext } from "@/components/contexts/authenticationContext";
import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";

// Icones com React-icons
import { FaRegHeart, FaHeart, FaPlay } from "react-icons/fa";

import * as Style from '@/components/contentCarousel/styles';

import { useRouter } from "next/navigation";

type componentProps = {
    contentId: string;
    contentType: string;
};

export default function SimilarMovies( props: componentProps ) {

    const { fetchSimilarMovies } = useTmdbFetch();
    const [ contentData, setContentData ] = useState<tmdbObjProps[]>();
    const userData = useContext( UserDataContext );
    const { addUserFavoritesToDb, deleteUserFavoritesOnDb } = useFirebase();
    const globalEvents = useContext( GlobalEventsContext );
    const router = useRouter(); 

    const checkAvailability = ( data: tmdbObjProps[] ) => {
        const filtered = data.filter(( movie ) => ( movie.backdrop_path || movie.poster_path ) !== null );
        setContentData( filtered );
    };

    // Lida com a promise retornada pela função de busca de conteudo
    const fetchHandler = async ( fetchResponse: Promise<any> ) => {
        const response = await fetchResponse;
        if ( response ) {
            checkAvailability( response );
        };
    };

    useEffect(() => {
        fetchHandler(fetchSimilarMovies( props.contentId ));
    }, []);

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

    return contentData?.length && (
        <div className='px-4 w-full pt-8 pb-6 md:px-6 lg:px-8 font-noto_sans'>

            <p className="mb-1 text-[17px] font-medium xl:text-lg">Você pode gostar...</p>

            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>

            <Style.SwiperContainer>
                <Swiper
                    slidesPerGroupAuto
                    slidesPerView={'auto'}
                    spaceBetween={15}
                    navigation={{
                        prevEl: '.slide-prev-button',
                        nextEl: '.slide-next-button',
                    }}
                    modules={[ Navigation ]}
                >
                    {/* Gerando slides de filmes com base na resposta da api do TMDB */}
                    { contentData.map(( movie ) => (
                        <SwiperSlide key={ movie.id } style={{ width: 'auto', borderRadius: '4px', overflow: 'hidden'}}>
                                {
                                    // Link para o player
                                    movie.poster_path || movie.backdrop_path ? (
                                        <Style.imageBox>

                                            {/* Opção para adicionar o filme/serie aos favoritos */}
                                            <button 
                                                onClick={(e) => toggleFavoriteButton(e, movie.id)} 
                                                className={`${userData.favoriteMovies?.includes(movie.id) || userData.favoriteSeries?.includes(movie.id) ? 'favorite-button' : ''} absolute right-0 top-0 w-16 h-16 flex movies-start justify-end z-30`}
                                            >
                                                <FaRegHeart className="not-favorited text-2xl text-white/70 absolute top-3 right-3 md:text-[22px]"/>

                                                <FaHeart className="favorited text-2xl text-orangered absolute top-3 right-3  md:text-[22px]"/>
                                            </button>

                                            <div className="slide-wrapper" onClick={() => router.push(`/player/movie/${movie.id}`)}>
                                                <div className="relative image-container cursor-pointer">
                                                    {/* Imagem do filme */}
                                                    <LazyLoadImage
                                                        src={`https://image.tmdb.org/t/p/original/${movie.poster_path ?? movie.backdrop_path}`}
                                                        alt={`${movie.title} movie presentation image`}
                                                        width={176}
                                                        height={260}
                                                        loading="lazy"
                                                        effect="opacity"
                                                        placeholderSrc={`https://image.tmdb.org/t/p/w92/${movie.poster_path ?? movie.backdrop_path}`}
                                                        className='w-44 h-[270px] object-cover image bg-darkpurple'
                                                    />

                                                    <FaPlay className="play-icon text-4xl absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
                                                </div>
                                                
                                                {/* Informações do filme */}
                                                <div className="w-44 description flex flex-col gap-y-1 font-normal font-noto_sans text-sm">
                                                
                                                    {/* Titulo */}
                                                    <p className="font-raleway font-bold text-[15px] text-white line-clamp-1">{ movie.title ?? movie.name }
                                                    </p>
                                                    <div className="flex movies-center gap-x-3">
                                                        {/* Data de lançamento */}
                                                        <p className="bg-orangered rounded-[4px] flex movies-center w-fit px-3 h-5">{ getReleaseDate( movie.release_date ?? movie.first_air_date )}
                                                        </p>
                                                        {/* Nota do publico ao conteudo */}
                                                        <p className="font-medium text-sm text-white">nota: {( movie.vote_average).toFixed(0 )}</p>
                                                    </div>
                                                
                                                    {/* Descrição */}
                                                    <p className="line-clamp-2 text-neutral-300 leading-relaxed text-justif ">{ movie.overview.length > 3 ? movie.overview : 'Desculpe... não foi possível carregar a descrição deste conteúdo.' }
                                                    </p>
                                                </div>
                                            </div>
                                        </Style.imageBox>
                                    ) : null
                                }
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Botão para o slide anterior */}
                <div className='absolute left-0 top-1/2 -translate-y-1/2 z-50 w-[45px] h-[45px] rounded-full -translate-x-1/2 bg-deepnight cursor-pointer swiper-controllers slide-prev-button'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </div>
                
                {/* Botão para o proximo slide */}
                <div className='absolute right-0 top-1/2 -translate-y-1/2 z-50 w-[45px] h-[45px] rounded-full translate-x-1/2 bg-deepnight cursor-pointer swiper-controllers slide-next-button'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </Style.SwiperContainer>
        </div>
    );
};