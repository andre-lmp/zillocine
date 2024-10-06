import { useRef, MutableRefObject, useState, useEffect } from "react";

import { IoPlay } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";

type componentProps = {
    showName: string;
    showKey: string | null;
};

export default function WatchTrailer( props: componentProps ) {
    const checkboxInputRef: MutableRefObject<(HTMLInputElement | null)> = useRef( null );
    const [ isPlayerDisable, setIsPlayerDisable ] = useState( true );
    
    const checkboxToggle = () => {
        checkboxInputRef.current?.click();
        setIsPlayerDisable( prev => !prev );
    };

    return (
        <>
            <button 
                onClick={() => { checkboxToggle() }} 
                className='w-full mx-auto outline-none h-12 btn text-white rounded-md text-base font-noto_sans font-semibold bg-darkslateblue flex justify-center items-center relative hover:bg-darkslateblue md:w-fit md:px-14 md:mx-0'
            >
                    <IoPlay className="text-base text-white"/>
                    Assistir ao trailer
            </button>

            <input ref={checkboxInputRef} type="checkbox" id="my_modal_6" className="modal-toggle" />
            { !isPlayerDisable && (
                <div className="modal" role="dialog">
                    <div className="bg-darkpurple w-[calc(100%-32px)] max-w-3xl pb-2 px-2 h-auto rounded-md z-50">
                        
                        <div className="w-full flex flex-row gap-x-2 items-center py-5 px-3 text-lg text-white relative font-roboto font-medium">
                            <p className="max-w-40 overflow-hidden line-clamp-1 whitespace-nowrap">{ props.showName }</p>
                            <p className="text-nowrap">- Trailer</p>

                            <div onClick={() =>  {checkboxToggle()}} className="absolute top-1/2 right-0 -translate-y-1/2">
                                <IoIosClose className="text-4xl" />
                            </div>
                        </div>

                        { props.showKey ? (
                            <iframe 
                                width={500}
                                height={300}
                                className="rounded-md w-full max-h-[600px]" 
                                src={`https://www.youtube.com/embed/${props.showKey}?autoplay=1`} 
                                title="YouTube video player" 
                                frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerPolicy="strict-origin-when-cross-origin" 
                                allowFullScreen
                            />
                        ) : (
                            <div className="w-full h-60 flex items-center justify-center bg-darkpurple">
                                <p className="text-base text-neutral-100 leading-relaxed font-roboto font-normal text-center"><span className="text-2xl text-white font-semibold">Desculpe</span> <br/> não foi possível carregar o conteúdo</p>
                            </div>
                        ) }

                    </div>
                </div>
            )}
        </>
    );
};