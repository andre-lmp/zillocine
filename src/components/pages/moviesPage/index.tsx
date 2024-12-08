// Carouseis de conteudo
import HeaderCarousel from '@/components/headerCarousel';

import { Suspense } from 'react';

import dynamic from 'next/dynamic';

const MoviesCarousel = dynamic(() => import('./carousel/index'), { ssr: false });

export default function MoviesPage() {

    // Animação de carregamento da pagina
    const loading = (
        <div className='w-screen h-screen fixed z-[400] flex justify-center items-center'>
            <span className="loading loading-spinner loading-lg text-neutral-400"></span>
        </div>
    );

    return (
        <div className='w-full min-h-screen'>
            <Suspense fallback={loading}>
                <HeaderCarousel currentPage='movies'/>
            </Suspense>
            
            <MoviesCarousel />
        </div>
    );
};