'use client';

import React, { MutableRefObject, useEffect, useRef, useContext, useState } from "react";
import useFirebase from "@/components/hooks/firebaseHook";

import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";
import { UserDataContext } from "@/components/contexts/authenticationContext";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import LoginForm from './form';
import { LoginProps } from "./form";

export default function LoginModal() {

    const user = useContext( UserDataContext );
    const { authenticateUser, signInWithGoogle, signInWithGithub } = useFirebase();
    const checkboxInputRef: MutableRefObject<(HTMLInputElement | null)> = useRef( null );
    const globalEvents = useContext( GlobalEventsContext );
    const [ authenticateErrorMessage, setAuthenticateErrorMessage ] = useState<( null | string )>( null );

    const checkboxToggle = () => {
        checkboxInputRef.current?.click();
    };

    useEffect(() => {
        if ( globalEvents.isLoginModalActive ) {
            checkboxToggle();
        };
    },[ globalEvents.isLoginModalActive ]);
    
    const handleFormSubmit = async ( schemaData: LoginProps ) => {
        const response = await authenticateUser( schemaData.email, schemaData.password );
        if ( response ) {
            user.setUserData( prev => ({
                ...prev,
                isLoogedIn: true,
                email: schemaData.email,
                uid: response.uid ?? null,
                name: response.name ?? null,
                photoUrl: response.photoUrl ?? null
            }));

            closeLoginModal();
            setAuthenticateErrorMessage( null );
        } else {
            setAuthenticateErrorMessage('Credenciais inválidas');
        };
    };

    const closeLoginModal = () => {
        globalEvents.setModalsController( prev  => ({
            ...prev,
           isLoginModalActive: !prev.isLoginModalActive
        }));

        checkboxToggle();
        setAuthenticateErrorMessage( null );
    };

    const authenticateWithGoogle = async () => {
        const response = await signInWithGoogle();
        user.setUserData( prev => ({
            ...prev,
            isLoogedIn: true,
            name: response.name,
            photoUrl: response.photoUrl
        }));

        closeLoginModal();
    };

    const authenticateWithGithub = async () => {
        const response = await signInWithGithub();
        user.setUserData( prev => ({
            ...prev,
            isLoogedIn: true,
            name: response.name,
            photoUrl: response.photoUrl
        }));

        closeLoginModal();
    };

    return (
        <>
            <input type="checkbox" ref={checkboxInputRef} id="my_modal_6" className="modal-toggle" />
            <div className="modal h-dvh" role="dialog">
                <div className="z-50 bg-darkpurple rounded font-poppins px-4 py-5 w-[calc(100%-32px)] max-w-[420px] relative">
                   <h3 className="text-2xl font-semibold">Entrar</h3>
                   
                   <button 
                        className="w-full h-12 rounded mt-7 bg-white text-black text-sm font-semibold px-3 flex items-center gap-x-2 border-none outline-none btn hover:bg-white justify-start"
                        onClick={authenticateWithGoogle}
                    >
                    <FcGoogle className="text-3xl"/>
                    continuar com o google
                   </button>

                   <button 
                        className="w-full h-12 rounded mt-4 bg-deepnight text-white text-sm font-semibold px-3 flex items-center gap-x-2 border-none justify-start outline-none btn hover:bg-deepnight"
                        onClick={authenticateWithGithub}
                    >
                    <FaGithub className="text-3xl"/>
                    continuar com o github
                   </button>

                   <div className="my-6 w-full roude relative before:w-full before:h-0.5 before:rounded-xl before:bg-darkslateblue before:absolute flex items-center justify-center before:-z-10">
                        <p className="px-3 bg-darkpurple text-sm">Ou</p>
                   </div>

                   <LoginForm 
                        authenticateUser={handleFormSubmit}
                        errorMessage={authenticateErrorMessage}
                    />

                    <button onClick={closeLoginModal} className="modal-actio bg-darkslateblue w-10 h-10 rounded-full flex items-center justify-center absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 cursor-pointer">
                        <IoClose className='text-xl'/>
                    </button>
                </div>

                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} className="fixed top-0 left-0 w-full h-dvh"></div>
            </div>
        </>
    );
};