import { useContext, useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";

const loginSchema = z.object({
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

type LoginProps = z.infer<typeof loginSchema>

export default function LoginForm() {
    const globalEvents = useContext( GlobalEventsContext );

    const { register, handleSubmit, reset, formState: { errors }, setValue }  = useForm<LoginProps>({
        mode: 'all',
        criteriaMode: 'all',
        resolver: zodResolver(loginSchema),
    });

    const handleFormSubmit = ( schemaData: LoginProps ) => {
        console.log(schemaData);
    };

    useEffect(() => {
        if ( !globalEvents.isLoginModalActive ) {
            reset();
        }
    },[ globalEvents.isLoginModalActive ]);

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col">
            <label htmlFor="" className="text-sm font-medium">E-mail*</label>
            <input 
                type="text" 
                placeholder="Email cadastrado" 
                { ...register('email') }
                maxLength={41}
                className="font-medium placeholder:font-normal border border-transparent outline-none text-sm placeholder:text-neutral-400 mt-2 bg-richblack rounded h-12 px-3"
                style={{
                    borderColor: errors.email && 'orangered'
                }}
            />

            {errors.email?.message && (
                <p className="text-orangered font-normal mt-1 text-sm max-[620px]:static">{errors.email.message}</p>
            )}

            <label htmlFor="" className="text-sm font-medium mt-4">Senha*</label>
            <input 
                type="password" 
                placeholder="Senha de acesso"
                { ...register('password') } 
                maxLength={11}
                className="font-medium placeholder:font-normal text-sm placeholder:text-neutral-400 border-transparent mt-2 bg-richblack rounded h-12 px-3 border outline-none"
                style={{
                    borderColor: errors.password && 'orangered'
                }}
            />

            {errors.password?.message && (
                <p className="text-orangered font-normal mt-1 text-sm max-[620px]:static">{errors.password.message}</p>
            )}

            <button className="mt-6 w-full rounded bg-darkslateblue flex items-center justify-center h-12 text-sm font-medium border-none outline-none btn hover:bg-darkslateblue text-white">Acessar conta</button>
        </form>
    );
};