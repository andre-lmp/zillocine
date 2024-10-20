import { MutableRefObject, useRef, MouseEvent, Dispatch, SetStateAction } from "react";

// Icone com React-icons
import { IoPlay } from "react-icons/io5";

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import * as Style from './styles';

type componentProps = {
    seasonsList: tmdbObjProps[];
    selectedSeason: Dispatch<SetStateAction<string>>
}

export default function SelectSeason( props: componentProps ) {
    const checkboxInputRef: MutableRefObject<(HTMLInputElement | null)> = useRef( null );
    const selectedSeasonRef: MutableRefObject<(HTMLParagraphElement | null)> = useRef( null );

    /*Obtem o ano de lançamento de um filme ou serie*/
    const getReleaseDate = ( date: string ) => {
        const newDate = [];
        if ( !date ) return;
        for ( let i = 0; i < 4; i++ ) {
            newDate.push( date[i] );
        }
        return newDate.join('');
    };

    // Atualiza o texto do botão com a temporada selecionada e tambem o carousel
    const updateSelector = ( e: MouseEvent<any> ) => {
        const elementRef = e.target as HTMLParagraphElement;
        selectedSeasonRef.current && Object.assign( selectedSeasonRef.current, { innerText: elementRef.innerText } );
        props.selectedSeason( elementRef.id );
        checkboxToggle();
    };
    
    // Simula um click para o input que exibe/esconde o modal temporadas
    const checkboxToggle = () => {
        checkboxInputRef.current?.click();
    };

    return (
        <Style.ComponentWrapper>
            <div 
                onClick={checkboxToggle}
                className="btn focus:bg-darkpurple border-none outline-none hover:bg-darkpurple text-white text-base font-noto_sans font-medium bg-darkpurple w-fit px-10 flex items-center cursor-pointer rounded-md justify-center"
            >
                {/* Nome da temporada - Data de lançamento */}
                <p ref={selectedSeasonRef}>{ props.seasonsList[0].name } - {getReleaseDate( props.seasonsList[0].air_date )}</p>
                <IoPlay className="text-sm rotate-90 ml-5"/>
            </div>

            <input ref={checkboxInputRef} type="checkbox" id="my_modal_6" className="modal-toggle" />
            
            {/* Modal com todas as temporadas disponiveis */}
            <div className="modal" role="dialog">
                <div className="modal-box z-50 rounded-md bg-darkpurple seasons-modal">
                    <p className="text-lg font-medium font-noto_sans">Selecione uma temporada:</p>
                    <Style.SeasonsWrapper>
                        {/* Gerando as temporadas apartir da lista retornada pela api do TMDB */}
                        { props.seasonsList.map(( season, index ) => (
                            <p 
                                key={`${season.id}-${season.still_path}`}
                                onClick={(e) => { updateSelector( e )}}
                                id={season.season_number}
                                className="w-full h-[45px] flex items-center justify-center cursor-pointer bg-darkslateblue rounded-md">
                                    { season.name } - {getReleaseDate( season.air_date )}
                            </p>
                        ))}
                    </Style.SeasonsWrapper>

                    {/* Fechamento do modal */}
                    <div className="modal-action">
                    <button onClick={checkboxToggle} className="bg-white text-black h-[40px] cursor-pointer flex items-center justify-center font-noto_sans text-sm font-semibold rounded-md px-8">Cancelar</button>
                    </div>
                </div>
            </div>
           
        </Style.ComponentWrapper>
    );
};