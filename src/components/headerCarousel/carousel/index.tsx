
import * as Style from '@/components/headerCarousel/styles';

import Link from "next/link";

import { tmdbObjProps } from '@/components/contexts/tmdbContext';

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

    const getCompanyLogo = ( companiesList: tmdbObjProps[] ) => {
        for ( let company of companiesList ) {
            if ( company.logo_path ) {
                return (
                    <LazyLoadImage 
                        src={`https://image.tmdb.org/t/p/original${company.logo_path}`} 
                        alt={`${company.name} logo image`} 
                        height={28}
                        effect="opacity"
                        placeholderSrc={`https://image.tmdb.org/t/p/w92/${company.logo_path}`}
                        className="object-cover w-fit h-7 bg-neutral-400 rounded-md"
                    />
                )
            }
        };
    
        return null;
    };

    const getRunTime = ( runtime: number ) => {

        if ( !runtime || runtime === 0 ) {
            return
        };

        if ( runtime < 60 ) {
            return <p className="font-noto_sans whitespace-nowrap text-base font-normal text-neutral-400">{ runtime }m</p>
        };

        const hours = ( runtime / 60 ).toFixed(0);
        const minites = runtime % 60;

        return  <p className="font-noto_sans whitespace-nowrap text-base font-normal text-neutral-300">{ hours }h { minites }m</p>
    };

    const getImdbReviews = ( vote_average: number, vote_count: number ) => {
        return <p className='px-4 h-7 bg-darkslateblue whitespace-nowrap text-base font-normal font-noto_sans rounded flex items-center'>Imdb: { vote_average.toFixed(0) } ({ vote_count })</p>
    };

    return (
        <Style.headerSlides>
            <Swiper
                slidesPerView={1}
                spaceBetween={0}
                autoplay={{ delay: 6000 }}
                speed={300}
                resistance={false}
                loop={true}
                direction='horizontal'
                pagination={{ clickable: true }}
                modules={[ Pagination, Autoplay, EffectFade ]}
            >
                { props.contentData.map(( content, index ) => (
                    <SwiperSlide key={ `${props.currentPage}-${index}` }>
                        <div className='flex flex-row-reverse slide-container'>
                            <div className=''>
                                {content.backdrop_path || content.backdrop_path ? (
                                    <LazyLoadImage
                                        src={`https://image.tmdb.org/t/p/original${content.poster_path ?? content.backdrop_path}`}
                                        alt={`${content.title ?? content.name} movie/serie presentation image`}
                                        placeholderSrc={`https://image.tmdb.org/t/p/w92/${content.poster_path ?? content.backdrop_path}`}
                                        className='bg-darkpurple object-cover w-screen h-screen max-h-[660px] xl:max-h-[750px] 2xl:max-h-[870px] md:w-[50vw] md:h-[400px]'
                                    />
                                ) : null }
                            </div>

                            <div className='w-full z-20 absolute bottom-10 px-4 md:bottom-14 md:pl-6 lg:pl-8 md:static md:w-1/2 md:flex md:items-start md:flex-col md:justify-center'>
                                <h1 className='font-raleway mx-auto w-3/4 font-extrabold text-[26px] text-center line-clamp-2 sm:line-clamp-2 md:mx-0 md:text-left md:max-w-xs lg:max-w-sm xl:max-w-md md:text-3xl'>
                                    { content.title ?? content.name }
                                </h1>

                                <div className='flex gap-x-6 gap-y-3 flex-nowrap items-center mt-2 overflow-hidden justify-center md:justify-start'>
                                    <p className='bg-orangered rounded-md w-fit px-3 h-7 flex items-center text-base font-normal font-noto_sans md:mx-0'>
                                        { getReleaseDate( content.release_date ?? content.first_air_date )}
                                    </p>

                                    { content.seasons?.length > 0 && <p className="font-noto_sans whitespace-nowrap text-base font-normal text-neutral-400">{content.seasons.length} Temporada(s)</p> }

                                    {getRunTime( content.runtime ?? null )}

                                    {getImdbReviews( content.vote_average, content.vote_count )}

                                    <div className='hidden lg:inline'>
                                        {getCompanyLogo( content.production_companies )}
                                    </div>
                                </div>

                                <p className='line-clamp-2 text-center w-full mb-4 md:mb-7 mt-2 font-noto_sans text-base md:max-w-full md:text-left text-neutral-200 xl:max-w-md lg:text-[17px] lg:line-clamp-3 lg:max-w-sm leading-relaxed 2xl:max-w-lg'>
                                    { content.overview.length > 3 ? content.overview : `O lançamento de um dos mais aguardados filmes de uma sequencia de sucesso` }
                                </p>

                                <Link href={`/player/${ props.currentPage === 'home' || props.currentPage === 'movies' ? 'movie' : 'serie' }/${content.id}`}>
                                    <button className='w-full mx-auto outline-none h-12 btn text-white rounded-md text-base font-noto_sans font-semibold bg-darkslateblue flex justify-center items-center relative md:w-fit md:px-14 md:rounded-lg md:mx-0 hover:bg-darkslateblue'>
                                        <PiArrowElbowDownRightBold className='absolute left-3 top-1/2 -translate-y-1/2' />
                                        Ir para { props.currentPage === 'home' || props.currentPage === 'movies' ? 'o filme' : 'a serie' }
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="overlay"></div>
                    </SwiperSlide>
                ))}

            </Swiper>

        </Style.headerSlides>
    );
};