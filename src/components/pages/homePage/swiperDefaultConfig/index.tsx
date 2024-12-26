import { useRef, useEffect, Dispatch, SetStateAction, ReactNode } from "react";

// Componentes do Swiper.js para carousel de slides
import { Swiper, SwiperRef } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';

type SwiperStateProps = {
    isBeginning: boolean;
    isOver: boolean;
};

type ComponentProps = {
    navigation: { nextEl: string, prevEl: string };
    children: ReactNode[] | ReactNode;
    swiperState: Dispatch<SetStateAction<SwiperStateProps>>;
};

export default function SwiperDefaultConfig( props: ComponentProps ) {

    const swiperBreakPoints = { 1024: { spaceBetween: 20 }};
    const swiperRef = useRef<SwiperRef | null>( null );

    const updateSwiperState = ( swiperRef: SwiperRef | null ) => {
        if ( swiperRef ) {
            props.swiperState(() => ({
                isBeginning: swiperRef.swiper.isBeginning,
                isOver: swiperRef.swiper.isEnd
            }));
        };
    };

    useEffect(() => {
        updateSwiperState( swiperRef.current );
    }, []);

    return (
        <Swiper
            slidesPerGroupAuto
            slidesPerView={'auto'}
            spaceBetween={15}
            speed={200}
            navigation={{
                nextEl: `.${props.navigation.nextEl}`,
                prevEl: `.${props.navigation.prevEl}`,
            }}
            breakpoints={swiperBreakPoints}
            modules={[Navigation]}
            resistanceRatio={0.1}
            ref={swiperRef}
            onSlideChange={() => updateSwiperState(swiperRef.current)}
        >
            { props.children }
        </Swiper>
    );
};