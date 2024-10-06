'use client'

import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import useTmdbFetch from "@/components/hooks/tmdbHook";

import Link from "next/link";
import * as Style from './styles';

type carouselProps = {
    sectionTitle: string | null
    contentType: string;
    contentGenre: string;
    pageNumber: number;
    navigation: { nextEl: string, prevEl: string };
};

export default function ContentCarousel( props: carouselProps ) {
    const swiperBreakPoints = {
        1024: { spaceBetween: 17 }
    };

    const { fetchMovies, fetchReleasedMovies, fetchSeries, fetchReleasedSeries } = useTmdbFetch();
    const [ contentData, setContentData ] = useState<any[]>([]);

    useEffect(() => {
        const fetchHandler = async ( fetchContent: Promise<any> ) => {
            const response = await fetchContent;
            if ( response.length ) {
                checkAvailability( response );
            };
        };

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

    }, [props.contentGenre ]);

    /*Função que obtem o ano de lançamento de um filme ou serie*/
    const getReleaseDate = ( date: any[] ) => {
        if ( !date ) return
        const newDate = [];
        for ( let i = 0; i < 4; i++ ) {
            newDate.push( date[i] );
        }
        return newDate;
    };

    const checkAvailability = ( data: any[] ) => {
        const filtered = data.filter(( item ) => ( item.backdrop_path || item.poster_path ) !== null );
        setContentData( filtered );
    };

    return contentData.length && (
        <div className='px-4 w-full md:px-6 lg:px-8'>

            { props.sectionTitle && <p className="mb-1 text-[17px] font-medium font-roboto xl:text-lg">{ props.sectionTitle }</p> }

            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>

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
                >
                    { contentData.map(( item ) => (
                        <SwiperSlide key={ item.id } style={{ width: 'auto', borderRadius: '4px', overflow: 'hidden'}}>
                                {
                                    item.poster_path || item.backdrop_path ? (
                                        <Link href={`/player/${ props.contentType }/${item.id}`}>
                                            <Style.imageBox>
                                                <LazyLoadImage
                                                    src={`https://image.tmdb.org/t/p/original${item.poster_path ?? item.backdrop_path}`}
                                                    alt={`${item.title ?? item.name} movie/serie presentation image`}
                                                    width={176}
                                                    height={260}
                                                    effect="opacity"
                                                    placeholderSrc={`https://image.tmdb.org/t/p/w92/${item.poster_path ?? item.backdrop_path}`}
                                                    className='w-44 h-[267px] object-cover bg-darkpurple image rounded'
                                                />
                
                                                <div className="w-44 description flex flex-col gap-y-1 font-normal font-noto_sans text-sm">
                                                    <p className="font-raleway font-bold text-[15px] text-white line-clamp-1">{ item.title ?? item.name }
                                                    </p>
                                                    <div className="flex items-center gap-x-3">
                                                        <p className="bg-orangered rounded-[4px] flex items-center w-fit px-3 h-5">{getReleaseDate( item.release_date ?? item.first_air_date )}
                                                        </p>
                                                        <p className="font-medium text-sm text-white">nota: {( item.vote_average).toFixed(0 )}</p>
                                                    </div>
                                                    <p className="line-clamp-2 text-neutral-200 leading-relaxed text-justif ">{ item.overview.length > 3 ? item.overview : 'Desculpe... não foi possível carregar a descrição deste conteúdo.' }
                                                    </p>
                                                </div>
                                            </Style.imageBox>
                                        </Link>
                                    ) : null
                                }
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className={`absolute left-0 top-1/2 -translate-y-1/2 z-50 w-[45px] h-[45px] rounded-full -translate-x-1/2 bg-deepnight cursor-pointer swiper-controllers ${props.navigation.prevEl}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </div>

                <div className={`absolute right-0 top-1/2 -translate-y-1/2 z-50 w-[45px] h-[45px] rounded-full translate-x-1/2 bg-deepnight cursor-pointer swiper-controllers ${props.navigation.nextEl}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </Style.SwiperContainer>
        </div>
    );
};