
import HeaderCarousel from "@/components/headerSlides";
import ReleaseCarousel from "./recentMovies";
import TrendingCarousel from "./trending";
import HorrorCarousel from "./horrorMovies";
import WarCarousel from "./warMovies";
import PopularCarousel from "./popularSeries";
import FictionCarousel from "./fictionMovies";
import DocumentaryCarousel from "./documentary";
import CarouselTitle from "./carouselTitle";

import { Suspense } from "react";

export default function HomePage() {

    // Informações de Generos de filmes no TMDB como, numero do genero, titulo para o genero e nome do genero
    const tmdbMovieGenres = {
        release: [ 'release', 'Em Destaque: Os Filmes Mais Recentes', 'Lançamentos' ], 
        horror: [ '27', 'Horror em exibição', 'Terror' ],
        action: [ '28', 'Adrenalina em cartaz', 'Ação' ],
        comedy: [ '35', 'Comedia: Diversão com a família', 'comédia' ],
        cartoon: [ '16', 'Diversão para Crianças', 'Desenho' ],
        romance: [ '10749', 'Histórias de Amor à Moda Antiga', 'Romance' ],
        documentary: [ '99', 'Documentando o mundo', 'Documentário' ],
        war: [ '10752', 'Guerra: Uma Batalha pela Sobrevivência', 'Guerra' ],
        fiction: [ '878', 'Universos paralelos: Ficção', 'Ficção' ],
        adventure: [ '12', 'Desbravando o Desconhecido: Aventuras', 'Aventura' ],
    };

    // Animação de carregamento da pagina
    const loading = (
        <div className='w-full h-screen fixed z-[400] flex justify-center items-center'>
            <span className="loading loading-spinner loading-lg text-neutral-400"></span>
        </div>
    );

    return (
        <section className="min-h-screen" >
            <Suspense fallback={loading}>
                <HeaderCarousel currentPage="home"/>

                <div className="mt-4 flex flex-col gap-y-[40px] pb-6 px-4 md:px-6 lg:px-8">
                    {/* Carousel com filmes de ficção */}
                    <div>
                        <CarouselTitle type="normal">
                            <h2 className="normal-title">
                                {tmdbMovieGenres.fiction[1]}
                            </h2>
                            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'/>
                        </CarouselTitle>
                        <FictionCarousel/>
                    </div>

                    {/* Carousel com filmes/series em alta no momento */}
                    <div>
                        <CarouselTitle type="focus">
                            <h2 className="focus-title mb-1">Em alta</h2>
                            <p className="subtitle">Top 20 filmes e séries mais assistidos hoje!</p>
                        </CarouselTitle>
                        <TrendingCarousel/>
                    </div>

                    {/* Carousel com filmes de terror */}
                    <div>
                        <CarouselTitle type="normal">
                            <h2 className="normal-title">{tmdbMovieGenres.horror[1]}</h2>
                            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'/>
                        </CarouselTitle>
                        <HorrorCarousel/>
                    </div>

                    {/* Carousel com filmes de guerra */}
                    <div>
                        <CarouselTitle type="normal">
                            <h2 className="normal-title">{tmdbMovieGenres.war[1]}</h2>
                            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'/>
                        </CarouselTitle>
                        <WarCarousel/>
                    </div>

                    <div>
                        <CarouselTitle type="focus">
                            <h2 className="focus-title">Séries Populares</h2>
                            <p className="subtitle">
                                Confira as séries mais avaliadas.
                            </p>  
                        </CarouselTitle>
                        <PopularCarousel/>
                    </div>

                    {/* Carousel com os filmes mais recentes */}
                    <div>
                        <CarouselTitle type="normal">
                            <h2 className="normal-title">{tmdbMovieGenres.release[1]}</h2>
                            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'/>
                        </CarouselTitle>
                        <ReleaseCarousel/>
                    </div>

                    {/* Carousel com documentarios */}
                    <div>
                        <CarouselTitle type="normal">
                            <h2 className="normal-title">
                                {tmdbMovieGenres.documentary[1]}
                            </h2>
                            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'/>
                        </CarouselTitle>
                        <DocumentaryCarousel/>
                    </div>
                </div>
            </Suspense>
        </section>
    );
};