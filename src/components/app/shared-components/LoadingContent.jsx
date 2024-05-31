import { parseInt } from 'lodash';
import { Swiper, SwiperSlide } from './Swiper';
import '../shared-styles/App.css';
import { useState, useEffect, useRef } from 'react';

function Loading(props) {
    const [countSlides, setCountSlides] = useState([]);
    const componentActive = useRef(undefined);
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
    
    },[]);

    return(
        <section ref={componentActive} className='loading-component'>
                {props.title ? (
                    <div>
                        <h1></h1>
                        <h2></h2>
                    </div>
                ):null}
              <Swiper  className="loading-swiper" style={{width: '100%', height: 'auto'}} breakpoints={breakpoints}>
                {countSlides ? (
                    countSlides.map(slide => (
                        <SwiperSlide>
                            <div className='loading-div'>
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