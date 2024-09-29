import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import 'swiper/css';

import useTmdbFetch from "@/components/hooks/tmdbHook";
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import Image from "next/image";
import Link from "next/link";


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

    return contentData?.length && (
        <div className='px-4 w-full pt-8 pb-6'>

            <p className="mb-1 text-lg font-medium font-roboto">Você pode gostar...</p>

            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>

            <Swiper
                slidesPerGroupAuto
                slidesPerView={'auto'}
                spaceBetween={15}
            >
                { contentData.map(( movie ) => (
                    <SwiperSlide key={ movie.id } style={{ width: 'auto', borderRadius: '4px', overflow: 'hidden'}}>
                            { 
                                movie.poster_path || movie.backdrop_path ? (
                                    <Link href={`/player/movie/${movie.id}`}>
                                        <Image
                                            src={`https://image.tmdb.org/t/p/original/${movie.poster_path ?? movie.backdrop_path}`}
                                            alt={`${movie.title} movie presentation image`}
                                            width={176}
                                            height={260}
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL={`https://image.tmdb.org/t/p/w92/${movie.poster_path ?? movie.backdrop_path}`}
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