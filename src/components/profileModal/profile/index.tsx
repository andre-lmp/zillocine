// Hooks
import React, { useContext, useEffect, useRef, MutableRefObject, useState, ChangeEvent, Dispatch } from "react";
import useFirebase from '@/components/hooks/firebaseHook';

// Icones com React-icons
import { FaUserLarge, FaPencil } from "react-icons/fa6";

// Contextos
import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";
import { UserDataContext } from "@/components/contexts/authenticationContext";

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/opacity.css';

type ProfileProps = {
    nextSlide: Dispatch<React.SetStateAction<(string | null)>>
    slideTo: ( slideTo: string ) => void;
};

export default function Profile( props: ProfileProps ) {

    const globalEvents = useContext( GlobalEventsContext );
    const userData = useContext( UserDataContext );
    const checkboxInputRef: MutableRefObject<(HTMLInputElement | null)> = useRef( null );
    const imageInputRef: MutableRefObject<(HTMLInputElement | null)> = useRef( null );
    const [ uploadedImageUrl, setUploadedImageUrl ] = useState<(string | null)>( null ); 
    const { uploadUserImage } = useFirebase();

    // Simula um click para o input que seleciona imagens para o perfil do usuario  
    const clickImageInput = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        };
    };

    const resetUploadField = () => {
        setUploadedImageUrl( null );
    };

    // Chama a função uploadUserImage do hook useFirebase para mandar a imagem ao firebase storage
    const updateUserProfilePhoto = () => {
        if ( imageInputRef.current?.files?.length ) {
            uploadUserImage( imageInputRef.current?.files[0] );
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

    useEffect(() => {
        if ( !globalEvents.isProfilePhotoUpdating ) {
            resetUploadField();
        };
    }, [ globalEvents.isProfilePhotoUpdating ]);

    return (
        <div className="w-full mx-auto flex flex-col justify-center items-center  p-7 relative">
        <h3 className="w-full text-left font-medium text-[17px]">Editar dados</h3>

        <div className="flex items-center flex-col mt-5">
            {/* Imagem do usuario vinculada a conta do usuario*/}
            <div onClick={clickImageInput} className="">
                <div className="w-40 h-40 rounded-full bg-white/5 relative flex items-center justify-center">
                    { !uploadedImageUrl ? (
                        <div className="flex items-center justify-center relative w-40 h-40">
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

        {/* Dados do perfil como nome, email etc..  */}
       
        {/* Editar nome de usuario  */}
        <p className="text-[17px] font-medium w-full text-left mt-10">*Nome de usuário</p>

        <div className="flex items-center justify-start font-medium border border-transparent outline-none text-sm text-neutral-400 mt-2 bg-richblack rounded h-12 px-3 w-full relative">
            <p>{ userData.name }</p>

            <FaPencil 
                onClick={() => {
                    props.nextSlide('editName'),
                    props.slideTo('next-slide')
                }}
                className="absolute right-3 md:cursor-pointer"
            />
        </div>

        { userData.email ? (
            /* Editar email de usuario  */
            <>
                <p className="text-[17px] font-medium w-full text-left mt-4">*Email</p>

                <div className="flex items-center justify-start font-medium border border-transparent outline-none text-sm text-neutral-400 mt-2 bg-richblack rounded h-12 px-3 w-full relative">
                    <p>{ userData.email }</p>

                    <FaPencil 
                        onClick={() => {
                            props.nextSlide('editEmail'),
                            props.slideTo('next-slide')
                        }}
                        className="absolute right-3 md:cursor-pointer"
                    />
                </div>
            </>
        ) : null }

    </div>
    );;
}