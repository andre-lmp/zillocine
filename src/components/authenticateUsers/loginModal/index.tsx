import React, { MutableRefObject, useEffect, useRef } from "react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

type loginButtonProps = {
    style: Record<string, string>;
    text: string;
};

export default function LoginFormButton( props: loginButtonProps ) {
    const checkboxInputRef: MutableRefObject<(HTMLInputElement | null)> = useRef( null );
    const loginButtonRef: MutableRefObject<(HTMLButtonElement | null)> = useRef( null );

    const checkboxToggle = () => {
        checkboxInputRef.current?.click();
    };

    useEffect(() => {
        loginButtonRef.current && Object.assign( loginButtonRef.current?.style, props.style );
    },[]);

    return (
        <>
            <button ref={loginButtonRef} onClick={() => checkboxToggle()} className=" font-poppins font-medium hover:text-white cursor-pointer">{ props.text }</button>

            <input type="checkbox" ref={checkboxInputRef} id="my_modal_6" className="modal-toggle" />
            <div className="modal h-dvh w-screen overflow-x-hidden" role="dialog">
                <div className="z-50 bg-darkpurple rounded font-poppins px-4 py-5 w-[calc(100%-32px)] max-w-[420px] relative">
                   <h3 className="text-2xl font-semibold">Entrar</h3>
                   
                   <button className="w-full h-12 rounded mt-7 bg-white text-black text-sm font-semibold px-3 flex items-center gap-x-2 border-none outline-none btn hover:bg-white justify-start">
                    <FcGoogle className="text-3xl"/>
                    continuar com o google
                   </button>

                   <button className="w-full h-12 rounded mt-4 bg-deepnight text-white text-sm font-semibold px-3 flex items-center gap-x-2 border-none justify-start outline-none btn hover:bg-deepnight">
                    <FaGithub className="text-3xl"/>
                    continuar com o github
                   </button>

                   <div className="my-6 w-full roude relative before:w-full before:h-0.5 before:rounded-xl before:bg-darkslateblue before:absolute flex items-center justify-center before:-z-10">
                        <p className="px-3 bg-darkpurple text-sm">Ou</p>
                   </div>

                   <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
                        <label htmlFor="" className="text-sm font-medium">E-mail*</label>
                        <input type="text" placeholder="Email cadastrado" className="font-medium placeholder:font-normal border-none outline-none text-sm placeholder:text-neutral-400 mt-2 bg-richblack rounded h-12 px-3"/>

                        <label htmlFor="" className="text-sm font-medium mt-4">E-mail*</label>
                        <input type="password" placeholder="Senha de acesso" className="font-medium placeholder:font-normal text-sm placeholder:text-neutral-400 mt-2 bg-richblack rounded h-12 px-3 border-none outline-none"/>

                        <button className="mt-6 w-full rounded bg-darkslateblue flex items-center justify-center h-12 text-sm font-medium border-none outline-none btn hover:bg-darkslateblue text-white">Acessar conta</button>
                   </form>

                    <button onClick={() => checkboxToggle()} className="modal-actio bg-darkslateblue w-10 h-10 rounded-full flex items-center justify-center absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 cursor-pointer">
                        <IoClose className='text-xl'/>
                    </button>
                </div>

                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} className="fixed top-0 left-0 w-screen h-dvh"></div>
            </div>
        </>
    );
};