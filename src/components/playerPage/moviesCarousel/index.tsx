import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { SwiperContainer } from "@/components/contentCarousel/styles";
import 'swiper/css';

import useTmdbFetch from "@/components/hooks/tmdbHook";
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import Link from "next/link";

import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/opacity.css';

import * as Style from '@/components/contentCarousel/styles';

type componentProps = {
    contentId: string;
    contentType: string;
};

export default function SimilarMovies( props: componentProps ) {

    const { fetchSimilarMovies } = useTmdbFetch();
    const [ contentData, setContentData ] = useState<tmdbObjProps[]>();


    const checkAvailability = ( data: any[] ) => {
        const filtered = data.filter(( movie ) => ( movie.backdrop_path || movie.poster_path ) !== null );
        setContentData( filtered );
    };

    const fetchHandler = async ( fetchResponse: Promise<any> ) => {
        const response = await fetchResponse;
        if ( response ) {
            console.log( response )
            checkAvailability( response );
        };
    };

    useEffect(() => {
        fetchHandler(fetchSimilarMovies( props.contentId ));
    }, []);

    /*Função que obtem o ano de lançamento de um filme ou serie*/
    const getReleaseDate = ( date: any[] ) => {
        if ( !date ) return
        const newDate = [];
        for ( let i = 0; i < 4; i++ ) {
            newDate.push( date[i] );
        }
        return newDate;
    };

    return contentData?.length && (
        <div className='px-4 w-full pt-8 pb-6 md:px-6 lg:px-8'>

            <p className="mb-1 text-[17px] font-medium font-roboto xl:text-lg">Você pode gostar...</p>

            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>

            <SwiperContainer>
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
                    { contentData.map(( movie ) => (
                        <SwiperSlide key={ movie.id } style={{ width: 'auto', borderRadius: '4px', overflow: 'hidden'}}>
                                {
                                    movie.poster_path || movie.backdrop_path ? (
                                        <Link href={`/player/movie/${movie.id}`}>
                                            <Style.imageBox>
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
                                                <div className="w-44 description flex flex-col gap-y-1 font-normal font-noto_sans text-sm">
                                                    <p className="font-raleway font-bold text-[15px] text-white line-clamp-1">{ movie.title ?? movie.name }
                                                    </p>
                                                    <div className="flex movies-center gap-x-3">
                                                        <p className="bg-orangered rounded-[4px] flex movies-center w-fit px-3 h-5">{ getReleaseDate( movie.release_date ?? movie.first_air_date )}
                                                        </p>
                                                        <p className="font-medium text-sm text-white">nota: {( movie.vote_average).toFixed(0 )}</p>
                                                    </div>
                                                    <p className="line-clamp-2 text-neutral-200 leading-relaxed text-justif ">{ movie.overview.length > 3 ? movie.overview : 'Desculpe... não foi possível carregar a descrição deste conteúdo.' }
                                                    </p>
                                                </div>
                                            </Style.imageBox>
                                        </Link>
                                    ) : null
                                }
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className='absolute left-0 top-1/2 -translate-y-1/2 z-50 w-[45px] h-[45px] rounded-full -translate-x-1/2 bg-deepnight cursor-pointer swiper-controllers slide-prev-button'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </div>
                
                <div className='absolute right-0 top-1/2 -translate-y-1/2 z-50 w-[45px] h-[45px] rounded-full translate-x-1/2 bg-deepnight cursor-pointer swiper-controllers slide-next-button'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </SwiperContainer>
        </div>
    );
};