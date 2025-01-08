'use client';

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/opacity.css';

import EmblaCarousel from "../../index";

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import { getRunTime } from "@/components/utils/tmdbApiData/runtime";
import { getReleaseDate } from "@/components/utils/tmdbApiData/releaseDate";

import '@/components/emblaCarousel/templates/episodes/index.css';

type ComponentProps = {
    episodes: tmdbObjProps[];
    serieId: string;
    serieName: string;
    seasonNumber: string;
};

export default function EpisodesCarousel( props: ComponentProps ) {
    return (
        <div className="season-container">
            <EmblaCarousel navigationType='default'>
                {/* Gerando slides apartir da lista de episodios retornados pela api do TMDB */}
                { props.episodes.map(( episode: tmdbObjProps ) => (
                    episode.still_path ? (
                        // Container do slide
                        <div
                            className="embla__slide"
                            key={`episode-${episode.id}`}
                        >
                            <LazyLoadImage
                                src={`https://image.tmdb.org/t/p/original/${episode.still_path}`}
                                alt={`presentation image of the seventh season of ${props.serieName}`}
                                width={'100%'}
                                loading="lazy"
                                effect="opacity"
                                placeholderSrc={`https://image.tmdb.org/t/p/w92/${episode.poster_path ?? episode.backdrop_path}`}
                                className='w-full h-44 object-cover rounded-md bg-darkpurple'
                            />

                            {/* Tutilo do episodio */}
                            <p className="text-base mt-2 line-clamp-1 font-bold leading-relaxed text-neutral-100">
                                Ep_{ episode.episode_number && `${episode.episode_number}:` } { episode.name ?? '' }
                            </p>

                            <div className="my-2 flex gap-x-3">
                                {/* Data de lançamento  */}
                                <p className="bg-orangered rounded-[4px] flex items-center w-fit px-3 h-6 text-base font-normal">
                                    {getReleaseDate( episode.air_date )}
                                </p>
                                {/* Duração do episodio */}
                                <p>{getRunTime( episode.runtime )}</p>
                            </div>
                            {/* Descrição */}
                            <p className="text-base line-clamp-3 font-normal leading-relaxed text-neutral-400">
                                { episode.overview.length > 3 ? episode.overview : 'Desculpe... não foi possível carregar a descrição deste conteúdo.' }
                            </p>
                        </div>
                    ) : null
                ))}
            </EmblaCarousel>
        </div>
    );
};