'use client';

// Hooks
import { useContext, useEffect, useRef, MutableRefObject, useState, ChangeEvent } from "react";
import useFirebase from "../hooks/firebaseHook";

// Icones com React-icons
import { IoClose } from "react-icons/io5";
import { FaUserLarge, FaPencil } from "react-icons/fa6";

// Contextos
import { GlobalEventsContext } from "../contexts/globalEventsContext";
import { UserDataContext } from "../contexts/authenticationContext";

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/opacity.css';

export default function ProfileModal() {

    const globalEvents = useContext( GlobalEventsContext );
    const userData = useContext( UserDataContext );
    const checkboxInputRef: MutableRefObject<(HTMLInputElement | null)> = useRef( null );
    const imageInputRef: MutableRefObject<(HTMLInputElement | null)> = useRef( null );
    const [ uploadedImageUrl, setUploadedImageUrl ] = useState<(string | null)>( null ); 
    const { uploadUserImage } = useFirebase();

    // Simula um click para o input que abre/fecha o modal do perfil do usuario
    const toggleProfileModal = () => {
        if (globalEvents.clicksCount >= 1) {
            checkboxInputRef.current?.click();
        };

        globalEvents.setModalsController(prev => ({
            ...prev,
            clicksCount: prev.clicksCount + 1
        }));

        resetUploadField();
    };

    const resetUploadField = () => {
        setUploadedImageUrl( null );
    };

    // Simula um click para o input que seleciona imagens para o perfil do usuario    
    const clickImageInput = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        };
    };

    // Recupera a imagem de perfil selecionada pelo usuario
    const getUploadedImage = ( e: ChangeEvent<HTMLInputElement> ) => {
        if ( e.target.files && e.target.files[0] ) {
            const reader = new FileReader();

            reader.readAsDataURL( e.target.files[0] );

            reader.onload = () => {
                if ( typeof reader.result === 'string' || typeof reader.result === 'boolean' ) {
                    setUploadedImageUrl( reader.result );
                };
            };
        }
    };

    // Chama a função uploadUserImage do hook useFirebase para mandar a imagem ao firebase storage
    const updateUserProfilePhoto = () => {
        if ( imageInputRef.current?.files?.length ) {
            uploadUserImage( imageInputRef.current?.files[0] );
        };
    };

    useEffect(() => {
        toggleProfileModal();
    }, [globalEvents.isProfileModalActive]);

    useEffect(() => {
        if ( !globalEvents.isProfilePhotoUpdating ) {
            resetUploadField();
        };
    }, [ globalEvents.isProfilePhotoUpdating ]);

    return (
        <>
            {/* Input que controla a abertura/fechamento do modal */}
            <input ref={checkboxInputRef} type="checkbox" id="my_modal_7" className="modal-toggle" />

            <div className="modal" role="dialog">
                {/* Conteudo do modal */}
                <div className="max-w-[calc(100%-32px)] w-fit flex items-center  z-50 rounded-2xl bg-darkpurple p-10 relative">

                    <div className="flex items-center flex-col">
                        {/* Imagem do usuario vinculada a conta do usuario*/}
                        <div onClick={clickImageInput} className="">
                            <div className="w-40 h-40 rounded-full bg-white/5 relative flex items-center justify-center">
                                { !uploadedImageUrl ? (
                                    <div className="flex items-center justify-center relative">
                                        { userData.photoUrl ? (
                                            <LazyLoadImage
                                                src={userData.photoUrl}
                                                height={160}
                                                width={160}
                                                effect="opacity"
                                                className="object-cover rounded-full overflow-hidden w-40 h-40"
                                            />
                                        ) : (
                                            <FaUserLarge className="text-6xl text-white/80" />
                                        )}

                                        <div className="z-20 cursor-pointer absolute bottom-0 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-darkslateblue right-0 rounded-full">
                                            <FaPencil className="text-sm" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center relative">
                                        <LazyLoadImage
                                            src={uploadedImageUrl}
                                            height={160}
                                            width={160}
                                            effect="opacity"
                                            className="object-cover rounded-full overflow-hidden w-40 h-40"
                                        />

                                        { globalEvents.isProfilePhotoUpdating ? (
                                            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-black/80 flex items-center justify-center z-10">
                                                <span className="loading loading-spinner loading-lg"></span>
                                            </div>
                                        ) : null }
                                    </div>
                                )}
                            </div>
                            <input ref={imageInputRef} onChange={getUploadedImage} type="file" name="" id="" accept="image/*" className="hidden" />
                        </div>

                        { uploadedImageUrl ? (
                            // Confirmação da imagem escolhida pelo usuario
                            <div className="flex gap-x-5 mt-5">
                                <button onClick={resetUploadField} className="btn bg-white/5 hover:bg-white/5 text-white px-4 rounded-lg font-normal text-base border-none outline-none">Cancelar</button>

                                <button onClick={updateUserProfilePhoto} className="btn bg-darkslateblue hover:bg-darkslateblue text-white px-4 rounded-lg font-normal text-base border-none outline-none">Atualizar</button>
                            </div>
                        ) : null }
                    </div>

                    {/* Botão de fechamento do modal */}
                    <button onClick={toggleProfileModal} className="modal-actio bg-darkslateblue w-10 h-10 rounded-full flex items-center justify-center absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 cursor-pointer border-none outline-none">
                        <IoClose className='text-xl' />
                    </button>
                </div>
            </div>
        </>
    );;
};