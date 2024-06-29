import { useRef, useEffect } from 'react';
import { register } from 'swiper/element/bundle';
import 'swiper/element/css/pagination';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';

SwiperCore.use([Navigation]);

export function Swiper(props){
    const swiperRef =  useRef(null);
    const {children, ...rest} = props;

    useEffect(() => {
        register();
        const params = {...rest};
        Object.assign(swiperRef.current, params);
        setTimeout(() => {
            swiperRef.current.initialize();
        }, 1000);
    },[])

    useEffect(() => {
        const assingSwiperValue = () => {
            if (swiperRef.current && swiperRef.current.swiper) {
                props.swiperRef(swiperRef.current);
                console.log(swiperRef.current.swiper.params);
            }else{
                setTimeout(assingSwiperValue, 100);
            }
        };

        assingSwiperValue();
    },[props.swiperRef]);

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