'use client'

import { useRef, useState, MutableRefObject, useEffect } from "react";

import Link from "next/link";

import { LuSearch } from "react-icons/lu";
import { FaUserLarge } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { TbMovie } from "react-icons/tb";
import { BiMoviePlay } from "react-icons/bi";

import MobileMenu from "./mobileMenu";

export default function Header() {

    const scrollDiv: MutableRefObject<(HTMLDivElement | null)> = useRef(null);
    const overlayRef = useRef(null);
    const navLinks: MutableRefObject<(HTMLLIElement | null)[]> = useRef([]);
    const navBar: MutableRefObject<(HTMLUListElement | null)> = useRef(null);
    const indicatorBar: MutableRefObject<(null | HTMLDivElement)> = useRef(null);

    /*
    const animationBar = ( navLinksRef: any[], navBarRef: HTMLUListElement ) => {
        for ( let index = 0; index < navLinksRef.length; index++ ) {
            navLinksRef[index].addEventListener('click', () => {
                if ( navBarRef )  { 
                    const navBarCords = navBarRef.getBoundingClientRect() ;
                    const navLinkCords = navLinksRef[index].getBoundingClientRect();
                    indicatorBar.current && ( indicatorBar.current.style.left = `${ navLinkCords.left - navBarCords?.left }px` );
                    indicatorBar.current && ( indicatorBar.current.style.width = `${ navLinksRef[index].offsetWidth }px` );
                };
            });
        };
    };

    const startLinksBar = ( navLinksRef: any[], navBarRef: HTMLUListElement ) => {
        const page = Object.values(currentPage)[0];
        if ( navBarRef ) {
            const navCords = navBarRef.getBoundingClientRect();
            for ( let index = 0; index < navBarRef.childElementCount; index++ ) {
                indicatorBar.current &&
                    page === navLinksRef[index].id && (
                        indicatorBar.current.style.left = `${ navLinksRef[index].getBoundingClientRect().left - navCords.left }px`,
                        indicatorBar.current.style.width = `${ navLinksRef[index].offsetWidth }px`
                    );
            };
        };
    };

    useEffect(() => {
        const callAnimation = () => {
            if ( navLinks.current[1] && indicatorBar.current && navBar.current ) {
               startLinksBar( navLinks.current, navBar.current ),
               animationBar( navLinks.current, navBar.current )
            } else { setTimeout(() => {
                callAnimation();
            }, 100)}
            
        };

        callAnimation();
        setAuthorized(true);

    }, []);

    useEffect(() => {
        const page = Object.values(currentPage)[0];
        const paths = ['Series', 'Movies', 'Search', ''];
        const insideSpecialRoutes = () => {
            for (let index in paths) {
                if (paths[index] === page) {
                    return true;
                }
            }

            return false;
        };

        if (!insideSpecialRoutes()) {
            if (indicatorBar.current) {
                indicatorBar.current.style.width = '0px';
            }
        }
    }, [Object.values(currentPage)[0]]);
    */

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
                    <nav ref={scrollDiv} className="w-full flex flex-row justify-between items-center px-4 py-5">

                        <label htmlFor="my-drawer">
                            <nav className="flex flex-col gap-y-[6pt] justify-center items *:w-8 *:h-0.5 *:rounded-3xl *:bg-white">
                                <div></div>
                                <div></div>
                                <div></div>
                            </nav>
                        </label>

                        <div >
                            <h1 className="text-2xl font-bold">ZilloCine</h1>
                        </div>

                        <nav className="flex flex-row items-center">
                            <ul  ref={navBar} className="flex flex-row w-fit items-center justify-end gap-x-10 *:flex-row *:items-center *:gap-x-5">
                                <li key='home-link' id="/" className="hidden" ref={(e) => { navLinks.current[0] = e }}>
                                    <FiHome />
                                    Inicio
                                </li>

                                <li key='movies-link' id='movies' className="hidden" ref={(e) => { navLinks.current[1] = e }}>
                                    <TbMovie />
                                    Filmes
                                </li>

                                <li key='series-link' id='series' className="hidden" ref={(e) => { navLinks.current[2] = e }}>
                                    <BiMoviePlay />
                                    Series
                                </li>

                                <li key='search-link' id='search' className="inline w-full" ref={(e) => { navLinks.current[3] = e }}>
                                    <Link href='/search'>
                                        <LuSearch className="text-white text-4xl"/>
                                    </Link>
                                </li>

                                <div ref={indicatorBar} className="hidden"></div>
                            </ul>

                            <div className="flex-row hidden">
                                <button className="w-10 h-10 rounded-full outline-none border-[1.5pt] border-white flex justify-center items-center">
                                    <FaUserLarge className="text-gray-300 text-sm" />
                                </button>
                                <h3 className="hidden">Entrar</h3>
                            </div>

                        </nav>

                    </nav>

                    <div ref={overlayRef} className="menu-overlay"></div>
                </header>
        </MobileMenu>
    ) : null;
};

