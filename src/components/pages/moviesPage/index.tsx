// Carouseis de conteudo
import HeaderCarousel from '@/components/headerSlides/index';

import MoviesCarousel from './carousel/index';

export default function MoviesPage() {
    return (
        <div className='w-full min-h-screen'>
            <HeaderCarousel currentPage='movies'/>
            <MoviesCarousel />
        </div>
    );
};