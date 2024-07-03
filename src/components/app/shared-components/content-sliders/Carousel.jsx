import '../../shared-styles/App.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from '../swiper-element/Swiper.jsx';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const Carousel = (props) => {
    const [swiperRef, setSwiperRef] = useState(undefined);
    const navigate = useNavigate(undefined);
    const breakpoints = {
        300:{
          slidesPerView: 2,
          spaceBetween: 11
        },
        600: {
          slidesPerView: 3,
          spaceBetween: 17
        },
        820:{
          slidesPerView: 4,
          spaceBetween: 17
        },
        990:{
          slidesPerView: 5,
          spaceBetween: 17
        },
        1160:{
          slidesPerView: 6,
          spaceBetween: 17
        },
        1400:{
          slidesPerView: 7,
          spaceBetween: 17
        },
        1750: {
          slidesPerView: 8,
          spaceBetween: 17
        }
    };
    const customTitles = {
        'lançamentos': 'Em Destaque: Os Filmes Mais Recentes',
        28: 'Adrenalina em cartaz',
        10759: 'Adrenalina em cartaz',
        9648: 'Suspense de Sobrevivência',
        27: 'Horror em exibição',
        35: 'Diversão com a família',
        99: 'Documentando o mundo',
        878: 'Universos paralelos: Ficção',
        10752: 'Guerra: Uma Batalha pela Sobrevivência',
        10768: 'Guerra: Uma Batalha pela Sobrevivência',
        16: 'Diversão para Crianças'
    };

    const navigateTo = (type, id) => {
        navigate(`/Player/${type}/${id}`);
    };

    const swiperController = (side) => {
        if (swiperRef){
          if (side === 'right') {
            swiperRef.swiper.slideNext();
          }else{
            swiperRef.swiper.slidePrev();
          }
        }
    };

    const removeContentIndex = (index) => {
        if (props.slidesData[index]){
            props.slidesData.splice(index, 1);
        }
     };

    return(
        props.slidesData ? (
            <section className="carousel">
                <div className="container">
                    <div className="title-box">
                        {props.sectionTitle ? (
                            <h1 key={props.sectionTitle}>
                                {customTitles[props.sectionTitle] ? (
                                    customTitles[props.sectionTitle]
                                ): (
                                    props.sectionTitle
                                )}
                            </h1>
                        ): null}
                    </div>

                    {props.removeLine ? (
                        null
                    ) : (
                        <hr/>
                    )}

                    <section className="swiper-box" key={props.slidesData.length}>
                        <button className="swiper-controllers controller-left">
                            <SlArrowLeft className="arrows" onClick={() => {swiperController('left')}}/>
                        </button>

                        <button className="swiper-controllers controller-right">
                            <SlArrowRight className="arrows" onClick={() => {swiperController('right')}}/>
                        </button>

                        <Swiper swiperRef={setSwiperRef} className="swiper-container" breakpoints={breakpoints}>
                            {props.slidesData.map((slide, index) => (
                                <SwiperSlide>
                                    <div key={slide.id} className="slide-container" onClick={() => {navigateTo(props.contentType, slide.id)}}>
                                    
                                        {slide.poster_path ? (
                                            <LazyLoadImage
                                            src={`https://image.tmdb.org/t/p/w500${slide.poster_path}`}
                                            alt={'poster'}
                                            className='slide-img'
                                            style={{height: '100%'}}
                                            />
                                        ) : (
                                            <LazyLoadImage
                                                src={`https://image.tmdb.org/t/p/w500${slide.backdrop_path}`}
                                                alt={"Backdrop"}
                                                className='slide-img'
                                                style={{height: '100%'}}
                                            />
                                        )},

                                        {!slide.backdrop_path && !slide.poster_path ? (
                                            props.slidesData[index] ? (
                                                removeContentIndex(index)
                                            ) : null
                                        ):null}

                                    <div className="mv-overlay-info">
                                        <h2>
                                            {slide.title &&
                                            slide.title
                                            }
                                            {slide.name &&
                                            slide.name
                                            }
                                        </h2>
                                    </div>

                                    </div>
                                </SwiperSlide>
                            ))};
                        </Swiper>
                    </section>
                </div>
    
            </section>
        ) : null
    );
};

export default Carousel;