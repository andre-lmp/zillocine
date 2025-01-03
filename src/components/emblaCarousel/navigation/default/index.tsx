type EmblaNavigationProps = {
    emblaState: { isBeginning: boolean, isOver: boolean };
    scrollToPrev: () => void;
    scrollToNext: () => void;
}

export default function EmblaNavigation( props: EmblaNavigationProps ) {
    return (
        <>
            {/* Botão para o slide anterior */ }
            <button 
                onClick={props.scrollToPrev}
                className={`absolute left-0 top-[260px] -translate-y-[140px] z-50 w-[45px] h-[45px] rounded-full -translate-x-1/2 bg-orange-800 hover:bg-orangered cursor-pointer embla-navigation`}
                style={{ 
                    opacity: props.emblaState.isBeginning ? '0' : '100%', 
                    pointerEvents: props.emblaState.isBeginning ? 'none' : 'auto'
                }}
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* Botão para o proximo slide */ }
            <button 
                onClick={props.scrollToNext}
                className={`absolute right-0 top-[260px] -translate-y-[140px] z-50 w-[45px] h-[45px] rounded-full translate-x-1/2 bg-orange-800 hover:bg-orangered cursor-pointer embla-navigation`}
                style={{ 
                    opacity: props.emblaState.isOver ? '0' : '100%',
                    pointerEvents: props.emblaState.isOver ? 'none' : 'auto'
                }}
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </>
    );
};