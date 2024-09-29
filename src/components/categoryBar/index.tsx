'use client'

import { useState, MouseEvent, SetStateAction, Dispatch, useRef, MutableRefObject, useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { tmdbObjProps } from '../contexts/tmdbContext';

import * as Style from '@/components/categoryBar/styles';

type categoryBarProps = {
    selectGenre: Dispatch<SetStateAction<string>>
    genresList: tmdbObjProps;
};

export default function CategoryBar( props: categoryBarProps ) {
    const currentPathName = usePathname();
    const categoryElementsRef: MutableRefObject<(HTMLLIElement | null)[]> = useRef([]);

    /*Função responsavel por mudar a cor do botão quando o usuario seleciona alguma categoria*/
    const changeCategoryStyle = ( e: MouseEvent<any> ) => {
        props.selectGenre( (e.target as HTMLLIElement).id );

        categoryElementsRef.current.forEach( element => {
            element?.style && Object.assign( element?.style, { backgroundColor: '#16142B' } )
        });

        Object.assign(( e.target as HTMLLIElement ).style, { backgroundColor: '#ff4500' });

    };

    useEffect(() => {

        if (  categoryElementsRef.current && categoryElementsRef.current[0]?.style ) {
            Object.assign( categoryElementsRef.current[0]?.style, { backgroundColor: '#ff4500' });
        }

    },[]);

    const categoriesList = Object.keys( props.genresList ).map(( key, index ) => (
       key !== 'allGenres' 
            && 
                <li 
                    ref={(e) => { categoryElementsRef.current[index] = e }} 
                    id={ key } key={ `${currentPathName}-${key}` } 
                    onClick={ (e) => changeCategoryStyle(e) }>
                    { props.genresList[key][2] }
                </li>
    ));

    return (
        <Style.CategoriesWrapper>
            <ul className='font-roboto font-medium text-base *:cursor-pointer'>
                { categoriesList }
            </ul>
        </Style.CategoriesWrapper>
    )
};