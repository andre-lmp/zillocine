'use client';

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

// Icones
import { PiArrowElbowDownRightBold } from "react-icons/pi";

import EmblaCarousel from '@/components/emblaCarousel';

import Link from "next/link";

import IntroPoster from '@/components/headerSlides/introPoster/index';
import { getCompanyLogo } from '@/components/utils/tmdbApiData/producerLogo';
import { getReleaseDate } from '@/components/utils/tmdbApiData/releaseDate';
import { getRunTime } from '@/components/utils/tmdbApiData/runtime';
import { getImdbReviews } from '@/components/utils/tmdbApiData/reviews';

import '@/components/emblaCarousel/templates/header/index.css';

type contentDataProps = Record<string, any>;

type carouselProps = {
    currentPage: string;
    contentData: contentDataProps[];
};

export default function Carousel( props: carouselProps ) {
    return (
        <section className='header-slides-wrapper'>
            <EmblaCarousel 
                navigationType='header' 
                slidesPerView={1} 
                autoplay={true}
                loop={true}>

                { props.currentPage === 'home' ? (
                    <div className='embla__slide'>
                        <IntroPoster/>
                    </div>
                ) : null }
            
                {/* Gerando slides com base na resposta da api do TMDB */}
                { props.contentData.map(( content ) => (
                    // Gera o slide caso tenha imagens disponiveis
                    content.backdrop_path || content.backdrop_path ? (
                        // Container do slide
                        <div key={ `${props.currentPage}-${content.id}` } className='embla__slide'>
                            <div className='w-screen  flex flex-row-reverse slide-container'>
                                <div className='w-screen h-[660px] md:h-[420px] md:w-[50vw] xl:h-[450px]'>
                                    {/* Imagem do slide */}
                                    <LazyLoadImage
                                        src={`https://image.tmdb.org/t/p/original${content.poster_path ?? content.backdrop_path}`}
                                        height={'100%'}
                                        width={'100%'}
                                        alt={`${content.title ?? content.name} movie/serie presentation image`}
                                        placeholderSrc={`https://image.tmdb.org/t/p/w92/${content.poster_path ?? content.backdrop_path}`}
                                        className='bg-darkpurple object-cover w-full h-full'
                                        effect='opacity'
                                    />
                                </div>
                                {/* Informações do conteudo */}
                                <div className='w-full z-20 absolute bottom-10 px-4 md:bottom-14 md:pl-6 lg:pl-8 md:static md:w-1/2 md:flex md:items-start md:flex-col md:justify-center'>
            
                                    {/* Titulo */}
                                    <h1 className='font-raleway mx-auto w-3/4 font-extrabold text-[26px] text-center line-clamp-1 md:mx-0 md:text-left md:max-w-xs lg:max-w-sm xl:max-w-md md:text-3xl lg:text-4xl'>
                                        { content.title ?? content.name }
                                    </h1>

                                    <div className='flex gap-x-6 gap-y-3 flex-nowrap items-center mt-2 overflow-hidden justify-center md:justify-start'>
                                        {/* Ano de lançamento */}
                                        <p className='bg-orangered rounded-md w-fit px-3 h-7 flex items-center text-base font-normal font-noto_sans md:mx-0'>
                                            { getReleaseDate( content.release_date ?? content.first_air_date )}
                                        </p>
                                        {/* Numero de temporadas */}
                                        { content.seasons?.length > 0 && <p className="font-noto_sans whitespace-nowrap text-base font-normal text-neutral-400">{content.seasons.length} Temporada(s)</p> }
                                        {/* Tempo de duração */}
                                        {getRunTime( content.runtime ?? null )}
                                        {/* Nota do publico ao conteudo */}
                                        {getImdbReviews( content.vote_average, content.vote_count )}
                                        {/* Logo da produtora */}
                                        <div className='hidden 2xl:inline'>
                                            {getCompanyLogo( content.production_companies )}
                                        </div>
                                    </div>
                                    {/* Descrição */}
                                    <p className='line-clamp-2 text-center w-full mb-4 md:mb-7 mt-2 font-noto_sans text-base md:max-w-full md:text-left text-neutral-300 xl:max-w-md lg:text-[17px] lg:line-clamp-3 lg:max-w-sm leading-relaxed 2xl:max-w-lg'>
                                        { content.overview.length > 3 ? content.overview : `O lançamento de um dos mais aguardados filmes de uma sequencia de sucesso` }
                                    </p>
                                    {/* Link para o player */}
                                    <Link href={`/player/${ props.currentPage === 'home' || props.currentPage === 'movies' ? 'movie' : 'serie' }/${content.id}`}>
            
                                        <button className='w-full mx-auto outline-none h-12 btn text-white rounded-md text-base font-noto_sans font-semibold bg-darkslateblue flex justify-center items-center relative md:w-fit md:px-14 d:rounded-lg md:mx-0 md:rounded-full md:h-14 md:opacity-50 hover:opacity-100 hover:bg-darkslateblue border-none duration-200 ease-linear hover:scale-105'>
                                            <PiArrowElbowDownRightBold className='absolute left-5 top-1/2 -translate-y-1/2' />
                                            Ir para { props.currentPage === 'home' || props.currentPage === 'movies' ? 'o filme' : 'a serie' }
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="overlay"></div>
                        </div>
                    ) : null
                ))}                
            </EmblaCarousel>
        </section>
    );
};