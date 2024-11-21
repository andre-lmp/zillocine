// Hooks
import { useRouter } from 'next/navigation';
import { useContext, MouseEvent } from 'react';
import useFirebase from '@/components/hooks/firebaseHook';

// Interface de tipos para objetos retornados pela api do TMDB
import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// Componente para o carregamento preguiçoso de imagens
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

// Icones com React-icons
import { FaRegHeart, FaHeart, FaPlay } from "react-icons/fa";

// Estilos com styled componentes
import { SearchResultWrapper } from '../styles';
import { imageBox as SearchImageBox } from '@/components/contentCarousel/styles';

// Contextos
import { UserDataContext } from '@/components/contexts/authenticationContext';
import { GlobalEventsContext } from '@/components/contexts/globalEventsContext';

type componentProps = {
    fetchData: tmdbObjProps[];
    typeOfId: string;
};

export default function ShowResults( props: componentProps ) {

    const router = useRouter();
    const userData = useContext( UserDataContext );
    const globalEvents = useContext( GlobalEventsContext );
    const { addUserFavoritesToDb, deleteUserFavoritesOnDb } = useFirebase();

    const nextNavigate = ( content: tmdbObjProps ) => {
        const contentObjKeys = Object.keys( content );

        if (contentObjKeys.includes( 'first_air_date' )) {
            router.push(`player/serie/${content.id}`);
        };

        if (!contentObjKeys.includes( 'first_air_date' )) {
            router.push(`player/movie/${content.id}`);
        };
    };

    /*Função que obtem o ano de lançamento de um filme ou serie*/
    const getReleaseDate = ( date: string ) => {
        if ( !date ) return
        const newDate = [];
        for ( let i = 0; i < 4; i++ ) {
            newDate.push( date[i] );
        }
        return newDate.join('');
    };

    // Define se o filme/serie e favorito ou nao, caso seja, salva no banco de dados
    const toggleFavoriteButton = ( e: MouseEvent<HTMLButtonElement>, contentId: string ) => {
        if ( userData.isLoggedIn ) {
            if ( !e.currentTarget.classList.contains('favorite-button')) {
                addUserFavoritesToDb( contentId, props.typeOfId );
            } else {
                deleteUserFavoritesOnDb( contentId, props.typeOfId );
            };
    
            e.currentTarget.classList.toggle('favorite-button');
        } else {
            globalEvents.setModalsController( prev => ({
                ...prev,
                isRegisterModalActive: !prev.isRegisterModalActive,
                formInstructionsMessage: 'Faça login ou crie uma conta para adicionar filmes e series aos seus favoritos'
            }));
        }
    };

    return props.fetchData[0] && (
        <SearchResultWrapper>

            <p className="text-lg font-roboto font-medium">Resultados - {props.fetchData.length}</p>
            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>
    
            <div className='result-container mt-3'>
                { props.fetchData.map(( content, index ) => (
                    <div key={`${content.id}-${index}`}>
                        <SearchImageBox>
                        
                            {/* Opção para adicionar o filme/serie aos favoritos */}
                            <button
                                onClick={(e) => toggleFavoriteButton(e, content.id)}
                                className={`${userData.favoriteMovies?.includes(content.id) || userData.favoriteSeries?.includes(content.id) ? 'favorite-button' : ''} absolute right-0 top-0 w-16 h-16 flex contents-start justify-end z-30`}
                            >
                                <FaRegHeart className="not-favorited text-2xl text-white/70 absolute top-3 right-3 md:text-[22px]"/>
                                <FaHeart className="favorited text-2xl text-orangered absolute top-3 right-3  md:text-[22px]"/>
                            </button>

                            {/* controla a navegação para o player */}
                            <div onClick={() => {nextNavigate( content )}} className='slide-wrapper'>
                                <div className='image-container cursor-pointer relative'>
                                    {/* Imagem do conteudo */}
                                    <LazyLoadImage
                                        src={`https://image.tmdb.org/t/p/original${content.poster_path ?? content.backdrop_path}`}
                                        alt={`${content.title ?? content.name} serie/movie presentation image`}
                                        loading="lazy"
                                        width='100%'
                                        height={253}
                                        effect="opacity"
                                        placeholderSrc={`https://image.tmdb.org/t/p/w92/${content.poster_path ?? content.backdrop_path}`}
                                        className="image min-w-full object-cover h-[260px] bg-darkpurple rounded-md"
                                    />
                                    <FaPlay className="play-icon text-4xl absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
                                </div>
                                {/* Informações do conteudo */}
                                <div className="w-full description flex flex-col gap-y-1 font-normal font-noto_sans text-sm">
                                    {/* Titulo */}
                                    <p className="font-raleway font-bold text-[15px] text-white line-clamp-1">
                                        { content.title ?? content.name }
                                    </p>
                                    <div className="flex contents-center gap-x-3">
                                        {/* Data de lançamento */}
                                        <p className="bg-orangered rounded-[4px] flex contents-center w-fit px-3 h-5">{getReleaseDate( content.release_date ?? content.first_air_date )}
                                        </p>
                                        {/* Nota do publico ao conteudo */}
                                        <p className="font-medium text-sm text-white">nota: {( content.vote_average).toFixed(0 )}</p>
                                    </div>
                                    {/* Descrição */}
                                    <p className="line-clamp-2 text-neutral-200 leading-relaxed text-justif ">{ content.overview.length > 3 ? content.overview : 'Desculpe... não foi possível carregar a descrição deste conteúdo.' }
                                    </p>
                                </div>
                            </div>
                        </SearchImageBox>
                    </div>
                ))}
            </div>
        </SearchResultWrapper>
    );
};