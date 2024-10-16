import React, { MutableRefObject, useState, useEffect, useRef, useContext } from "react";

import Link from "next/link";

import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";
UserDataContext

import { FiHome } from "react-icons/fi";
import { BiMoviePlay, BiCameraMovie } from "react-icons/bi";
import { LuSearch } from 'react-icons/lu';
import { FaUserLarge } from 'react-icons/fa6';
import { CgNotes } from "react-icons/cg";
import { IoMdDownload } from "react-icons/io";

import { usePathname } from "next/navigation";
import { UserDataContext } from "@/components/contexts/authenticationContext";

export default function MobileMenu({ children } : { children: React.ReactNode }) {

    const drawerInput: MutableRefObject<( HTMLInputElement | null )> = useRef( null );
    const mobileNavLinks: MutableRefObject<(HTMLLIElement | null)[]> = useRef([]);
    const currentPathName = usePathname();
    const globalEvents = useContext( GlobalEventsContext );
    const userData = useContext( UserDataContext );

    /*Responsavel por mudar o estilo dos elementos do menu mobile sempre que o usuario muda de pagina*/
    const changeMenuStyle = ( pathname: string ) => {
        const activeRouteStyle = {
            backgroundColor: '#080c1e',
            color: 'white'
        };

        const inactiveRouteStyle = {
            backgroundColor: '#020515',
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

    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" ref={drawerInput}/>
            <div className="drawer-content z-30">
                { children }
            </div>
            <div className="drawer-side z-40">  
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="w-72 text-gray-50 pb-5 font-medium text-lg flex flex-col font-roboto h-dvh bg-deepnight">
                    { !userData.isLoogedIn ? (
                        <div className="px-4 py-5 bg-deepnight">
                            <button onClick={() => RegisterModalToggle()} className="w-full font-medium text-white bg-orangered flex items-center justify-center text-[17px] h-12 rounded-3xl btn hover:bg-orangered">Criar conta</button>
                            
                            <button onClick={() => loginModalToggle()} className="w-full font-medium text-white bg-darkpurple flex items-center justify-center text-[17px] h-12 rounded-3xl mt-2 btn hover:bg-darkpurple">Entrar</button>
                        </div>
                    ) : (
                        <div className="w-full bg-deepnight py-7 px-4 gap-x-2 flex items-center">
                            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} className="w-16 h-16 rounded-full flex items-center justify-center">
                                <FaUserLarge className="text-xl text-neutral-100"/>
                            </div>  

                            <div className="">
                                <p className="text-lg text-neutral-400">
                                    Ola, <span className="text-neutral-100">{ userData.name ?? 'usuario' }</span>
                                </p>

                                <p className="text-base text-neutral-400">acessar conta</p>
                            </div>
                        </div>
                    )}
                    <ul className="mt-8 text-lg flex flex-col gap-y- *:flex *:py-4 *:pl-4 *:items-center *:gap-x-3">
                        
                        <li key='mb-home-link' id="/" ref={(e) => { mobileNavLinks.current[0] = e }} className="text-neutral-500" onClick={() => { drawerToggle() }}>
                            <FiHome/>
                            <Link href={'/'}>Inicio</Link>
                        </li>

                        <li key='mb-movies-link' id="/movies" ref={(e) => { mobileNavLinks.current[1] = e }} className="text-neutral-500" onClick={() => { drawerToggle() }}>
                            <BiCameraMovie className="text-xl"/>
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