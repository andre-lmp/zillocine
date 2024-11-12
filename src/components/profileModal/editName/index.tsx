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

const editNameSchema = z.object({
    name: z.string()
        .min(3, 'Informe um nome')
        .max(30, 'Limite de caracteres atingido')
        .refine(value => /^[a-zA-Z\s^ãõç]+$/.test(value), { message: 'Evite numeros ou caracteres especiais' })
});

type EditNameSchemaProps = z.infer<typeof editNameSchema>;

type EditNameProps = {
    slideTo: ( slideTo: string ) => void;
};

export default function EditName( props: EditNameProps ) {

    const userData = useContext( UserDataContext );
    const globalEvents = useContext( GlobalEventsContext )
    const { updateUserData } = useFirebase();

    const { register, handleSubmit, formState: { errors }, setValue, watch, setError }  = useForm<EditNameSchemaProps>({
        mode: 'all',
        criteriaMode: 'all',
        resolver: zodResolver( editNameSchema ),
    });

    const formValues = watch();

    useEffect(() => {
           userData.name && setValue( 'name', userData.name );
    }, [ globalEvents.isProfileModalActive ]);

    // Recebe os dados do schema apos o formulario ser submetido
    const handleFormSubmit = ( schemaData: EditNameSchemaProps ) => {
        updateUserData( null, schemaData.name.trimEnd() ); 
    };

    return (
        <div className="p-7">
            <h3 className="w-full text-left font-medium text-lg">Editar nome de usuário</h3>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-10">
                {/* Editar nome de usuario */}
                <label htmlFor="user-name" className="text-[17px] font-medium">*Novo atual</label>
                <input
                    type="text"
                    id="user-name"
                    placeholder={userData.name ?? ''}
                    className="font-medium border border-transparent outline-none text-sm placeholder:text-neutral-400 mt-2 bg-richblack rounded h-12 px-3 w-full"
                    {...register('name')}
                    maxLength={31}
                    style={{
                        borderColor: errors.name ? 'orangered' : 'transparent'
                    }}
                />
                { errors.name?.message && (
                    <p className="text-orangered font-normal mt-1 text-[15px] max-[620px]:static md:text-base">{errors.name.message}</p>
                )}

                {/* // Confirmação da edição do nome de usuario */}
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
                            pointerEvents: formValues.name !== userData.name ? 'auto' : 'none',
                            backgroundColor: formValues.name !== userData.name ? 'darkslateblue' : 'rgba(72, 61, 139, 0.4)'
                        }}
                        >
                            Atualizar
                    </button>
                </div>
            </form>
        </div>
    );
};