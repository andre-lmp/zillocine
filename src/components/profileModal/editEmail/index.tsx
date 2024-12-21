import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useFirebase from "@/components/hooks/firebaseHook";

import { UserDataContext } from "@/components/contexts/authenticationContext";
import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";

// Ferramentas para validação de formulario
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

type UpdateResponseProps = {
    success: boolean | undefined;
    errorMessage: string | undefined;
};

export default function EditEmail( props: EditEmailProps ) {

    const userData = useContext( UserDataContext );
    const globalEvents = useContext( GlobalEventsContext )
    const { updateUserData } = useFirebase();
    const [ isUpdatingEmail, setIsUpdatingEmail ] = useState( false );
    const [ updateResponse, setUpdateResponse ] = useState<UpdateResponseProps>({
        success: undefined,
        errorMessage: undefined,
    });
    const { register, handleSubmit, formState: { errors }, setValue, watch, setError, resetField }  = useForm<editEmailSchemaProps>({
        mode: 'all',
        criteriaMode: 'all',
        resolver: zodResolver( editEmailSchema ),
    });
    const formValues = watch();

    const resetEmailInput = () => {
        resetField('email');
        userData.email && setValue( 'email', userData.email )
        setUpdateResponse(() => ({
            success: undefined,
            errorMessage: undefined
        }));
    };

    const closeEmailEdit = () => {
        resetEmailInput();
        props.slideTo('prev-slide');
    };

    // Recebe os dados do schema apos o formulario ser submetido
    const handleFormSubmit = async ( schemaData: editEmailSchemaProps ) => {

        setIsUpdatingEmail( true );
        const response = await updateUserData( schemaData.email, null );
        setIsUpdatingEmail( false );
        
        setUpdateResponse(() => ({
            success: response && response.success,
            errorMessage: response && response.message
        }));

        if ( response && response.success ) {
            closeEmailEdit();
        };
    };

    useEffect(() => {
        resetEmailInput();
    }, [ globalEvents.isProfileModalActive ]);

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
                
                {/* Erro de validação do formulario */}
                { errors.email?.message ? (
                    <p className="text-orangered font-normal mt-1 text-[15px] max-[620px]:static md:text-base">{errors.email.message}</p>
                ) : null }

                {/* Erro retornado pela função de atualização de email */}
                { updateResponse.errorMessage ? (
                    <p className="text-orangered font-normal mt-1 text-[15px] max-[620px]:static md:text-base">
                        {/* mensagem de erro sobre a verificação do email */}
                        { updateResponse.errorMessage }
                    </p>
                ) : null }

                { userData.email !== formValues.email ? (
                    <p className="text-orangered font-normal mt-1 text-[15px] max-[620px]:static md:text-base">
                        Para registrar um novo email será necessário verificá-lo
                    </p>
                ) : null }
                    
                {/* // Confirmação da edição do email de usuario */}
                <div className="flex gap-x-5 mt-5">

                    <button 
                        onClick={closeEmailEdit}
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
                        { isUpdatingEmail ? (
                            <>Atualizando <span className="loading loading-bars loading-sm"></span></> 
                        ) : <>Atualizar</> }
                    </button>
                </div>
            </form>
        </div>
    );
};