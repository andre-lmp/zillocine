// Hooks
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import useFirebase from "@/components/hooks/firebaseHook";

// Contextos
import { UserDataContext } from "@/components/contexts/authenticationContext";
import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";

// Ferramentas de validação
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const editEmailSchema = z.object({
    email: z.string()
        .min(1, 'Informe um email')
        .max(40, 'Limite de caracteres atingido')
        .refine(value => /^[^\s@]+@[a-zA-Z]+(\.[a-zA-Z]+)+$/.test(value), {
        message: 'Informe um email vàlido'
        })
        .refine(value => /^[a-zA-Z0-9@.]+$/.test(value), {
        message: 'Evite caracteres especiais'
        }),
});

type editEmailSchemaProps = z.infer<typeof editEmailSchema>;

type EditEmailProps = {
    slideTo: ( slideTo: string ) => void;
};

export default function EditEmail( props: EditEmailProps ) {

    const userData = useContext( UserDataContext );
    const globalEvents = useContext( GlobalEventsContext )
    const { updateUserData } = useFirebase();

    const { register, handleSubmit, formState: { errors }, setValue, watch, setError }  = useForm<editEmailSchemaProps>({
        mode: 'all',
        criteriaMode: 'all',
        resolver: zodResolver( editEmailSchema ),
    });

    const formValues = watch();

    useEffect(() => {
           userData.email && setValue( 'email', userData.email );
    }, [ globalEvents.isProfileModalActive ]);

    // Recebe os dados do schema apos o formulario ser submetido
    const handleFormSubmit = ( schemaData: editEmailSchemaProps ) => {
        updateUserData( schemaData.email, null );        
    };


    return (
        <div className="p-7">
            <h3 className="w-full text-left font-medium text-lg">Editar email de usuário</h3>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-10">
                {/* Editar nome de usuario */}
                <label htmlFor="user-email" className="text-[17px] font-medium">*Email atual</label>
                <input
                    type="email"
                    id="user-email"
                    placeholder={userData.email ?? ''}
                    className="font-medium border border-transparent outline-none text-[15px] placeholder:text-neutral-400 mt-2 bg-richblack rounded h-12 px-3 w-full"
                    {...register('email')}
                    maxLength={41}
                    style={{
                        borderColor: errors.email ? 'orangered' : 'transparent'
                    }}
                />
                
                { errors.email?.message ? (
                    <p className="text-orangered font-normal mt-1 text-[15px] max-[620px]:static md:text-base">{errors.email.message}</p>
                ) : ( globalEvents.verificationErrorMessage ? (
                        <p className="text-success font-normal mt-1 text-[15px] max-[620px]:static md:text-base">
                            {/* mensagem de erro sobre a verificação do email */}
                            { globalEvents.verificationErrorMessage }
                        </p>
                    ) : (
                        userData.email !== formValues.email ? (
                            <p className="text-orangered font-normal mt-1 text-[15px] max-[620px]:static md:text-base">
                                Para registrar um novo email será necessário verificá-lo
                            </p>
                        ) : null
                    )
                    
                )}

                {/* // Confirmação da edição do email de usuario */}
                <div className="flex gap-x-5 mt-5">

                    <button 
                        onClick={() => props.slideTo('prev-slide')}
                        type="button" 
                        className="btn bg-white/5 hover:bg-white/5 text-white px-7 rounded-lg font-normal text-base border-none outline-none"
                    >
                        Cancelar
                    </button>
                    
                    <button 
                        type="submit" 
                        className="btn bg-darkslateblue hover:bg-darkslateblue text-white px-7 rounded-lg font-normal text-base border-none outline-none ease-linear duration-200"
                        style={{
                            pointerEvents: formValues.email !== userData.email ? 'auto' : 'none',
                            backgroundColor: formValues.email !== userData.email ? 'darkslateblue' : 'rgba(72, 61, 139, 0.4)',
                        }}
                        >
                            Atualizar
                    </button>
                </div>
            </form>
        </div>
    );
};