import { EmblaStateProps } from "../../index";

export type HeaderNavigationProps = {
    scrollToPrev: () => void;
    scrollToNext: () => void;
    scrollTo: ( index: number ) => void;
    emblaState: EmblaStateProps;
};

export default function HeaderNavigation( props: HeaderNavigationProps ) {

    const bullets = (
        <>
            { Array.from({ length: props.emblaState.numberOfSlides }, (_, index) => (
                <button 
                    className="w-2 h-2 rounded-full bg-white/20"
                    onClick={() => props.scrollTo( index )}
                    style={{ 
                        backgroundColor: props.emblaState.activeIndex === index ? 'white' : 'rgba(255, 255, 255, 0.2)' 
                    }}
                    key={index}>
                </button>
            ))}
        </>
    );

    console.log(bullets);
    
    return (
        <div className="absolute bottom-1 md:bottom-3 left-1/2 -translate-x-1/2 box-border flex items-center justify-center mb-2 z-30">
            {/* Botão para o slide anterior */}
            <button 
                onClick={props.scrollToPrev}
                className='absolute w-fit rounded-full z-30 -translate-x-20 translate-y-[1px] cursor-pointer items-center justify-center hidden md:inline outline-none border-none'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-neutral-500 hover:text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>

            <div className="flex gap-x-2">{ bullets }</div>

            {/* Botão para o proximo slide */}
            <button 
                onClick={props.scrollToNext}
                className='absolute w-fit rounded-full z-30 translate-x-20 cursor-pointer items-center justify-center translate-y-[1px] hidden md:inline outline-none border-none'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6  text-neutral-500 hover:text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    )
};