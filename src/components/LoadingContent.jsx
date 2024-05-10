import { parseInt } from 'lodash';
import { Swiper, SwiperSlide } from '/src/components/swiper/Swiper.jsx';
import '/src/styles/Swiper.css';
import { useState, useEffect, useRef } from 'react';

function Loading(props) {
    const [countSlides, setCountSlides] = useState([]);
    const componentActive = useRef(undefined);
    const [isAnimated, setIsAnimated] = useState(true);
    const [slidesOpacity, setSlidesOpacity] = useState('slides-opacity-0');
    const breakpoints = {
        280: {
            slidesPerView: 2
        },
        650: {
          slidesPerView: 3
        },
        820:{
          slidesPerView: 4
        },
        990:{
          slidesPerView: 5
        },
        1160:{
          slidesPerView: 6
        },
        1330:{
          slidesPerView: 7
        },
        1640:{
          slidesPerView: 8
        },
        1950:{
          slidesPerView: 9
        }
    };
 
    const handleCountSlides = (width) => {
        const nSlides = parseInt(width / 190);
        setCountSlides(new Array(nSlides).fill(null));
    };

    useEffect(() => {
        props.disable(true);
        const getWidth = () => {
            if (window.innerWidth){
                handleCountSlides(window.innerWidth);
            }else{
                setTimeout(getWidth, 100);
            }
        };

        getWidth();

        window.addEventListener('resize', () => {
            handleCountSlides(window.innerWidth);
        });
    
       const handleLoadingActive = () => {
        console.log('component  ' + props.active);
            if (props.active === false) {
                props.disable(false);
                if(isAnimated) {
                    if (componentActive.current){
                        componentActive.current.style.display = 'flex';
                    }
                }
            }
            else{
                setIsAnimated(false);
                if (componentActive.current){
                    setTimeout(() => {
                        componentActive.current.style.display = 'none';
                        setIsAnimated(true);
                        props.disable(true);
                    }, 1500);
                }
            }
        };

        setTimeout(() => {
            setSlidesOpacity('slidesOpacity-1');
        }, 3000);
        handleLoadingActive();
    },[props.active, props.disable]);

    return(
        <section ref={componentActive} className='loading-component'>
                {props.title ? (
                    <div className={`${slidesOpacity}`}>
                        <h1></h1>
                        <h2></h2>
                    </div>
                ):null}
              <Swiper  className="loading-swiper" style={{width: '100%', height: 'auto'}} breakpoints={breakpoints}>
                {countSlides ? (
                    countSlides.map(slide => (
                        <SwiperSlide>
                            <div className={`loading-div ${slidesOpacity}`}>
                                <img src="" display='true' alt="" />
                            </div>
                        </SwiperSlide>
                    ))
                ): null}
              </Swiper>
        </section>
    )
};

export default Loading;