import { useContext, useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";

const loginSchema = z.object({
    name: z.string()
        .min(3, 'Informe um nome')
        .max(40, 'Limite de caracteres atingido')
        .refine(value => /^[a-zA-Z\s]+$/.test(value), {
        message: 'Evite numeros ou caracteres especiais'
        }),

    email: z.string()
        .min(1, 'Informe um email')
        .max(40, 'Limite de caracteres atingido')
        .refine(value => /^[^\s@]+@[a-zA-Z]+(\.[a-zA-Z]+)+$/.test(value), {
        message: 'Informe um email vàlido'
        })
        .refine(value => /^[a-zA-Z0-9@.]+$/.test(value), {
        message: 'Evite caracteres especiais'
        }),

    password: z.string()
        .min(8, 'Caracteres minimos 8')
        .max(10, 'Limite de caracteres atingido')
        .refine(value => /^[a-zA-Z0-9@.]+$/.test(value), {
            message: 'Evite caracteres especiais'
        }),
});

export type RegisterProps = z.infer<typeof loginSchema>;

type componentProps = {
    registerUser: ( schemaData: RegisterProps ) => {};
    errorMessage: string | null;
};

export default function RegisterForm( props: componentProps ) {
    const globalEvents = useContext( GlobalEventsContext );

    const { register, handleSubmit, reset, formState: { errors }, setError }  = useForm<RegisterProps>({
        mode: 'all',
        criteriaMode: 'all',
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if ( !globalEvents.isRegisterModalActive ) {
            reset();
        }
    },[ globalEvents.isRegisterModalActive ]);

    return (
        <form onSubmit={handleSubmit(props.registerUser)} className="flex flex-col">
            <label htmlFor="" className="text-sm font-medium">Nome*</label>
            <input 
                type="text" 
                placeholder="Crie um nome de usuário" 
                className="font-medium placeholder:font-normal text-sm placeholder:text-neutral-400 mt-2 bg-richblack rounded h-12 px-3 border border-transparent outline-none"
                { ...register('name') }
                maxLength={41}
                style={{
                    borderColor: errors.name && 'orangered'
                }}
            />

            { errors.name?.message && (
                <p className="text-orangered font-normal mt-1 text-sm max-[620px]:static">{errors.name.message}</p>
            )}

            <label htmlFor="" className="text-sm font-medium mt-4">E-mail*</label>
            <input 
                type="text" 
                placeholder="Informe um email" 
                maxLength={41}
                { ...register('email') }
                className="font-medium placeholder:font-normal border border-transparent outline-none text-sm placeholder:text-neutral-400 mt-2 bg-richblack rounded h-12 px-3"
                style={{
                    borderColor: errors.email && 'orangered'
                }}
            />

            { props.errorMessage ? (
                <p 
                    className="text-orangered font-normal mt-1 text-sm max-[620px]:static">{props.errorMessage}
                </p>
            ) : (
                <>
                    { errors.email?.message && (
                        <p 
                            className="text-orangered font-normal mt-1 text-sm max-[620px]:static">{errors.email.message}
                        </p>
                    )}
                </>   
            )}

            <label htmlFor="" className="text-sm font-medium mt-4">Senha*</label>
            <input 
                type="password" 
                placeholder="Crie uma senha forte" 
                className="font-medium placeholder:font-normal text-sm placeholder:text-neutral-400 mt-2 bg-richblack rounded h-12 px-3 border border-transparent outline-none"
                { ...register('password') }
                maxLength={11}
                style={{
                    borderColor: errors.password && 'orangered'
                }}
            />

            
            { errors.password?.message && (
                <p className="text-orangered font-normal mt-1 text-sm max-[620px]:static">{errors.password.message}</p>
            )}

            <button className="mt-6 w-full rounded bg-darkslateblue flex items-center justify-center h-12 text-sm font-medium border-none outline-none btn hover:bg-darkslateblue text-white">Acessar conta</button>
        </form>
    );
};