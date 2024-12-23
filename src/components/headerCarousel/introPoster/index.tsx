import { useRouter } from 'next/navigation';

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

export default function IntroPoster() {
    const router = useRouter();

    return (
        <div className="w-screen h-[660px] md:h-[400px] xl:h-[420px] overflow-hidden relative">
            <LazyLoadImage
                src={'/intro_poster.png'}
                alt={'image of a list of movies from the Zillocine website'}
                className='bg-deepnight object-cover w-[150%] h-[130%] md:h-[150%] z-[1] opacity-90 absolute -top-1/4 -rotate-12 blur-[2px] md:bur-[3px]'
                effect='opacity'
            />

            <div className='absolute w-full h-full z-[3] top-0 left-0 bg-gradient-to-b from-deepnight via-deepnight/50 to-deepnight'></div>

            <div className='w-full px-4 max-w-md sm:max-w-lg z-[5] xl:max-w-2xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 '>
                <h1 className='text-[32px] sm:text-4xl xl:text-[45px] font-bold font-raleway text-center text-nowra leading-snug md:leading-[45px] lg:leading-[50px]'>Descubra tudo sobre seus filmes e séries favoritos <br></br>em um só lugar!</h1>

                <div className='w-full flex flex-col-reverse gap-5 justify-center items-center mt-10'>
                    <button onClick={() => router.push('movies')} 
                        className='btn px-16 h-12 rounded-lg border bg-transparent hover:bg-transparent border-neutral-300 text-white text-base font-medium outline-none'
                        >
                        Explorar filmes
                    </button>
                    
                    <button 
                        onClick={() => router.push('series')} 
                        className='btn px-16 h-12 rounded-lg border-none bg-darkslateblue hover:bg-darkslateblue text-white text-base font-medium outline-none'
                        >
                        Explorar series
                    </button>
                </div>
            </div>
        </div>
    );
};