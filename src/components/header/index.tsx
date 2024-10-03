'use client'

import { useRef, MutableRefObject, useEffect } from "react";

import { LuSearch } from "react-icons/lu";
import { FaUserLarge } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { TbMovie } from "react-icons/tb";
import { BiMoviePlay } from "react-icons/bi";

import MobileMenu from "./mobileMenu";
import * as Style from './styles';

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {

    const scrollDiv: MutableRefObject<(HTMLDivElement | null)> = useRef(null);
    const overlayRef = useRef(null);
    const navLinks: MutableRefObject<(HTMLLIElement | null)[]> = useRef([]);
    const navBar: MutableRefObject<(HTMLUListElement | null)> = useRef(null);
    const indicatorBar: MutableRefObject<(null | HTMLDivElement)> = useRef(null);
    const currentPathName = usePathname();

    /*Aqui atualizamos a posição da barra indicadora e tambem os stylos do link ativo sempre que o usuario muda de pagina*/
   useEffect(() => {
    navLinks.current.forEach( link => {
        if ([ '/series', '/movies', '/search', '/', '/downloads' ].includes( currentPathName )) {
            if ( currentPathName === `/${link?.id}` ) {
                if ( link ) {
                    const navBarCoordinates = navBar.current?.getBoundingClientRect();
                    const linkCoordinates = link.getBoundingClientRect();
                    if ( navBarCoordinates?.left && linkCoordinates.left && indicatorBar.current ) {
                        const activeLinkCoordinates = linkCoordinates.left - navBarCoordinates.left;
                        const indicatorBarStyles = {
                            width: `${linkCoordinates.width}px`,
                            left: `${( activeLinkCoordinates ).toFixed(0)}px`,
                        };
                        Object.assign( link?.style, { color: 'white' });
                        Object.assign( indicatorBar.current?.style, indicatorBarStyles );
                    };
                };
            } else {
               link && Object.assign( link?.style, { color: '#d4d4d4' });
            };
            return
        };

        indicatorBar.current && Object.assign( indicatorBar.current?.style, { width: '0px' });
    });
   },[ currentPathName ]);

    useEffect(() => {
        if ( typeof window !== undefined ) {
            const scrollHandler = () => {
                if ( scrollDiv.current ) {
                    window.scrollY > 50 ? (
                        scrollDiv.current.style.backgroundColor = 'rgba(8, 12, 30, 0.5)',
                        scrollDiv.current.style.backdropFilter = 'blur(4px)'
                    ) : (
                        scrollDiv.current.style.backgroundColor = 'transparent',
                        scrollDiv.current.style.backdropFilter = 'none'
                    )
                };
            };
    
            window.addEventListener('scroll', scrollHandler);
        };
    },[]);

    return true ? (
        <MobileMenu>
                <header className="fixed top-0 left-0 h-36 z-20 w-full before:w-full before:absolute before:top-0 before:left-0 before:h-full before:bg-gradient-to-b from-black to-transparent before:-z-10">
                    <nav ref={scrollDiv} className="w-full flex flex-row justify-between items-center px-4 py-5 md:px-6 lg:px-8">

                        <label htmlFor="my-drawer" className="md:hidden">
                            <nav className="flex flex-col gap-y-[6pt] justify-center items *:w-8 *:h-0.5 *:rounded-3xl *:bg-white">
                                <div></div>
                                <div></div>
                                <div></div>
                            </nav>
                        </label>

                        <div >
                            <h1 className="text-2xl font-bold md:text-[25px] ">ZilloCine</h1>
                        </div>

                        <nav className="flex flex-row items-center font-poppins font-medium">
                            <ul  ref={navBar} className="flex flex-row w-fit items-center justify-end gap-x-10 *:text-neutral-300 relative">
                                
                                <li key='home-link' id="" className="hidden md:flex text-lg cursor-pointer hover:text-white xl:text-[19px]" ref={(e) => { navLinks.current[0] = e }}>
                                    <Link href='/' className="flex items-center gap-x-3">
                                        <FiHome />
                                        Inicio
                                    </Link>
                                </li>

                                <li key='movies-link' id='movies' className="hidden md:inline text-lg cursor-pointer hover:text-white xl:text-[19px]" ref={(e) => { navLinks.current[1] = e }}>
                                    <Link href='/movies' className="flex items-center gap-x-3">
                                        <TbMovie />
                                        Filmes
                                    </Link>
                                </li>

                                <li key='series-link' id='series' className="hidden md:flex text-lg cursor-pointer hover:text-white xl:text-[19px]" ref={(e) => { navLinks.current[2] = e }}>
                                    <Link href='/series' className="flex items-center gap-x-3">
                                        <BiMoviePlay />
                                        Series
                                    </Link>
                                </li>

                                <li key='download-link' id="downloads" className="hidden w-full hover:text-white text-lg lg:flex xl:text-[19px]" ref={(e) => { navLinks.current[3] = e }}>
                                    <Link href='/downloads'>
                                        Donwloads
                                    </Link>
                                </li>

                                <li key='search-link' id='search' className="inline w-full md:text-neutral-400 text-white hover:text-white xl:text-[19px]" ref={(e) => { navLinks.current[4] = e }}>
                                    <Link href='/search'>
                                        <LuSearch className="max-[768px]:text-white text-4xl md:text-2xl"/>
                                    </Link>
                                </li>

                                <div ref={indicatorBar} className="hidden md:block absolute -bottom-[5px] w-0 h-0.5 bg-white rounded-lg left-0 duration-200 ease-in-out"></div>
                            </ul>
                        </nav>

                        <div className="hidden md:flex gap-x-5 items-center">
                            <button style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} className="w-[44px] h-[44px] rounded-full flex items-center justify-center outline-none border-none">
                                <FaUserLarge className="text-neutral-300 text-base" />
                            </button>

                            <h3 className="hidden xl:inline text-[19px] font-poppins font-medium text-neutral-300 hover:text-white cursor-pointer">Entrar</h3>
                        </div>

                    </nav>

                    <div ref={overlayRef} className="menu-overlay"></div>
                </header>
        </MobileMenu>
    ) : null;
};

