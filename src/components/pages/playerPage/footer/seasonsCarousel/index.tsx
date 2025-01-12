'use client';

import { useEffect, useState, useRef } from "react";

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// Hook personalizado do TMDB com funções de busca de conteudo
import useTmdbFetch from "@/components/hooks/tmdb";

// Modal que exibe as opções de temporadas da serie
import SelectSeason from "./seasonSelector";

import { handlePromise } from "@/components/utils/tmdbApiData/promise";

import SeasonsCarousel from "@/components/emblaCarousel/templates/episodes/index";

type ComponentProps = {
    seasons: tmdbObjProps[];
    serieId: string;
    serieName: string;
};

export default function SerieSeansons( props: ComponentProps ) {

    const { fetchSeasons } = useTmdbFetch();
    const [ seasonData, setSeasonData ] = useState<tmdbObjProps>();
    const [ selectedSeasonNumber, setSelectedSeasonNumber ] = useState<string>('1')
    const [ isLoading, setIsLoading ] = useState( true );

    useEffect(() => {
        ( async () => {
            const season = await handlePromise(fetchSeasons( props.serieId, selectedSeasonNumber ));
            setSeasonData( season );
            setIsLoading( false );
        })();
    }, [ selectedSeasonNumber ]);

    return seasonData?.episodes && !isLoading ? (
        <div className='px-4 w-full pt-8 pb-6 md:px-6 lg:px-8 font-noto_sans'>
            
            {/* Seletor de temporada */}
            <SelectSeason selectedSeason={setSelectedSeasonNumber} seasonsList={props.seasons}/>

            {/* Titulo do carousel */}
            <p className="mb-1 text-[17px] font-medium xl:text-lg whitespace-nowrap max-w-full overflow-hidden text-ellipsis">{props.serieName} - {seasonData?.name}</p>
            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>

            {/* carousel aqui  */}
            <SeasonsCarousel 
                episodes={seasonData.episodes} 
                serieId={props.serieId} 
                serieName={props.serieName}
                seasonNumber={selectedSeasonNumber}
            />
        </div>
    ) : null;
};