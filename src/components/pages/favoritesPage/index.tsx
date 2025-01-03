'use client';

import { useState, useEffect, useContext } from "react";
import useTmdbFetch from "@/components/hooks/tmdb";
import useFirebase from "@/components/hooks/firebase";
import { useRouter } from "next/navigation";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import { FaPlay } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

import { UserDataContext } from "@/components/contexts/authenticationContext";

import { FavoritesContainer } from "./style";

import { checkAvailability } from "@/components/utils/tmdbApiData/availability";
import { getReleaseDate } from "@/components/utils/tmdbApiData/releaseDate";
import { getRunTime } from "@/components/utils/tmdbApiData/runtime";
import { getCompanyLogo } from "@/components/utils/tmdbApiData/producerLogo";
import { getImdbReviews } from "@/components/utils/tmdbApiData/reviews";

export default function FavoritesPage() {

    const [ contentData, setContentData ] = useState<tmdbObjProps[]>([]);
    const { fetchMoviesByIdList, fetchSeriesByIdList } = useTmdbFetch();
    const userData = useContext( UserDataContext );
    const { deleteUserFavoritesOnDb } = useFirebase();
    const [ isLoading, setIsLoading ] = useState( true );
    const router = useRouter();

    const nextNavigate = ( content: tmdbObjProps ) => {
        const contentObjKeys = Object.keys( content );

        if (contentObjKeys.includes( 'first_air_date' )) {
            router.push(`player/serie/${content.id}`, { scroll: true });
        };

        if (!contentObjKeys.includes( 'first_air_date' )) {
            router.push(`player/movie/${content.id}`, { scroll: true });
        };
    };

    // Busca os filmes e series salvos como favoritos pelo usuario
    const fetchUserFavorites = async () => {
        const movies = [];
        const series = [];

        if ( userData.favoriteMovies ) {
            const response = await fetchMoviesByIdList( userData.favoriteMovies );
            movies.push( ...response );
        };

        if ( userData.favoriteSeries ) {
            const response = await fetchSeriesByIdList( userData.favoriteSeries );
            series.push( ...response );
        };

        const filtered = await checkAvailability([ ...movies, ...series ]);
        setContentData( filtered );
        setIsLoading( false );
    };

    useEffect(() => {
        if ( userData.isLoggedIn ) {
            if ( userData.favoriteMovies || userData.favoriteSeries ) {
                fetchUserFavorites();
                return;
            };
            
            setContentData([]);
            setIsLoading( false );
            return;
        };

        setIsLoading( false );
    }, [ userData.favoriteMovies, userData.favoriteSeries, userData.isLoggedIn ]);

    const deleteFavorite = ( content: tmdbObjProps ) => {
        const contentObjKeys = Object.keys( content );

        if (contentObjKeys.includes( 'first_air_date' )) {
            deleteUserFavoritesOnDb( content.id, 'serie' );
        };

        if (!contentObjKeys.includes( 'first_air_date' )) {
            deleteUserFavoritesOnDb( content.id, 'movie' );
        };
    };

    return !isLoading ? (
        userData.isLoggedIn ? (
            contentData.length ? (
                <div className="px-4 md:px-6 lg:px-8 mt-32 mb-10 min-h-[calc(100vh-128px)]">
                    <h1 className="text-xl text-white font-raleway font-bold">Minha lista de favoritos</h1>
                    <div className="w-full h-0.5 rounded-3xl bg-white/10 mt-1"></div>

                    {/* Seção de aprensentação do filmes e series favoritos */}
                    <FavoritesContainer>
                        { contentData.map( content => (
                            // Container de apresentação com informações do filme/serie
                            <div key={`favorites-${content.id}`} className="w-full flex flex-row gap-x-3">
                                <div className="w-1/3 max-w-md max-h-56 aspect-[16/9] rounded-md overflow-hidden">
                                    {/* Imagem do filme/serie */}
                                    <LazyLoadImage
                                        src={`https://image.tmdb.org/t/p/original${content.poster_path ?? content.backdrop_path}`}
                                        alt={`${content.title ?? content.name} movie/serie presentation image`}
                                        width={'100%'}
                                        height={'100%'}
                                        placeholderSrc={`https://image.tmdb.org/t/p/w92/${content.poster_path ?? content.backdrop_path}`}
                                        className='bg-darkpurple object-cover w-full h-full'
                                        effect='opacity'
                                    />
                                </div>

                                {/* Detalhes do filme/serie */}
                                <div className="w-2/3 flex flex-col items-start">
                                    <h3 className="font-raleway font-bold text-xl line-clamp-1">{ content.title ?? content.name }</h3>

                                    <div className='flex gap-x-4 sm:gap-x-6 gap-y-3 flex-nowrap items-center mt-2 overflow-hidden justify-center md:justify-start'>

                                        {/* Ano de lançamento */}
                                        <p className='bg-orangered rounded-md w-fit px-3 h-7 flex items-center text-base font-normal font-noto_sans md:mx-0'>
                                            { getReleaseDate( content.release_date ?? content.first_air_date )}
                                        </p>

                                        {/* Numero de temporadas */}
                                        { content.seasons?.length > 0 && <p className="hidden sm:inline font-noto_sans whitespace-nowrap text-base font-normal text-neutral-400">{content.seasons.length} Temporada(s)</p> }

                                        {/* Tempo de duração */}
                                        {getRunTime( content.runtime ?? null )}

                                        {/* Nota do publico ao conteudo */}
                                        {getImdbReviews( content.vote_average, content.vote_count )}

                                        {/* Logo da produtora */}
                                        <div className='hidden 2xl:inline'>
                                            {getCompanyLogo( content.production_companies )}
                                        </div>

                                        <AiFillDelete className="text-2xl text-orangered/60 md:hover:text-orangered cursor-pointer" onClick={() => {deleteFavorite( content )}}/>
                                    </div>

                                    <p className="my-3 text-[17px] font-noto_sans font-normal text-neutral-400 leading-relaxed line-clamp-3">{ content.overview }</p>

                                    <button onClick={() => {nextNavigate( content )}} className="px-20 btn bg-white/10 hover:bg-white/10 text-[17px] font-noto_sans font-normal text-white border-none outline-none rounded-md cursor-pointer">
                                        <FaPlay className="text-[15px]"/>
                                        Assitir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </FavoritesContainer>
                </div>
            ) : (
                // Caso a lista de favoritos esteja vazia
                <div className="px-4 md:px-6 lg:px-8 w-full h-auto absolute top-32 left-0">
                    <h1 className="font-raleway font-bold text-xl text-white">
                        Sua lista de favoritos está vazia
                    </h1>

                    <div className="w-full h-0.5 rounded-3xl bg-white/10 mt-1"></div>
                    
                    <p className="font-noto_sans font-normal text-[17px] text-neutral-400">Marque filmes e series como favoritos para que eles apareçam aqui.</p>
                </div>
            )
        ) : (
            // Caso o usuario nao esteja authenticado
            <div className="px-4 md:px-6 lg:px-8 w-full h-auto absolute top-32 left-0">
                <h1 className="font-raleway font-bold text-xl text-white">Usuário não registrado</h1>

                <div className="w-full h-0.5 rounded-3xl bg-white/10 mt-1"></div>

                <p className="font-noto_sans font-normal text-[17px] text-neutral-400">Faça login ou crie uma conta para ver seus favoritos.</p>
            </div>
        )
    ) : (
        // Animação de loading durante o carregamento dos dados
        <div className='w-full h-screen fixed z-30 flex justify-center items-center'>
            <span className="loading loading-spinner loading-lg text-neutral-400"></span>
        </div>
    )
};