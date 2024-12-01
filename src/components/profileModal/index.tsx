'use client';

// Hooks
import { useContext, useEffect, useRef, MutableRefObject, useState } from "react";

// Icones com React-icons
import { IoClose } from "react-icons/io5";

// Contextos
import { GlobalEventsContext } from "../contexts/globalEventsContext";
import { UserDataContext } from "../contexts/authenticationContext";

// Modulos do Swiper.js para carousel de slides
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/element/css/navigation';

import Profile from "./profile";
import EditName from "./editName";
import EditEmail from "./editEmail";

export default function ProfileModal() {

    const globalEvents = useContext( GlobalEventsContext );
    const userData = useContext( UserDataContext );
    const checkboxInputRef: MutableRefObject<(HTMLInputElement | null)> = useRef( null );
    const swiperRef: MutableRefObject<(SwiperRef | null )> = useRef( null );
    const [ nextSlide, setNextSlide ] = useState<(string | null)>( null );

    // Simula um click para o input que abre/fecha o modal do perfil do usuario
    const toggleProfileModal = () => {
        if (globalEvents.clicksCount >= 1) {
            checkboxInputRef.current?.click();
        };

        globalEvents.setModalsController(prev => ({
            ...prev,
            clicksCount: prev.clicksCount + 1
        }));

        returnToFirstSlide( 300 );
    };

    const returnToFirstSlide = ( delay: number ) => {
        setTimeout(() => {
            swiperRef.current && swiperRef.current.swiper.slideTo(0);
            setNextSlide( null );
        }, delay);
    };

    const swiperControllers = ( slideTo: string ) => {
        if ( slideTo === 'next-slide' ) {
            swiperRef.current && swiperRef.current.swiper.slideNext();
        }

        if ( slideTo === 'prev-slide' ) {
            swiperRef.current && swiperRef.current.swiper.slidePrev();
        }
    };

    useEffect(() => {
        toggleProfileModal();
    }, [globalEvents.isProfileModalActive]);

    useEffect(() => {
        returnToFirstSlide( 300 );
    }, [ userData.name ]);

    return (
        <>
            {/* Input que controla a abertura/fechamento do modal */}
            <input ref={checkboxInputRef} type="checkbox" id="my_modal_7" className="modal-toggle" />

            <div className="modal font-noto_sans" role="dialog">
                <div className="relative max-w-[calc(100vw-32px)] w-[500px] bg-darkpurple rounded-xl">
                    {/* Conteudo do modal */}
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={0}
                            speed={300}
                            allowTouchMove={false}
                            navigation={{
                                nextEl: '.next-step',
                                prevEl: '.prev-step'
                            }}
                            modules={[Navigation]}
                            ref={swiperRef}
                        >
                            {/* Perfil do usuario com imagem, nome e email */}
                            <SwiperSlide>
                                <Profile 
                                    nextSlide={setNextSlide}
                                    slideTo={swiperControllers}
                                />
                            </SwiperSlide>

                            <SwiperSlide>
                                { nextSlide === 'editName' && <EditName slideTo={swiperControllers}/> }
                                
                                { userData.email && (
                                    nextSlide === 'editEmail' && <EditEmail slideTo={swiperControllers}/>
                                )}
                            </SwiperSlide>
                        </Swiper>
                    {/* Botão de fechamento do modal */}
                    <button onClick={toggleProfileModal} className="modal-actio bg-darkslateblue w-10 h-10 rounded-full flex items-center justify-center absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 z-10 cursor-pointer border-none outline-none">
                        <IoClose className='text-xl' />
                    </button>
                </div>
            </div>
        </>
    );;
};