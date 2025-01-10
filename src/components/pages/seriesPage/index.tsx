// Carouseis de conteudo
import HeaderCarousel from '@/components/headerSlides/index';

import dynamic from 'next/dynamic';

const SeriesCarousel = dynamic(() => import('./carousel/index'), { ssr: false });

export default function MoviesPage() {

    return (
        <div className='w-full min-h-screen'>
            <HeaderCarousel currentPage='series'/>
            <SeriesCarousel />
        </div>
    );
};