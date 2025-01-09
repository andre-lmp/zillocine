import { UseDotButtonType, DotButton } from "../bullets";

import { memo } from "react";

type PrevNextButtonsType = {
    onPrevButtonClick: () => void
    onNextButtonClick: () => void
};

type HeaderNavigationProps = UseDotButtonType & PrevNextButtonsType;

const HeaderNavigation = memo(( props: HeaderNavigationProps ) => {
    
    return (
        <div className="absolute bottom-1 md:bottom-3 left-1/2 -translate-x-1/2 box-border flex items-center justify-center mb-2 z-30">
            {/* Botão para o slide anterior */}
            <button 
                onClick={props.onPrevButtonClick}
                className='absolute w-fit rounded-full z-30 -translate-x-20 translate-y-[1px] cursor-pointer items-center justify-center hidden md:inline outline-none border-none'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-neutral-500 hover:text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* bullets here  */}
            <div className="flex gap-x-2">
                {props.scrollSnaps.map((_, index) => (
                    <DotButton
                        key={index}
                        onClick={() => props.onDotButtonClick(index)}
                        className="w-2 h-2 rounded-full border-none outline-none"
                        style={{ backgroundColor: index === props.selectedIndex ? 'white' : 'rgba(255, 255, 255, 0.2)' }}
                    />
                ))}
            </div>

            {/* Botão para o proximo slide */}
            <button 
                onClick={props.onNextButtonClick}
                className='absolute w-fit rounded-full z-30 translate-x-20 cursor-pointer items-center justify-center translate-y-[1px] hidden md:inline outline-none border-none'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6  text-neutral-500 hover:text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    )
});

HeaderNavigation.displayName = 'HeaderNavigation';
export default HeaderNavigation;