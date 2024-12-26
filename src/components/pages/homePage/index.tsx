import dynamic from "next/dynamic";

import HeaderCarousel from "@/components/headerCarousel";
const FetchCarouselData = dynamic(() => import('./fetchCarouselData'), { ssr: false });
const CarouselTitle = dynamic(() => import('./carouselTitle'), { ssr: false });

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
                <div className="mt-4 flex flex-col gap-y-[40px] pb-6">

                    {/* Seção dos filmes mais recentes e os que ainda estão por vir */}
                    <FetchCarouselData 
                        contentGenre={tmdbMovieGenres.release[0]} 
                        contentType='movie' 
                        pageNumber={1}
                        navigation={{ prevEl: `button-prev-0`, nextEl: `button-next-0` }}
                    >
                        <CarouselTitle type="normal">{tmdbMovieGenres.release[1]}</CarouselTitle>  
                        <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>
                    </FetchCarouselData> 

                    {/* Seção dos filmes mais recentes e os que ainda estão por vir */}
                    <FetchCarouselData 
                        contentGenre={''} 
                        contentType='trending' 
                        pageNumber={1}
                        navigation={{ prevEl: `button-prev-1`, nextEl: `button-next-1` }}
                    >
                        <CarouselTitle type="focus">Em alta</CarouselTitle>
                        <p className="font-normal text-[17px] font-noto_sans text-neutral-400 mb-5">
                            Top 20 filmes e séries mais assistidos hoje!
                        </p>  
                    </FetchCarouselData> 

                    {/* Seção dos filmes mais recentes e os que ainda estão por vir */}
                    <FetchCarouselData 
                        contentGenre={tmdbMovieGenres.horror[0]} 
                        contentType='movie' 
                        pageNumber={1}
                        navigation={{ prevEl: `button-prev-2`, nextEl: `button-next-2` }}
                    >
                        <CarouselTitle type="normal">{tmdbMovieGenres.horror[1]}</CarouselTitle>  
                        <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>
                    </FetchCarouselData> 

                    {/* Seção dos filmes mais recentes e os que ainda estão por vir */}
                    <FetchCarouselData 
                        contentGenre={tmdbMovieGenres.war[0]} 
                        contentType='movie' 
                        pageNumber={1}
                        navigation={{ prevEl: `button-prev-3`, nextEl: `button-next-3` }}
                    >
                        <CarouselTitle type="normal">{tmdbMovieGenres.war[1]}</CarouselTitle>  
                        <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>
                    </FetchCarouselData> 

                    {/* Seção dos filmes mais recentes e os que ainda estão por vir */}
                    <FetchCarouselData 
                        contentGenre={''} 
                        contentType='trending' 
                        pageNumber={1}
                        navigation={{ prevEl: `button-prev-4`, nextEl: `button-next-4` }}
                    >
                        <CarouselTitle type="focus">Em alta</CarouselTitle>
                        <p className="font-normal text-[17px] font-noto_sans text-neutral-400 mb-5">
                            Acompanhe os filmes e séries mais assistidos hoje!
                        </p>  
                    </FetchCarouselData> 

                    {/* Seção dos filmes mais recentes e os que ainda estão por vir */}
                    <FetchCarouselData 
                        contentGenre={tmdbMovieGenres.fiction[0]} 
                        contentType='movie' 
                        pageNumber={1}
                        navigation={{ prevEl: `button-prev-5`, nextEl: `button-next-5` }}
                    >
                        <CarouselTitle type="normal">{tmdbMovieGenres.fiction[1]}</CarouselTitle>  
                        <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>
                    </FetchCarouselData> 

                    {/* Seção dos filmes mais recentes e os que ainda estão por vir */}
                    <FetchCarouselData 
                        contentGenre={tmdbMovieGenres.documentary[0]} 
                        contentType='movie' 
                        pageNumber={1}
                        navigation={{ prevEl: `button-prev-6`, nextEl: `button-next-6` }}
                    >
                        <CarouselTitle type="normal">{tmdbMovieGenres.documentary[1]}</CarouselTitle>  
                        <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>
                    </FetchCarouselData> 
                </div>
            </Suspense>
        </section>
    );
};