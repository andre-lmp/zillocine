import React, { MutableRefObject, useState, useEffect, useRef } from "react";

import Link from "next/link";

import LoginFormButton from "@/components/authenticateUsers/loginModal";

import { FiHome } from "react-icons/fi";
import { TbMovie } from "react-icons/tb";
import { BiMoviePlay } from "react-icons/bi";
import { LuSearch } from 'react-icons/lu';
import { FaUserLarge } from 'react-icons/fa6';
import { CgNotes } from "react-icons/cg";
import { IoMdDownload } from "react-icons/io";

import { usePathname } from "next/navigation";

export default function MobileMenu({ children } : { children: React.ReactNode }) {
    const drawerInput: MutableRefObject<( HTMLInputElement | null )> = useRef( null );
    const mobileNavLinks: MutableRefObject<(HTMLLIElement | null)[]> = useRef([]);
    const currentPathName = usePathname();

    /*Responsavel por mudar o estilo dos elementos do menu mobile sempre que o usuario muda de pagina*/
    const changeMenuStyle = ( pathname: string ) => {
        const activeRouteStyle = {
            backgroundColor: '#16142B',
            color: 'white'
        };

        const inactiveRouteStyle = {
            backgroundColor: '#080C1E',
            color: '#737373'
        };

        mobileNavLinks.current && mobileNavLinks.current.forEach( element => {
            if ( element?.id !== pathname  ) {
                element?.style && Object.assign( element.style, inactiveRouteStyle );
            } else {
                element?.style && Object.assign( element.style, activeRouteStyle );
            }
        });

    };

    useEffect(() => {
        changeMenuStyle( currentPathName );
    }, [ currentPathName ]);

    /*Função que simula um click para um input que controla o menu mobile*/
    const drawerToggle = () => {
        drawerInput.current && drawerInput.current.click();
    };

    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" ref={drawerInput}/>
            <div className="drawer-content z-30">
                { children }
            </div>
            <div className="drawer-side z-40">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                
                <div className="min-w-64 bg-richblack text-gray-50 h-dvh pb-5 font-medium text-lg flex flex-col">
                    
                    <div className="w-full h-32 flex items-center bg-darkpurple pl-4 gap-x-3">
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} className="w-16 h-16 flex justify-center items-center rounded-full">
                            <FaUserLarge className="text-lg text-neutral-300"/>
                        </div>

                        <div className="text-neutral-300">
                            <p className="font-semibold text-lg">Novo usuario</p>
                            <div onClick={() => { drawerToggle() }}>
                                <LoginFormButton
                                    style={{
                                        'font-size': '16px',
                                        'font-weight': 'normal'
                                    }}
                                    text="Acessar conta"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <ul className="pt-7 text-lg flex flex-col gap-y- *:flex *:py-4 *:pl-4 *:items-center *:gap-x-3 *:font-roboto">
                        <li key='mb-home-link' id="/" ref={(e) => { mobileNavLinks.current[0] = e }} className="text-neutral-500" onClick={() => { drawerToggle() }}>
                            <FiHome/>
                            <Link href={'/'}>Inicio</Link>
                        </li>

                        <li key='mb-movies-link' id="/movies" ref={(e) => { mobileNavLinks.current[1] = e }} className="text-neutral-500" onClick={() => { drawerToggle() }}>
                            <TbMovie/>
                            <Link href={'/movies'}>Filmes</Link>
                        </li>

                        <li key='mb-series-link' id="/series" ref={(e) => { mobileNavLinks.current[2] = e }} className="text-neutral-500" onClick={() => { drawerToggle() }}>
                            <BiMoviePlay/>
                            <Link href={'/series'}>Series</Link>
                        </li>

                        <li key='mb-search-link' id="/search" ref={(e) => { mobileNavLinks.current[3] = e }} className="text-neutral-500" onClick={() => { drawerToggle() }}>
                            <LuSearch/>
                            <Link href={'/search'}>Pesquisa</Link>
                        </li>
                        
                        <li key='mb-none-link'></li>
                        <li key='mb-none-link-2'></li>

                        <li key={'mb-downloads-link'} id="/downloads" className="-translate-x-0.5 text-neutral-500" onClick={() => { drawerToggle() }}>
                            <IoMdDownload className="text-[23px] "/>
                            <Link href={'/downloads'}>Downloads</Link>
                        </li>

                        <li  key={'mb-about-link'} id="/about" className="text-neutral-500" onClick={() => { drawerToggle() }}>
                            <CgNotes />
                            <Link href={'/about'}>Sobre o ZilloCine</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    );
};