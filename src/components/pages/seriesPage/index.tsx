// Carouseis de conteudo
import HeaderCarousel from '@/components/headerSlides/index';

import SeriesCarousel from './carousel/index';

export default function MoviesPage() {

    return (
        <div className='w-full min-h-screen'>
            <HeaderCarousel currentPage='series'/>
            <SeriesCarousel />
        </div>
    );
};