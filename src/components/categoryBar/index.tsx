'use client'

import { MouseEvent, SetStateAction, Dispatch, useRef, MutableRefObject, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from '../contexts/tmdbContext';

import * as Style from '@/components/categoryBar/styles';

type categoryBarProps = {
    selectGenre: Dispatch<SetStateAction<string>>
    genresList: tmdbObjProps;
};

export default function CategoryBar( props: categoryBarProps ) {

    const [ isLoading, setIsLoading ] = useState( true )
    const currentPathName = usePathname();
    const categoryElementsRef: MutableRefObject<(HTMLLIElement | null)[]> = useRef([]);

    /*Muda a cor do botão quando o usuario seleciona alguma categoria*/
    const changeCategoryStyle = ( e: MouseEvent<any> ) => {
        props.selectGenre( (e.target as HTMLLIElement).id );

        categoryElementsRef.current.forEach( element => {
            element?.style && Object.assign( element?.style, { backgroundColor: '#16142B', color: '#e5e5e5' } )
        });

        Object.assign(( e.target as HTMLLIElement ).style, { backgroundColor: '#ff4500', color: 'white' });

    };

    useEffect(() => {
        if (  categoryElementsRef.current && categoryElementsRef.current[0]?.style ) {
            Object.assign( categoryElementsRef.current[0]?.style, { backgroundColor: '#ff4500' });
        }

        setIsLoading( false );
    },[]);

    // Gera uma lista de categorias que o usuario pode selecionar
    const categoriesList = Object.keys( props.genresList ).map(( key, index ) => (
       key !== 'allGenres' 
            && 
                <li 
                    ref={(e) => { categoryElementsRef.current[index] = e }} 
                    id={ key }
                    key={ `${currentPathName}-${key}` } 
                    onClick={ (e) => changeCategoryStyle(e) }>
                    { props.genresList[key][2] }
                </li>
    ));

    return (
        <Style.CategoriesWrapper>
            <ul style={{ opacity: isLoading ? 0 : 1 }} className='font-noto_sans font-medium text-base *:cursor-pointer text-neutral-200 ease-linear duration-200'>
                { categoriesList }
            </ul>
        </Style.CategoriesWrapper>
    )
};