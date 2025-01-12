import { useRouter } from 'next/navigation';

export default function IntroPoster() {
    const router = useRouter();

    return (
        <div className="w-screen h-[660px] md:h-[420px] xl:h-[450px] overflow-hidden relative]">
            <div className='w-full px-4 max-w-md sm:max-w-lg z-[5] xl:max-w-2xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 '>
                <h1 className='text-[32px] sm:text-4xl xl:text-[45px] font-bold font-raleway text-center text-nowra leading-tight md:leading-[45px] lg:leading-[50px]'>Descubra tudo sobre seus filmes e séries favoritos <br></br>em um só lugar!</h1>

                <div className='w-full flex flex-col-reverse gap-5 justify-center items-center mt-10'>
                    <button onClick={() => router.push('movies')} 
                        className='btn px-16 h-14 border bg-transparent hover:bg-transparent border-neutral-300 hover:border-neutral-300 text-white text-base font-medium outline-none rounded-full'
                        >
                        Explorar filmes
                    </button>
                    
                    <button 
                        onClick={() => router.push('series')} 
                        className='btn px-16 h-14 border-none bg-darkslateblue hover:bg-darkslateblue text-white text-base font-medium outline-none rounded-full'
                        >
                        Explorar series
                    </button>
                </div>
            </div>
        </div>
    );
};