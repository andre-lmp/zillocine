import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import Link from "next/link";

import * as Style from '../styles';

type componentProps = {
    fetchData: tmdbObjProps[];
    typeOfId: string;
};

export default function ShowResults( props: componentProps ) {

    /*Função que obtem o ano de lançamento de um filme ou serie*/
    const getReleaseDate = ( date: any[] ) => {
        if ( !date ) return
        const newDate = [];
        for ( let i = 0; i < 4; i++ ) {
            newDate.push( date[i] );
        }
        return newDate;
    };

    return props.fetchData[0] && (
        <Style.SearchResultWrapper>

            <p className="text-lg font-roboto font-medium">Resultados - {props.fetchData.length}</p>
            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>
    
            <div className='result-container mt-3'>
                { props.fetchData.map(( item, index ) => (
                    <Link key={`${item.id}-${index}`} href={`/player/${props.typeOfId}/${item.id}`}>
                        <Style.imageBox>
                            <LazyLoadImage
                                src={`https://image.tmdb.org/t/p/original${item.poster_path ?? item.backdrop_path}`}
                                alt={`${item.title ?? item.name} serie/movie presentation image`}
                                loading="lazy"
                                width='100%'
                                effect="opacity"
                                placeholderSrc={`https://image.tmdb.org/t/p/w92/${item.poster_path ?? item.backdrop_path}`}
                                className="min-w-full object-cover h-full bg-darkpurple rounded-md image"
                            />

                            <div className="w-full description flex flex-col gap-y-1 font-normal font-noto_sans text-sm">
                                <p className="font-raleway font-bold text-[15px] text-white line-clamp-1">
                                    { item.title ?? item.name }
                                </p>

                                <div className="flex items-center gap-x-3">
                                    <p className="bg-orangered rounded-[4px] flex items-center w-fit px-3 h-5">{getReleaseDate( item.release_date ?? item.first_air_date )}
                                    </p>

                                    <p className="font-medium text-sm text-white">nota: {( item.vote_average).toFixed(0 )}</p>
                                </div>

                                <p className="line-clamp-2 text-neutral-200 leading-relaxed text-justif ">{ item.overview.length > 3 ? item.overview : 'Desculpe... não foi possível carregar a descrição deste conteúdo.' }
                                </p>
                            </div>
                        </Style.imageBox>
                    </Link>
                ))}
            </div>
        </Style.SearchResultWrapper>
    );
};