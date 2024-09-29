'use client'

import { Swiper, SwiperSlide } from "swiper/react";

import 'swiper/css';

import useTmdbFetch from "@/components/hooks/tmdbHook";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";

type carouselProps = {
    sectionTitle: string | null
    contentType: string;
    contentGenre: string;
    pageNumber: number;
};

export default function ContentCarousel( props: carouselProps ) {
    const { fetchMovies, fetchReleasedMovies, fetchSeries, fetchReleasedSeries } = useTmdbFetch();
    const [ contentData, setContentData ] = useState<any[]>([]);

    useEffect(() => {
        const fetchHandler = async ( fetchContent: Promise<any> ) => {
            const response = await fetchContent;
            if ( response.length ) {
                rmUnavailableContent( response );
            };
        };

       if ( props.contentType === 'movie' ) {
            props.contentGenre !== 'release' ? fetchHandler(fetchMovies( props.contentGenre, props.pageNumber )) : fetchHandler(fetchReleasedMovies( props.pageNumber ));
       } else {
            props.contentGenre !== 'release' ? fetchHandler(fetchSeries( props.contentGenre, props.pageNumber )) : fetchHandler(fetchReleasedSeries( props.pageNumber ));
       };

    }, [props.contentGenre ]);

    const rmUnavailableContent = ( data: any[] ) => {
        const filtered = data.filter(( item ) => ( item.backdrop_path || item.poster_path ) !== null );
        setContentData( filtered );
    };

    return contentData.length && (
        <div className='px-4 w-full'>

            { props.sectionTitle && <p className="mb-1 text-lg font-medium font-roboto">{ props.sectionTitle }</p> }

            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>

            <Swiper
                slidesPerGroupAuto
                slidesPerView={'auto'}
                spaceBetween={15}
            >
                { contentData.map(( item ) => (
                    <SwiperSlide key={ item.id } style={{ width: 'auto', borderRadius: '4px', overflow: 'hidden'}}>
                            { 
                                item.poster_path || item.backdrop_path ? (
                                    <Link href={`/player/${ props.contentType }/${item.id}`}>
                                        <Image
                                            src={`https://image.tmdb.org/t/p/original${item.poster_path ?? item.backdrop_path}`}
                                            alt={`${item.title ?? item.name} movie/serie presentation image`}
                                            width={176}
                                            height={260}
                                            placeholder="blur"
                                            blurDataURL={`https://image.tmdb.org/t/p/w92/${item.poster_path ?? item.backdrop_path}`}
                                            className='w-44 h-[260px] object-cover bg-neutral-700'
                                        />
                                    </Link>
                                ) : null 
                            }
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};