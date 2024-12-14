'use client';

import { useEffect, useState, useRef } from "react";

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/opacity.css';

// Componentes do Swiper.js para carousel de slides
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import { SwiperContainer } from "@/components/contentCarousel/styles";

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// Hook personalizado do TMDB com funções de busca de conteudo
import useTmdbFetch from "@/components/hooks/tmdbHook";

// Modal que exibe as opções de temporadas da serie
import SelectSeason from "./seasonSelector";

type componentProps = {
    seasons: tmdbObjProps[];
    serieId: string;
    serieName: string;
};

export default function SerieSeansons( props: componentProps ) {

    const { fetchSerieSeasons } = useTmdbFetch();
    const [ seasonEpisodes, setSeasonEpisodes ] = useState<tmdbObjProps>();
    const [ selectedSeasonNumber, setSelectedSeasonNumber ] = useState<string>('1')
    const [ isLoading, setIsLoading ] = useState( true );
    const swiperRef = useRef<(SwiperRef | null)>( null );

    const swiperBreakPoints = {
        1024: { spaceBetween: 20 }
    };

     // Lida com a promise retornada por uma função de busca do useTmdbFetch
    const handleFetchResponse = async ( promise: Promise<tmdbObjProps> ) => {
        const response = await promise;
        if ( response ) {
            setIsLoading( false );
            setSeasonEpisodes( response );
            swiperRef.current?.swiper.slideTo(0)
        };
    };

    useEffect(() => {
        handleFetchResponse(fetchSerieSeasons( props.serieId, selectedSeasonNumber ));
    }, [ selectedSeasonNumber ]);

    /*Função que obtem o ano de lançamento de um filme ou serie*/
    const getReleaseDate = ( date: string ) => {
        if ( !date ) return
        const newDate = [];
        for ( let i = 0; i < 4; i++ ) {
            newDate.push( date[i] );
        }
        return newDate.join('');
    };

    // Obtem o tempo de duração de um filme
    const getRunTime = ( runtime: number ) => {

        if ( !runtime || runtime <= 0 ) return;

        if ( runtime < 60 ) {
            return <p className="font-noto_sans whitespace-nowrap text-base font-normal text-neutral-400">{ runtime }m</p>
        };

        const hours = ( runtime / 60 ).toFixed(0);
        const minites = runtime % 60;

        return  <p className="font-noto_sans whitespace-nowrap text-base font-normal text-neutral-300">{ hours }h { minites }m</p>
    };

    return seasonEpisodes?.episodes && !isLoading ? (
        <div className='px-4 w-full pt-8 pb-6 md:px-6 lg:px-8 font-noto_sans'>
            
            {/* Seletor de temporada */}
            <SelectSeason selectedSeason={setSelectedSeasonNumber} seasonsList={props.seasons}/>

            {/* Titulo da seção */}
            <p className="mb-1 text-[17px] font-medium xl:text-lg whitespace-nowrap max-w-full overflow-hidden text-ellipsis">{props.serieName} - {seasonEpisodes?.name}</p>
            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>

            <SwiperContainer>
                <Swiper
                    spaceBetween={15}
                    slidesPerGroupAuto
                    slidesPerView={'auto'}
                    navigation={{
                        prevEl: '.slide-prev-button',
                        nextEl: '.slide-next-button',
                    }}
                    modules={[ Navigation ]}
                    ref={swiperRef}
                    breakpoints={swiperBreakPoints}
                >
                    {/* Gerando slides apartir da lista de episodios retornados pela api do TMDB */}
                    { seasonEpisodes?.episodes.map(( episode: tmdbObjProps ) => (
                        episode.still_path && (

                            // Container do slide
                            <SwiperSlide
                                key={`episode-${episode.id}`}
                                style={{ width: 'auto', borderRadius: '4px', overflow: 'hidden'}}
                            >
                                <div className="w-80">
                                    {/* Imagem */}
                                    <LazyLoadImage
                                        src={`https://image.tmdb.org/t/p/original/${episode.still_path}`}
                                        alt={`${props.serieName} ${seasonEpisodes.name} presentation image`}
                                        width={400}
                                        height={176}
                                        loading="lazy"
                                        effect="opacity"
                                        placeholderSrc={`https://image.tmdb.org/t/p/w92/${episode.poster_path ?? episode.backdrop_path}`}
                                        className='w-80 h-44 object-cover bg-darkpurple'
                                    />

                                    {/* Tutilo do episodio */}
                                    <p className="text-base mt-2 line-clamp-1 font-bold leading-relaxed text-neutral-100">
                                        Ep_{ episode.episode_number && `${episode.episode_number}:` } { episode.name ?? '' }
                                    </p>

                                    <div className="my-2 flex gap-x-3">
                                        {/* Data de lançamento  */}
                                        <p className="bg-orangered rounded-[4px] flex items-center w-fit px-3 h-6 text-base font-normal">
                                            {getReleaseDate( episode.air_date )}
                                        </p>

                                        {/* Duração do episodio */}
                                        <p>{getRunTime( episode.runtime )}</p>
                                    </div>
                
                                    {/* Descrição */}
                                    <p className="text-base line-clamp-3 font-normal leading-relaxed text-neutral-400">
                                        { episode.overview.length > 3 ? episode.overview : 'Desculpe... não foi possível carregar a descrição deste conteúdo.' }
                                    </p>
                                </div>
                            </SwiperSlide>
                        )
                    ))}
                </Swiper>
                
                {/* Botão para voltar ao slide anterior */}
                <div className='absolute left-0 top-1/2 -translate-y-1/2 z-50 w-[45px] h-[45px] rounded-full -translate-x-1/2 bg-deepnight cursor-pointer swiper-controllers slide-prev-button'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </div>

                {/* Botão para ir ao proximo slide */}
                <div className='absolute right-0 top-1/2 -translate-y-1/2 z-50 w-[45px] h-[45px] rounded-full translate-x-1/2 bg-deepnight cursor-pointer swiper-controllers slide-next-button'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </SwiperContainer>
        </div>
    ) : null;
};