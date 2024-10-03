import * as Style from '@/components/headerCarousel/styles';

import Link from "next/link";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import { PiArrowElbowDownRightBold } from "react-icons/pi";

import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-fade';
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
                resistance={false}
                loop={true}
                direction='horizontal'
                pagination={{ clickable: true }}
                modules={[ Pagination, Autoplay, EffectFade ]}
            >
                { props.contentData.map((movie, index) => (
                   
                    <SwiperSlide key={ `${props.currentPage}-${index}` }>

                        <div>
                            {movie.backdrop_path || movie.backdrop_path ? (
                                <LazyLoadImage
                                    src={`https://image.tmdb.org/t/p/original${movie.poster_path ?? movie.backdrop_path}`}
                                    alt={`${movie.title ?? movie.name} movie/serie presentation image`}
                                    effect='opacity'                                   
                                    placeholderSrc={`https://image.tmdb.org/t/p/w92/${movie.poster_path ?? movie.backdrop_path}`}
                                    className='h-[660px] bg-darkpurple object-cover w-screen md:h-[580px]'
                                />
                            ) : null }
                        </div>

                        <div className='w-full z-20 absolute bottom-10 pl-4 md:bottom-14 md:pl-6 lg:pl-8'>
                            <h1 className='font-raleway mx-auto w-3/4 font-extrabold text-3xl text-center line-clamp-2 sm:line-clamp-2 md:mx-0 md:text-left md:max-w-xs lg:max-w-sm xl:max-w-md'>
                                { movie.title ?? movie.name }
                            </h1>

                            <p className='bg-orangered mx-auto my-3 rounded-md w-fit px-3 py-1 text-base font-medium font-noto_sans md:mx-0'>
                                    { getReleaseDate( movie.release_date ?? movie.first_air_date )}
                            </p>

                            <p className='line-clamp-2 text-center w-full mb-4 font-noto_sans text-base md:max-w-xs md:text-left text-neutral-200 xl:max-w-md lg:text-[17px] lg:line-clamp-3 lg:max-w-sm leading-relaxed'>
                                { movie.overview.length > 3 ? movie.overview : `O lançamento de um dos mais aguardados filmes de uma sequencia de sucesso` }
                            </p>

                            <Link href={`/player/${ props.currentPage === 'home' || props.currentPage === 'movies' ? 'movie' : 'serie' }/${movie.id}`}>
                                <button className='w-full mx-auto outline-none h-12 btn text-white rounded-md text-base font-noto_sans font-semibold bg-darkslateblue flex justify-center items-center relative md:w-fit md:px-14 md:rounded-lg md:mx-0 hover:bg-darkslateblue'>
                                    <PiArrowElbowDownRightBold className='absolute left-3 top-1/2 -translate-y-1/2' />
                                    Ir para { props.currentPage === 'home' || props.currentPage === 'movies' ? 'o filme' : 'a serie' }
                                </button>
                            </Link>

                        </div>

                        <div className='second-overlay'></div>
                        <div className="overlay"></div>
                    </SwiperSlide>
                ))}

            </Swiper>

        </Style.headerSlides>
    );
};