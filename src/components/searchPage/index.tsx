'use client';

import { useRef, useEffect, MutableRefObject, MouseEvent, useState } from 'react';

import ShowResults from '@/components/searchPage/searchResult';

import useTmdbFetch from '@/components/hooks/tmdbHook';
import { tmdbObjProps } from '../contexts/tmdbContext';

import { FiSearch } from "react-icons/fi";
import { HiXMark } from "react-icons/hi2";

export default function SearchPage() {
    const searchButtonsRef: MutableRefObject<(HTMLButtonElement |  null)[]> = useRef([]);
    const searchInputRef: MutableRefObject<(HTMLInputElement | null)> = useRef( null );
    const [ contentData, setContentData ] = useState<tmdbObjProps[]>([]);
    const [ contentType, setContentType ] = useState<string>( 'movie' );
    const { fetchReleasedMovies, fetchReleasedSeries, fetchSerieByTerm, fetchMovieByTerm } = useTmdbFetch();

    /*Muda a cor do botão selecionado pelo usuario*/
    const handleSelectedButton = ( e: MouseEvent<any>  ) => {
        const elementRef = ( e.target as HTMLButtonElement );

        searchButtonsRef.current.forEach( element => {
            element?.style && Object.assign( element?.style, { backgroundColor: '#262626', color: '#f5f5f5' });
        });

        Object.assign( elementRef.style, { backgroundColor: 'white', color: 'black' });
        setContentType( elementRef.id)

        if ( searchInputRef.current ) {
            if ( searchInputRef.current.value.length < 3 ) {
                elementRef.id === 'movie' ? 
                    fetchHandler(fetchReleasedMovies()) : fetchHandler(fetchReleasedSeries())
            } else {
                fetchContentByTerm(( searchInputRef.current?.value ?? ''), elementRef.id );
            }
        }
    };

    const fetchContentByTerm = ( e: string, fetchType: string ) => {
        if ( e.length >= 3 ) {
            fetchType === 'movie' ? 
                fetchHandler( fetchMovieByTerm(e) ) : fetchHandler( fetchSerieByTerm(e) )
        };
    };

    const resetSearchInput = () => {
        if ( searchInputRef.current ) {
            Object.assign( searchInputRef.current, { value: null });
        }

        contentType === 'movie' ? 
            fetchHandler(fetchReleasedMovies()) : fetchHandler(fetchReleasedSeries())
    };

    const checkAvailability = ( data: tmdbObjProps[] ) => {
        const filtered = data.filter( item => item.poster_path || item.backdrop_path );
        setContentData( filtered );
    };

    const fetchHandler = async ( fetchResponse: Promise<any> ) => {
        const response = await fetchResponse;
        if ( response.length ) {
            checkAvailability( response );
        }
    };

    useEffect(() => {
        if ( searchButtonsRef.current[0] && searchInputRef ) {
            Object.assign( searchButtonsRef.current[0].style, { backgroundColor: 'white', color: 'black' })
        }

        fetchHandler(fetchReleasedMovies());
    }, []);

    return (
        <section className="flex flex-col px-4 w-full min-h-screen mt-32 font-roboto font-normal">
            <div className='w-full flex flex-col gap-y-3'>
                <div className='bg-neutral-800 flex items-center rounded-md px-4 w-full'>
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
                        onClick={() => { resetSearchInput() }} 
                        className='text-neutral-100 text-2xl'
                    />
                </div>

                <div>
                    <button 
                        ref={(e) => { searchButtonsRef.current[0] = e }} 
                        className='h-9 px-7 rounded-md text-neutral-100 bg-neutral-800'
                        onClick={(e) => { handleSelectedButton(e) }}
                        id='movie'
                        >Filmes
                    </button>

                    <button  
                        ref={(e) => { searchButtonsRef.current[1] = e }} 
                        className='ml-3 h-9 px-7 rounded-md text-neutral-100 bg-neutral-800'
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