import * as Style from '@/components/headerCarousel/styles';

import Image from 'next/image';
import Link from "next/link";

import { PiArrowElbowDownRightBold } from "react-icons/pi";

import { Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/element/css/autoplay';
import 'swiper/element/css/pagination';
import 'swiper/element/css/navigation';

type contentDataProps = Record<string, any>;

type carouselProps = {
    currentPage: string;
    contentData: contentDataProps[];
};

export function Carousel( props: carouselProps ) {

    /*Função que obtem o ano de lançamento de um filme ou serie*/
    const getReleaseDate = ( date: any[] ) => {
        const newDate = [];
        for ( let i = 0; i < 4; i++ ) {
            newDate.push( date[i] );
        }
        return newDate;
    };

    return (
        <Style.headerSlides>
            <Swiper
                slidesPerView={1}
                spaceBetween={0}
                autoplay={{ delay: 4000 }}
                speed={300}
                loop={true}
                direction='horizontal'
                pagination={{ clickable: true }}
                modules={[Pagination, Autoplay]}
            >
                { props.contentData.map((movie, index) => (
                   
                    <SwiperSlide key={ `${props.currentPage}-${index}` }>

                        <div>
                            {movie.backdrop_path || movie.backdrop_path ? (
                                <Image
                                    src={`https://image.tmdb.org/t/p/original${movie.poster_path ?? movie.backdrop_path}`}
                                    alt={`${movie.title ?? movie.name} movie/serie presentation image`}
                                    width={400}
                                    height={400}
                                    loading='lazy'
                                    placeholder="blur"
                                    blurDataURL={`https://image.tmdb.org/t/p/w92/${movie.poster_path ?? movie.backdrop_path}`}
                                    className='h-[660px] object-cover w-full'
                                />
                            ) : null }
                        </div>

                        <div className='w-full z-20 absolute bottom-10 px-4'>
                            <h1 className='font-raleway mx-auto font-extrabold text-3xl text-center line-clamp-1'>
                                { movie.title ?? movie.name }
                            </h1>

                            <h2 className='bg-orangered mx-auto my-3 rounded-md w-fit px-3 py-1 text-base font-medium font-noto_sans'>
                                    { getReleaseDate( movie.release_date ?? movie.first_air_date )}
                            </h2>

                            <p className='line-clamp-2 text-center w-full mb-4 font-noto_sans text-base'>
                                { movie.overview.length > 3 ? movie.overview : `O lançamento de um dos mais aguardados filmes de uma sequencia de sucesso` }
                            </p>

                            <Link href={`/player/${ props.currentPage === 'home' || props.currentPage === 'movies' ? 'movie' : 'serie' }/${movie.id}`}>
                                <button className='w-full mx-auto outline-none h-12 btn text-white rounded-md text-base font-noto_sans font-semibold bg-darkslateblue flex justify-center items-center relative '>
                                    <PiArrowElbowDownRightBold className='absolute left-3 top-1/2 -translate-y-1/2' />
                                    Ir para { props.currentPage === 'home' || props.currentPage === 'movies' ? 'o filme' : 'a serie' }
                                </button>
                            </Link>

                        </div>

                        <div className="overlay"></div>
                    </SwiperSlide>
                ))}

            </Swiper>

        </Style.headerSlides>
    );
};