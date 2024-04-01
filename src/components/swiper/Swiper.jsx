import { useRef, useEffect } from 'react';
import { register } from 'swiper/element/bundle';
import 'swiper/css';
import 'swiper/element/css/pagination';

export function Swiper(props){
    const swiperRef =  useRef(null);
    const {children, ...rest} = props;

    useEffect(() => {
        register();
        const params = {...rest};
        Object.assign(swiperRef.current, params);
        swiperRef.current.initialize();
    },[])

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