import { ReactNode, useCallback, useEffect, useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import EmblaNavigation from "./navigation/default";
import HeaderNavigation from "./navigation/header";
import classNames  from 'embla-carousel-class-names';
import autoplay from 'embla-carousel-autoplay';

import './index.css';

type EmblaCarouselProps = {
    children: ReactNode[] | ReactNode;
    loop?: boolean;
    slidesPerView?: 'auto' | number;
    duration?: number;
    autoplay?: boolean;
    navigationType: 'default' | 'header';
};

export type EmblaStateProps = {
    isBeginning: boolean; 
    isOver: boolean;
    numberOfSlides: number;
    activeIndex: number;
};

export default function EmblaCarousel( props: EmblaCarouselProps ) {

    const [ emblaState, setEmblaState ] = useState<EmblaStateProps>({ 
        isBeginning: true, 
        isOver: false,
        numberOfSlides: 0,
        activeIndex: 0 
    });
    const emblaConfig = { 
        loop: props.loop, 
        slidesToScroll: props.slidesPerView, 
        duration: props.duration ? props.duration : 20,
    };
    const [emblaRef, emblaApi] = useEmblaCarousel( emblaConfig, [ classNames() ]);
    let isChangeListenerAdded = false;

    // const reInitCarousel = ( viewportWidth: number ) => {
    //     if ( viewportWidth >= 768 && emblaApi ) {
    //         emblaApi.reInit({}, [ 
    //             autoplay({ delay: 7000, stopOnFocusIn: false, stopOnInteraction: false }), 
    //             classNames(), 
    //         ]);
    //     };

    //     if ( viewportWidth < 768 && emblaApi ) {
    //         emblaApi.reInit({}, [ 
    //             autoplay({ delay: 7000, stopOnFocusIn: false, stopOnInteraction: false }), 
    //             classNames(), 
    //         ]);
    //     };

    //     console.log(viewportWidth, emblaApi);
    // };

    useEffect(() => {
        // if ( window !== undefined && props.autoplay && emblaApi && !isResizeListenerAdded ) {
        //     reInitCarousel(window.innerWidth);
        //     window.addEventListener('resize', () => reInitCarousel(window.innerWidth));
        //     isResizeListenerAdded = true;
        // }
    }, [emblaApi]);

    useEffect(() => {
        if ( emblaApi && !isChangeListenerAdded ) {
            emblaApi.on('scroll', updateEmblaState);

            setEmblaState( prev => ({
                ...prev,
                numberOfSlides: emblaApi.slideNodes().length,
                activeIndex: emblaApi.slidesInView()[0],
            }));

            isChangeListenerAdded = true;
        };
    }, [ emblaApi ]);

    const scrollPrev = useCallback(() => {
        if ( emblaApi ) emblaApi.scrollPrev();
    }, [ emblaApi ]);

    const scrollNext = useCallback(() => {
        if ( emblaApi ) emblaApi.scrollNext();
    }, [ emblaApi ]);

    const scrollToIndex = useCallback(( index: number ) => {
        if ( emblaApi ) {
            emblaApi.scrollTo( index )
        }
    }, [ emblaApi ]);

    const updateEmblaState = useCallback(() => {
        if ( emblaApi ) {
            setEmblaState( prev => ({
                ...prev,
                activeIndex: emblaApi.slidesInView()[0],
                isBeginning: !emblaApi.canScrollPrev(),
                isOver: !emblaApi.canScrollNext()
            }));
        }
    }, [ emblaApi ]);

    return (
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    { props.children }
                </div>
            </div>

            { props.navigationType === 'default' ? (
                <EmblaNavigation emblaState={emblaState} scrollToPrev={scrollPrev} scrollToNext={scrollNext}/>
            ) : (
                <HeaderNavigation 
                    emblaState={emblaState} 
                    scrollToPrev={scrollPrev} 
                    scrollToNext={scrollNext}
                    scrollTo={scrollToIndex}
                /> 
            )}
        </div>
    );
};