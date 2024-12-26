type ComponentProps = {
    navigation: { nextEl: string, prevEl: string };
    swiperState: { isBeginning: boolean, isOver: boolean };
};

export default function SwiperControllers( props: ComponentProps ) {
    return (
        <>
            {/* Botão para o slide anterior */ }
            <div className={`absolute left-0 top-[260px] -translate-y-[140px] z-50 w-[45px] h-[45px] rounded-full -translate-x-1/2 bg-orange-800 hover:bg-orangered cursor-pointer swiper-controllers ${props.navigation.prevEl}`}
            style={{ 
                opacity: props.swiperState.isBeginning ? '0' : '100%', 
                pointerEvents: props.swiperState.isBeginning ? 'none' : 'auto'
            }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </div>

            {/* Botão para o proximo slide */ }
            <div className={`absolute right-0 top-[260px] -translate-y-[140px] z-50 w-[45px] h-[45px] rounded-full translate-x-1/2 bg-orange-800 hover:bg-orangered cursor-pointer swiper-controllers ${props.navigation.nextEl}`}
            style={{ 
                opacity: props.swiperState.isOver ? '0' : '100%',
                pointerEvents: props.swiperState.isOver ? 'none' : 'auto'
            }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>
        </>
    );
};