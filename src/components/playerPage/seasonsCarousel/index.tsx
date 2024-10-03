import { useEffect, useState } from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/opacity.css';

import { Swiper, SwiperSlide } from "swiper/react";

import 'swiper/css';

import { tmdbObjProps } from "@/components/contexts/tmdbContext";
import useTmdbFetch from "@/components/hooks/tmdbHook";

import SelectSeason from "../seasonSelector";

type componentProps = {
    seasons: tmdbObjProps[];
    serieId: string;
    serieName: string;
};

export default function SerieSeansons( props: componentProps ) {
    const swiperBreakPoints = {
        1024: { spaceBetween: 20 }
    };

    const { fetchSerieSeasons } = useTmdbFetch();
    const [ seasonEpisodes, setSeasonEpisodes ] = useState<tmdbObjProps>();
    const [ selectedSeasonNumber, setSelectedSeasonNumber ] = useState<string>('1')
    const [ isLoading, setIsLoading ] = useState( true );

    const fetchHandler = async ( fetchResponse: Promise<any> ) => {
        const response = await fetchResponse;
        if ( response ) {
            setIsLoading( false );
            setSeasonEpisodes( response );
        };
    };

    useEffect(() => {
        setIsLoading( true );
        fetchHandler(fetchSerieSeasons( props.serieId, selectedSeasonNumber ));
    }, [ selectedSeasonNumber ]);

    /*Função que obtem o ano de lançamento de um filme ou serie*/
    const getReleaseDate = ( date: any[] ) => {
        if ( !date ) return
        const newDate = [];
        for ( let i = 0; i < 4; i++ ) {
            newDate.push( date[i] );
        }
        return newDate;
    };

    const getRunTime = ( runtime: number ) => {

        if ( !runtime || runtime <= 0 ) return;

        if ( runtime < 60 ) {
            return <p className="font-noto_sans whitespace-nowrap text-base font-normal text-neutral-400">{ runtime }m</p>
        };

        const hours = ( runtime / 60 ).toFixed(0);
        const minites = runtime % 60;

        return  <p className="font-noto_sans whitespace-nowrap text-base font-normal text-neutral-300">{ hours }h { minites }m</p>
    };

    return seasonEpisodes?.episodes ? (
        <div className='px-4 w-full pt-8 pb-6 md:px-6 lg:px-8'>
            <SelectSeason selectedSeason={setSelectedSeasonNumber} seasonsList={props.seasons}/>

            { seasonEpisodes.episodes[0].still_path && !isLoading &&
                <>
                    <p className="mb-1 text-[17px] font-medium font-roboto xl:text-lg">{props.serieName} - {seasonEpisodes?.name}</p>
                    <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>

                    <Swiper
                        spaceBetween={15}
                        slidesPerGroupAuto
                        slidesPerView={'auto'}
                        breakpoints={swiperBreakPoints}
                    >
                        { seasonEpisodes?.episodes.map(( episode: tmdbObjProps ) => (
                            episode.still_path && (
                                <SwiperSlide 
                                    key={`${episode.id}-${episode._id}`} 
                                    style={{ width: 'auto', borderRadius: '4px', overflow: 'hidden'}}
                                >
                                    <div className="w-80">
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

                                        <p className="font-noto_sans text-base mt-2 line-clamp-1 font-bold leading-relaxed text-neutral-100">
                                            Ep_{ episode.episode_number && `${episode.episode_number}:` } { episode.name ?? '' }
                                        </p>

                                        <div className="my-2 flex gap-x-3">
                                            <p className="bg-orangered rounded-[4px] flex items-center w-fit px-3 h-6 text-base font-normal font-noto_sans">
                                                {getReleaseDate( episode.air_date )}
                                            </p>

                                            <p>{getRunTime( episode.runtime )}</p>
                                        </div>
                                        
                                        <p className="font-noto_sans text-base line-clamp-3 font-normal leading-relaxed text-neutral-300">
                                            { episode.overview.length > 3 ? episode.overview : 'Desculpe... não foi possível carregar a descrição deste conteúdo.' }
                                        </p>
                                    </div>
                                </SwiperSlide> 
                            )
                        ))}
                    </Swiper>
                </>
            }
    </div>
    ) : null;
};