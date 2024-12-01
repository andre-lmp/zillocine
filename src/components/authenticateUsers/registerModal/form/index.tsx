// Hooks
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

// Ferramentas de validação
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Contexto(s)
import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";

export const registerSchema = z.object({
    name: z.string()
        .min(3, 'Campo obrigatório')
        .max(30, 'Limite de caracteres atingido')
        .refine(value => /^[a-zA-Z\s^ãõç]+$/.test(value), {
        message: 'Evite numeros ou caracteres especiais'
        }),

    email: z.string()
        .min(1, 'Campo obrigatório')
        .max(40, 'Limite de caracteres atingido')
        .refine(value => /^[^\s@]+@[a-zA-Z]+(\.[a-zA-Z]+)+$/.test(value), {
        message: 'Informe um email vàlido'
        })
        .refine(value => /^[a-zA-Z0-9@.]+$/.test(value), {
        message: 'Evite caracteres especiais'
        }),

    password: z.string()
        .min(8, 'Campo obrigatório')
        .max(10, 'Limite de caracteres atingido')
        .refine(value => /^[a-zA-Z0-9@.]+$/.test(value), {
            message: 'Evite caracteres especiais'
        }),
});

export type RegisterProps = z.infer<typeof registerSchema>;

type componentProps = {
    registerUser: ( schemaData: RegisterProps ) => void;
};

export default function RegisterForm( props: componentProps ) {
    const globalEvents = useContext( GlobalEventsContext );

    const { register, handleSubmit, reset, formState: { errors }, setError }  = useForm<RegisterProps>({
        mode: 'all',
        criteriaMode: 'all',
        resolver: zodResolver(registerSchema),
    });

    useEffect(() => {
        if ( !globalEvents.isRegisterModalActive ) {
            reset();
        }
    },[ globalEvents.isRegisterModalActive ]);

    return (
        <form onSubmit={handleSubmit(props.registerUser)} className="flex flex-col">
            <label htmlFor="" className="text-base font-medium">Nome*</label>
            <input 
                type="text" 
                placeholder="Informe um nome de usuario" 
                className="font-medium placeholder:font-normal text-base placeholder:text-neutral-400 mt-2 bg-richblack rounded-md h-12 px-3 border border-transparent outline-none"
                { ...register('name') }
                maxLength={31}
                style={{
                    borderColor: errors.name ? 'orangered' : 'transparent'
                }}
            />

            { errors.name?.message && (
                <p className="text-orangered font-medium mt-1 text-base max-[620px]:static">{errors.name.message}</p>
            )}

            <label htmlFor="" className="text-base font-medium mt-4">E-mail*</label>
            <input 
                type="text" 
                placeholder="Informe um email" 
               
                className="font-medium placeholder:font-normal border border-transparent outline-none text-base placeholder:text-neutral-400 mt-2 bg-richblack rounded-md h-12 px-3"
                maxLength={41}
                { ...register('email') }
                style={{
                    borderColor: errors.email || globalEvents.registerErrorMessage ? 'orangered' : 'transparent'
                }}
            />

            {/* Renderiza o erro passado pelo contexto caso houver, se não, renderiza o erro do registerSchema */}
            { globalEvents.registerErrorMessage ? (
                <p 
                    className="text-orangered font-medium mt-1 text-base max-[620px]:static">{globalEvents.registerErrorMessage}
                </p>
            ) : (
                <>
                    { errors.email?.message && (
                        <p 
                            className="text-orangered font-medium mt-1 text-base max-[620px]:static">{errors.email.message}
                        </p>
                    )}
                </>   
            )}

            <label htmlFor="" className="text-base font-medium mt-4">Senha*</label>
            <input 
                type="password" 
                placeholder="Crie uma senha forte" 
                className="font-medium placeholder:font-normal text-base placeholder:text-neutral-400 mt-2 bg-richblack rounded-md h-12 px-3 border border-transparent outline-none"
                { ...register('password') }
                maxLength={11}
                style={{
                    borderColor: errors.password && 'orangered'
                }}
            />

            
            { errors.password?.message && (
                <p className="text-orangered font-medium mt-1 text-base max-[620px]:static">{errors.password.message}</p>
            )}

            <button 
                className="mt-6 w-full rounded-md bg-darkslateblue flex items-center justify-center h-12 font-semibold border-none outline-none btn hover:bg-darkslateblue text-white ease-linear duration-150"
                style={{ 
                    backgroundColor: !globalEvents.isUserCreatingAnAccount ? 'darkslateblue' : 'rgba(72, 61, 139, 0.4)',
                    fontSize: !globalEvents.isUserCreatingAnAccount ? '16px' : '17px'
                }}
            >
                { globalEvents.isUserCreatingAnAccount ? (
                    <>
                        Criando conta
                        <span className="loading loading-bars loading-md"></span>
                    </>
                ) : (
                    <>
                        Criar conta                    
                    </>
                )}
            </button>
        </form>
    );
};