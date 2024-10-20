// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

type componentProps = {
    playerData: tmdbObjProps[];   
    contentType: string;
};

export default function Main( props: componentProps ) {
    return (
        <div className="flex flex-col">
            <div className="px-4 md:px-6 lg:px-8">
                <p className='text-justify w-full mb-4 font-noto_sans text-[17px] leading-loose text-neutral-100 max-w-4xl'>
                    { props.playerData[0].overview.length > 3 ? props.playerData[0].overview : `Desculpe, a descrição deste conteúdo não pode ser carregada neste momento` }
                </p>
            </div>
        </div>
    );
};