
import React, { MutableRefObject, useEffect, useRef, useContext } from "react";
import { usePathname } from "next/navigation";
import useFirebase from "@/components/hooks/firebaseHook";

import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";
import { UserDataContext } from "@/components/contexts/authenticationContext";

// Icones com React-icons
import { FiHome } from "react-icons/fi";
import { BiMoviePlay, BiCameraMovie } from "react-icons/bi";
import { LuSearch } from 'react-icons/lu';
import { FaUserLarge, FaPencil } from 'react-icons/fa6';
import { CgNotes } from "react-icons/cg";
import { IoMdDownload } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { BsDoorOpenFill } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from "react-lazy-load-image-component";

import Link from "next/link";

export default function MobileMenu({ children } : { children: React.ReactNode }) {

    const drawerInput: MutableRefObject<( HTMLInputElement | null )> = useRef( null );
    const mobileNavLinks: MutableRefObject<(HTMLLIElement | null)[]> = useRef([]);
    const currentPathName = usePathname();
    const globalEvents = useContext( GlobalEventsContext );
    const userData = useContext( UserDataContext );
    const { signOutUser, deleteCurrentUser } = useFirebase();

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

    const ModalToggle = ( modalType: string ) => {
        globalEvents.setModalsController( prev  => ({
            ...prev,
            isLoginModalActive: modalType === 'login' ? !prev.isLoginModalActive : prev.isLoginModalActive,
            isRegisterModalActive: modalType === 'register' ? !prev.isRegisterModalActive : prev.isRegisterModalActive,
            loginErrorMessage: null,
            registerErrorMessage: null,
            googleAuthErrorMessage: null,
            githubAuthErrorMessage: null,
            formInstructionsMessage: null
        }));
    };

    const openProfileModal = () => {
        globalEvents.setModalsController( prev => ({
            ...prev,
            isProfileModalActive: !prev.isProfileModalActive
        }));
    };

    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" ref={drawerInput}/>
            
            <div className="drawer-content z-30">
                { children }
            </div>

            {/* Container do menu mobile */}
            <div className="drawer-side z-40">  
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                
                <div className="w-72 text-gray-50 pb-5 font-medium text-lg flex flex-col font-roboto min-h-screen bg-deepnight">
                    { !userData.isLoggedIn ? (
                        // Opções de authenticação
                        <div className="px-4 pt-5 bg-deepnight">
                            <button onClick={() => {ModalToggle('register')}} className="w-full font-medium text-white bg-orangered flex items-center justify-center text-[17px] h-12 rounded-3xl btn hover:bg-orangered border-none outline-none">Criar conta</button>
                            
                            <button onClick={() => {ModalToggle('login')}} className="w-full font-medium text-white bg-darkpurple flex items-center justify-center text-[17px] h-12 rounded-3xl mt-2 btn hover:bg-darkpurple border-none outline-none">Entrar</button>
                        </div>
                    ) : (
                        // Informações do usuario como, foto e nome
                        <div onClick={openProfileModal} className="w-full bg-deepnight pt-7 px-4 gap-x-3 flex items-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden bg-white/20">
                                { userData.photoUrl ? (
                                    <LazyLoadImage
                                        src={userData.photoUrl}
                                        height={64}
                                        width={64}
                                        className="object-cover h-16 w-16 overflow-hidden"
                                    />
                                ) : (
                                    <FaUserLarge/>
                                )}
                            </div>  
                            
                            { userData.name ? (
                                <div className="flex flex-col items-start">
                                    <p className="text-[19px] text-neutral-100">
                                        { userData.name }
                                    </p>

                                    <p className="text-base text-neutral-400 font-normal flex items-center gap-x-2 flex-row-reverse">
                                        Editar perfil
                                        <FaPencil className='text-sm'/>
                                    </p>
                                </div>
                            ) : null }
                        </div>
                    )}

                    <div  className="w-full mx-auto h-px bg-neutral-900 rounded-3xl mt-7 mb-4"></div>

                    {/* Barra de navegação */}
                    <ul className="mt- text-lg flex flex-col gap-y- *:flex *:pl-4 *:items-center *:gap-x-3">  

                        {/* Link para pagina de inicio    */}
                        <li key='li-element-15' id="/" ref={(e) => { mobileNavLinks.current[0] = e }} className="text-neutral-500 py-4" onClick={drawerToggle}>
                            <FiHome/>
                            <Link href={'/'}>Inicio</Link>
                        </li>

                        {/* Link para pagina de filmes */}
                        <li key='li-element-16' id="/movies" ref={(e) => { mobileNavLinks.current[1] = e }} className="text-neutral-500 py-4" onClick={drawerToggle}>
                            <BiCameraMovie className="text-xl"/>
                            <Link href={'/movies'}>Filmes</Link>
                        </li>

                        {/* Link para a pagina de series */}
                        <li key='li-element-17' id="/series" ref={(e) => { mobileNavLinks.current[2] = e }} className="text-neutral-500 py-4" onClick={drawerToggle}>
                            <BiMoviePlay/>
                            <Link href={'/series'}>Series</Link>
                        </li>

                        {/* Link para a pagina de pesquisa */}
                        <li key='li-element-18' id="/search" ref={(e) => { mobileNavLinks.current[3] = e }} className="text-neutral-500 py-4" onClick={drawerToggle}>
                            <LuSearch className="text-xl"/>
                            <Link href={'/search'}>Pesquisa</Link>
                        </li>

                        <li key='li-element-19' id="/favorites" ref={(e) => { mobileNavLinks.current[4] = e }} className="-translate-x-0.5 text-neutral-500 py-4 hidden lg:inline" onClick={drawerToggle}>
                            <FaRegHeart className="text-[17px]"/>
                            <Link href={'/favorites'}>Favoritos</Link>
                        </li>
                    
                        <li key='li-element-20' className="w-full mx-auto h-px bg-neutral-900 rounded-3xl my-4"></li>

                        {/* Link para o modal de favoritos */}
                        <li key='li-element-21' className="text-neutral-500 py-4">
                            <IoMdDownload className="text-[23px] "/>
                            <Link href={'/downloads'}>Downloads</Link>
                        </li>

                        {/* Link para a pagina sobre o projeto */}
                        <li  key='li-element-22' id="/about/zillocine" ref={(e) => { mobileNavLinks.current[5] = e }} className="text-neutral-500 py-4" onClick={drawerToggle}>
                            <CgNotes />
                            <Link href={'/about/zillocine'}>Sobre o ZilloCine</Link>
                        </li>


                        { userData.isLoggedIn ? (
                            <>
                                <li key='li-element-23' className="w-full h-px bg-neutral-900 rounded-3xl my-4"></li>

                                {/* Botão para se desconectar da conta */}
                                <li onClick={signOutUser} key='li-element-24' className="text-error py-4">
                                    <BsDoorOpenFill className="text-[17px]"/>
                                    Sair
                                </li>

                                <li onClick={deleteCurrentUser} key='li-element-25' className="text-error py-4">
                                    <AiFillDelete className="text-[19px]"/>
                                    Excluir conta
                                </li>
                            </>
                        ) : null }
                    </ul>
                </div>      
            </div>
        </div>
    );
};