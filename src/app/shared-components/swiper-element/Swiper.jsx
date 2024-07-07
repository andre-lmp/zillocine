import { useRef, useEffect, useState } from 'react';
import { register } from 'swiper/element/bundle';
import 'swiper/element/css/pagination';

export function Swiper(props){
    const swiperRef =  useRef(null);
    const {children, ...rest} = props;
    const [isRegistered, setIsRegistered] = useState(false);

    const getSwiperRefValue = () => {
        swiperRef.current.swiper && swiperRef.current.getSwiperRef ? (
            props.getSwiperRef(swiperRef.current.swiper)
        ) : (
            setTimeout(() => {
                getSwiperRefValue();
            }, 100)
        )
    };

    useEffect(() => {
        if (!isRegistered) {
            register();
            setIsRegistered(true);
        }

        const params = {...rest};
        Object.assign(swiperRef.current, params);
        swiperRef.current.initialize();
        getSwiperRefValue()

    },[props])

    return(
        <swiper-container init='false' ref={swiperRef}>
            {children}
        </swiper-container>
    )
}


export function SwiperSlide(props){
    const {children, ...rest} = props;

    return(
        <swiper-slide {...rest}>
            {children}
        </swiper-slide>
    )
}