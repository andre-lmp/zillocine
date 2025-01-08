import { ReactNode, useCallback, useEffect, memo } from "react";

import { useInView } from 'react-intersection-observer';

import useEmblaCarousel from "embla-carousel-react";
import EmblaNavigation from "./navigation/default";
import HeaderNavigation from "./navigation/header";

import { useDotButton } from './navigation/bullets/index';

import autoplay from 'embla-carousel-autoplay';

import { usePrevNextButtons } from './navigation/controller/index';

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
const EmblaCarousel = memo(( props: EmblaCarouselProps ) => {

    const emblaConfig = { 
        loop: props.loop, 
        slidesToScroll: props.slidesPerView, 
        duration: 0,
    };

    const [emblaRef, emblaApi] = useEmblaCarousel( emblaConfig );
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

    const { inView, ref } = useInView({
        threshold: 0,
        rootMargin: '600px 0px'
    });

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi);

    useEffect(() => {
        if ( emblaApi ) {
            props.autoplay && emblaApi.reInit({}, [autoplay({delay: 7000, stopOnInteraction: false})]);
            emblaApi.on('slidesChanged', () => scrollToIndex( 0 ));
        };
    }, [ emblaApi ]);

    const scrollToIndex = useCallback(( index: number ) => {
        if ( emblaApi ) {
            emblaApi.scrollTo( index )
        };
    }, [ emblaApi ]);

    return (
        <div ref={ref}>
            <div className="embla" style={{ visibility: inView ? 'visible' : 'hidden' }}>
                <div className="embla__viewport" ref={emblaRef}>
                    <div className="embla__container">
                        { props.children }
                    </div>
                </div>

                { props.navigationType === 'default' ? (
                    <EmblaNavigation 
                        onNextButtonClick={onNextButtonClick}
                        onPrevButtonClick={onPrevButtonClick}
                        prevBtnDisabled={prevBtnDisabled}
                        nextBtnDisabled={nextBtnDisabled}
                    />
                ) : (
                    <HeaderNavigation
                    selectedIndex={selectedIndex}
                    scrollSnaps={scrollSnaps}
                    onDotButtonClick={onDotButtonClick}  
                    onNextButtonClick={onNextButtonClick}
                    onPrevButtonClick={onPrevButtonClick}
                    />
                )}

            </div>
        </div>
    );
});

export default EmblaCarousel;