// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import ContentDetails from "./contentDetails/index";

import ContentImage from "./contentImage/index";

// Carousel com os atores principais do filme/serie
import ActorsCarousel from "./actorsCarousel/index";

// Seção de comentarios e avaliações de usuarios sobre o filme/serie
import UsersComments from "./commentsSection/index";

type ComponentProps = {
    contentData: tmdbObjProps;   
    contentType: string;
};

export default function Main( props: ComponentProps ) {

    return (
        <div className="flex flex-col font-noto_sans px-4 md:px-6 lg:px-8">

                {/* Descrição do filme/serie */}
                <p className='text-justify w-full text-[17px] md:text-left leading-loose text-neutral-300 max-w-4xl'>
                    { props.contentData.overview.length > 3 ? props.contentData.overview : `Desculpe, a descrição deste conteúdo não pode ser carregada neste momento` }
                </p>

                {/* seção com mais detalhes */}
                <div className="bg-darkpurple w-full mt-5 pt-5 pb-3 sm:pb-6 rounded-md">
                    <div className="px-3">
    
                        {/* Titulo da seção */}
                        <h2 className="text-xl lg:text-2xl font-semibold">
                            Mais sobre { props.contentType === 'movie' ? 'o filme' : 'a série' }
                        </h2>
    
                        {/* Container com os detalhes */}
                        <div className="mt-5 relative flex flex-col gap-y-7 items-start">
                            {/* Imagem do filme/serie */}
                            <div className="sm:absolute sm:left-0 h-full">
                                <ContentImage 
                                    url={props.contentData.poster_path ?? props.contentData.backdrop_path}
                                    title={props.contentData.title ?? props.contentData.name}
                                />
                            </div>
    
                            <ContentDetails contentType={props.contentType} contentData={props.contentData}/>
                        </div>
                    </div>

                    <ActorsCarousel actorsData={props.contentData.credits.cast ?? []}/>

                </div>

                <UsersComments/>
        </div>
    );
};