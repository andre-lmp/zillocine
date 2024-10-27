'use client';

// Hooks
import { useRef, useEffect, MutableRefObject, MouseEvent, useState } from 'react';
import useTmdbFetch from '@/components/hooks/tmdbHook';

// Componente para mostrar os resultados da pesquisa do usuario
import ShowResults from '@/components/pages/searchPage/searchResult';

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from '@/components/contexts/tmdbContext';

// Icones
import { FiSearch } from "react-icons/fi";
import { HiXMark } from "react-icons/hi2";

export default function SearchPage() {

    const searchButtonsRef: MutableRefObject<(HTMLButtonElement |  null)[]> = useRef([]);
    const searchInputRef: MutableRefObject<(HTMLInputElement | null)> = useRef( null );
    const [ contentData, setContentData ] = useState<tmdbObjProps[]>([]);
    const [ contentType, setContentType ] = useState<string>( 'movie' );
    const { fetchReleasedMovies, fetchReleasedSeries, fetchSerieByTerm, fetchMovieByTerm } = useTmdbFetch();

    /*Muda a cor do botão selecionado pelo usuario*/
    const handleSelectedButton = ( event: MouseEvent<any>  ) => {
        const eventRef = ( event.target as HTMLButtonElement );

        // Aplicando estilo anterior ao botão não selecionado
        searchButtonsRef.current.forEach( element => {
            if ( element?.id !== eventRef.id ) {
                element?.style && Object.assign( element?.style, { backgroundColor: '#16142b', color: '#f5f5f5' });
            }
        });

        // Aplicando estilo ao botão selecionado
        Object.assign( eventRef.style, { backgroundColor: 'orangered', color: 'white' });
        setContentType( eventRef.id)

        // Verifica o valor do input e o id do botão selecionado para chamar uma função de busca de conteudo
        if ( searchInputRef.current ) {
            if ( searchInputRef.current.value.length < 3 ) {
                if ( eventRef.id === 'movie' ) {
                    handleFetchResponse(fetchReleasedMovies());
                } else {
                    handleFetchResponse(fetchReleasedSeries());
                }
            } else {
                fetchContentByTerm(( searchInputRef.current?.value ?? ''), eventRef.id );
            }
        }
    };

    const fetchContentByTerm = ( e: string, fetchType: string ) => {
        if ( fetchType === 'movie' ) {
            handleFetchResponse(fetchMovieByTerm( e ));
        } else {
            handleFetchResponse(fetchSerieByTerm( e ))
        };              
    };

    const resetSearchInput = () => {
        if ( searchInputRef.current ) {
            Object.assign( searchInputRef.current, { value: null });
        };

        // Ao resetar o input, uma função de busca e chamada
        if ( contentType === 'movie' ) {
            handleFetchResponse(fetchReleasedMovies());
        } else {
            handleFetchResponse(fetchReleasedSeries());
        };
    };

    const checkAvailability = ( data: tmdbObjProps[] ) => {
        const filtered = data.filter( item => item.poster_path || item.backdrop_path );
        setContentData( filtered );
    };

    // Lida com a promise retornarda por uma função de busca
    const handleFetchResponse = async ( fetchResponse: Promise<any> ) => {
        const response = await fetchResponse;
        if ( response.length ) {
            checkAvailability( response );
        }
    };

    useEffect(() => {
        if ( searchButtonsRef.current[0] && searchInputRef ) {
            Object.assign( searchButtonsRef.current[0].style, { backgroundColor: 'orangered', color: 'white' })
        }

        handleFetchResponse(fetchReleasedMovies());
    }, []);

    return (
        <section className="flex flex-col px-4 w-full min-h-screen mt-32 font-roboto font-normal md:px-6 lg:px-8">
            <div className='w-full flex flex-col gap-y-3'>
                <div className='bg-darkpurple flex items-center rounded-md px-4 w-full'>
                    <FiSearch className='text-2xl text-neutral-100'/>
                    <input
                        type="text"
                        ref={searchInputRef}
                        onChange={(e) => { fetchContentByTerm( e.target.value, contentType ) }}
                        placeholder='O que você esta procurando ?'
                        className='w-full h-[56px] bg-transparent text-neutral-100 placeholder:text-neutral-300 px-4 text-lg border-none outline-none'
                        required
                    />
                    <HiXMark 
                        onClick={resetSearchInput} 
                        className='text-neutral-100 text-2xl'
                    />
                </div>

                <div>
                    <button 
                        ref={(e) => { searchButtonsRef.current[0] = e }} 
                        className='h-9 px-7 rounded-md text-neutral-100 bg-darkpurple border-none outline-none'
                        onClick={(e) => { handleSelectedButton(e) }}
                        id='movie'
                        >Filmes
                    </button>

                    <button  
                        ref={(e) => { searchButtonsRef.current[1] = e }} 
                        className='ml-3 h-9 px-7 rounded-md text-neutral-100 bg-darkpurple border-none outline-none'
                        onClick={(e) => { handleSelectedButton(e) }}
                        id='serie'
                        >Series
                    </button>
                </div>
            </div>

            <div className='py-7'>
                <ShowResults typeOfId={contentType} fetchData={contentData}/>
            </div>
        </section>
    );
};