'use client'

import { useRef, MutableRefObject, useEffect, useContext } from "react";

import { LuSearch } from "react-icons/lu";
import { FaUserLarge } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { BiMoviePlay, BiCameraMovie } from "react-icons/bi";
import { IoMdDownload } from "react-icons/io";

import MobileMenu from "./mobileMenu";

import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {

    const scrollDiv: MutableRefObject<(HTMLDivElement | null)> = useRef(null);
    const overlayRef = useRef(null);
    const navLinks: MutableRefObject<(HTMLLIElement | null)[]> = useRef([]);
    const navBar: MutableRefObject<(HTMLUListElement | null)> = useRef(null);
    const indicatorBar: MutableRefObject<(null | HTMLDivElement)> = useRef(null);
    const currentPathName = usePathname();
    const globalEvents = useContext( GlobalEventsContext );

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
        link && Object.assign( link?.style, { color: '#d4d4d4' });

    });
   },[ currentPathName ]);

   const scrollHandler = () => {
        if ( window.innerWidth < 768 ) {
            if ( scrollDiv.current ) {
                if ( window.scrollY > 50 ) {
                    const updateStyles = { 
                        backgroundColor: 'rgba(8, 12, 30, 0.5)',
                        backdropFilter: 'blur(4px)', 
                    };

                    Object.assign( scrollDiv.current.style, updateStyles );
                } else {
                    const updateStyles = { 
                        backgroundColor: 'transparent',
                        backdropFilter: 'none', 
                    };

                    Object.assign( scrollDiv.current.style, updateStyles );
                }
            };

        } else {
            if ( scrollDiv.current ) {
                if ( window.scrollY > 50 ) {
                    const updateStyles = { 
                        backgroundColor: '#16142B',
                    };

                    Object.assign( scrollDiv.current.style, updateStyles );
                } else {
                    const updateStyles = { 
                        backgroundColor: '#020515',
                    };

                    Object.assign( scrollDiv.current.style, updateStyles );
                }
            };   
        }
    };

    useEffect(() => {
        if ( typeof window !== undefined ) {
            scrollHandler();
            window.addEventListener('scroll', scrollHandler);
            window.addEventListener('resize', scrollHandler);
        };
    },[]);

    const loginModalToggle = () => {
        globalEvents.setModalsController( prev  => ({
            ...prev,
            isLoginModalActive: !prev.isLoginModalActive,
        }));
    };

    const RegisterModalToggle = () => {
        globalEvents.setModalsController( prev  => ({
            ...prev,
            isRegisterModalActive: !prev.isRegisterModalActive,
        }));
    };

    return true ? (
        <MobileMenu>
                <header className="fixed top-0 left-1/2 -translate-x-1/2 h-36 md:h-auto z-20 w-full before:w-full before:absolute before:top-0 before:left-0 before:h-full before:bg-gradient-to-b from-black to-transparent before:-z-10 max-w-[2200px]">
                    <nav ref={scrollDiv} className="w-full flex flex-row justify-between items-center px-4 py-5 md:px-6 md:py-0 h-20 lg:px-8">

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
                            <ul  ref={navBar} className="flex flex-row w-fit items-center *:text-neutral-300 justify-end gap-x-10 relative">
                                
                                <li key='home-link' id="" className="hidden md:flex text-lg cursor-pointer 2xl:text-[19px]" ref={(e) => { navLinks.current[0] = e }}>
                                    <Link href='/' className="flex items-center gap-x-2">
                                        <FiHome />
                                        Inicio
                                    </Link>
                                </li>

                                <li key='movies-link' id='movies' className="hidden md:inline text-lg cursor-pointer 2xl:text-[19px]" ref={(e) => { navLinks.current[1] = e }}>
                                    <Link href='/movies' className="flex items-center gap-x-2">
                                        <BiCameraMovie className="text-xl"/>
                                        Filmes
                                    </Link>
                                </li>

                                <li key='series-link' id='series' className="hidden md:flex text-lg cursor-pointer 2xl:text-[19px]" ref={(e) => { navLinks.current[2] = e }}>
                                    <Link href='/series' className="flex items-center gap-x-2">
                                        <BiMoviePlay />
                                        Series
                                    </Link>
                                </li>

                                <li key='download-link' id="downloads" className="hidden w-full text-lg lg:flex 2xl:text-[19px]" ref={(e) => { navLinks.current[3] = e }}>
                                    <Link href='/downloads' className="flex items-center gap-x-2">
                                        <IoMdDownload/>
                                        Donwloads
                                    </Link>
                                </li>

                                <li key='search-link' id='search' className="inline w-full md:text-neutral-400 text-white 2xl:text-[19px]" ref={(e) => { navLinks.current[4] = e }}>
                                    <Link href='/search'>
                                        <LuSearch className="max-[768px]:text-white text-4xl md:text-2xl"/>
                                    </Link>
                                </li>

                                <div ref={indicatorBar} className="hidden md:block absolute -bottom-[5px] w-0 h-0.5 bg-white rounded-lg left-0 duration-200 ease-in-out"></div>
                            </ul>
                        </nav>

                        <div className="hidden md:flex gap-x-5 items-center">
                            <div className="dropdown dropdown-end dropdown-hover">

                                <button id="account-button" tabIndex={0} role="button" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} className="w-[44px] h-[44px] rounded-full flex items-center justify-center outline-none border-none">
                                    <FaUserLarge className="text-neutral-300 text-base" />
                                </button>

                                <div tabIndex={0} className="dropdown-content pt-2">
                                    <ul tabIndex={0} className="bg-darkpurple rounded-box z-[1] w-60 p-4 shadow">
                                        <li onClick={() => RegisterModalToggle()} className="px-4 h-10 rounded-3xl bg-orangered text-white font-poppins text-[15px] flex items-center justify-center font-medium cursor-pointer btn hover:bg-orangered">Criar conta</li>
                                        
                                        <li onClick={() => loginModalToggle()} className="px-4 h-10 rounded-3xl bg-neutral-700 text-white font-poppins text-[15px] flex items-center justify-center font-medium cursor-pointer mt-2 btn hover:bg-neutral-700">Entrar</li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </nav>
                    <div ref={overlayRef} className="menu-overlay"></div>
                </header>
        </MobileMenu>
    ) : null;
};

