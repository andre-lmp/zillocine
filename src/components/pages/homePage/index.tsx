import HeaderCarousel from "@/components/headerCarousel";
import FetchCarouselData from "./fetchCarouselData";

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
        <div className='w-screen h-screen fixed z-[400] flex justify-center items-center'>
            <span className="loading loading-spinner loading-lg text-neutral-400"></span>
        </div>
    );

    // Gera um carousel de slides para cada genero dentro do contexto
    const carouselsList =  Object.values( tmdbMovieGenres ).map(( movieDetails, index ) => (
        <FetchCarouselData 
            key={`home-${movieDetails[1]}`}
            contentGenre={movieDetails[0]} 
            contentType='movie' 
            sectionTitle={movieDetails[1]} 
            pageNumber={1}
            navigation={{ prevEl: `button-prev-${index}`, nextEl: `button-next-${index}` }}
        />
    ));

    return (
        <section className="min-h-screen" >
            <Suspense fallback={loading}>
                <HeaderCarousel currentPage="home"/>
                <div className="mt-4 flex flex-col gap-y-[30px] pb-6">{ carouselsList }</div>
            </Suspense>
        </section>
    );
};