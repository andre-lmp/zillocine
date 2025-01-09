import { memo } from "react";

import { UsePrevNextButtonsType } from "../controller";

const EmblaNavigation = memo(( props: UsePrevNextButtonsType ) => {
    return (
        <>
            {/* Botão para o slide anterior */ }
            <button 
                onClick={props.onPrevButtonClick}
                className={`absolute left-0 top-[260px] -translate-y-[140px] z-50 w-[45px] h-[45px] rounded-full -translate-x-1/2 bg-orange-800 hover:bg-orangered cursor-pointer embla-navigation`}
                style={{ 
                    opacity: props.prevBtnDisabled ? '0' : '100%', 
                    pointerEvents: props.prevBtnDisabled ? 'none' : 'auto'
                }}
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* Botão para o proximo slide */ }
            <button 
                onClick={props.onNextButtonClick}
                className={`absolute right-0 top-[260px] -translate-y-[140px] z-50 w-[45px] h-[45px] rounded-full translate-x-1/2 bg-orange-800 hover:bg-orangered cursor-pointer embla-navigation`}
                style={{ 
                    opacity: props.nextBtnDisabled ? '0' : '100%',
                    pointerEvents: props.nextBtnDisabled ? 'none' : 'auto'
                }}
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </>
    );
});

EmblaNavigation.displayName = 'EmblaNavigation';
export default EmblaNavigation;