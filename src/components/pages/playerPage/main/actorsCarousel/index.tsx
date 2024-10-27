// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/opacity.css';

// Modulos do Swiper.js para carousel de slides
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/element/css/navigation';

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import { ActorsCarouselWrapper } from "../../styles";

type ComponentProps = {
    actorsData: tmdbObjProps[];
}

export function MainActors( props: ComponentProps ) {

    const swiperBreakpoints = {
        1: { spaceBetween: 30 },
        1023: { spaceBetween: 50 }
    };

    return props.actorsData.some( actor => actor.profile_path) ? (
        <div className="mt-20 font-noto_sans sm:mt-10 relative">
            <h3 className="text-xl font-semibold mb-6">Atores principais</h3>

            {/* Carousel de atores do filme/serie */}
            <ActorsCarouselWrapper>
                <Swiper
                    slidesPerView={'auto'}
                    slidesPerGroupAuto={true}
                    spaceBetween={70}
                    navigation={{
                        nextEl: '.swiper-next-slide',
                        prevEl: '.swiper-prev-slide'
                    }}
                    modules={[ Navigation ]}
                    style={{ width: '100%'}}
                    breakpoints={swiperBreakpoints}
                >
                    { props.actorsData.map(( actor: tmdbObjProps ) => (
                        actor.profile_path ? (
                            <SwiperSlide key={ actor.id } style={{ width: 'auto' }}>
                                <div className="flex flex-col gap-y-5 items-center w-20">
                                    <div className="w-20 h-20 rounded-full overflow-hidden lg:w-24 lg:h-24">
                                        
                                        <LazyLoadImage
                                            src={`https://image.tmdb.org/t/p/original${actor.profile_path}`}
                                            alt={`Picture of actor ${actor.name}`}
                                            width={'100%'}
                                            height={'100%'}
                                            effect="opacity"
                                            className="object-cover w-20 h-20 lg:w-24 lg:h-24"
                                        />
                                    </div>
                                    <p className="text-center font-normal text-neutral-300">{ actor.name ?? '' }</p>
                                </div>
                            </SwiperSlide>
                    ) : null
                    ))}
                </Swiper>

                {/* Botão para voltar ao slide anterior */}
                <div className='absolute left-0 top-1/2 -translate-y-1/2 z-50 rounded-full -translate-x-1/2 cursor-pointer swiper-controllers swiper-prev-slide'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </div>

                {/* Botão para ir ao proximo slide */}
                <div className='absolute right-0 top-1/2 -translate-y-1/2 z-50 rounded-full translate-x-1/2 cursor-pointer swiper-controllers swiper-next-slide'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </ActorsCarouselWrapper>
        </div>
    ) : null ;
};