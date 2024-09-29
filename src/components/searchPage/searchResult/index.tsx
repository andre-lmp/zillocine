import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import Image from "next/image";
import Link from "next/link";

import * as Style from '../styles';

type componentProps = {
    fetchData: tmdbObjProps[];
    typeOfId: string;
};

export default function ShowResults( props: componentProps ) {

    return props.fetchData[0] && (
        <Style.SearchResultWrapper>

            <p className="text-lg font-roboto font-medium">Resultados - {props.fetchData.length}</p>
            <div className='w-full h-0.5 bg-gradient-to-r mb-3 from-orangered to-transparent'></div>
    
            <div className='result-container mt-3'>
                { props.fetchData.map(( item, index ) => (
                    <Link key={`${item.id}-${index}`} href={`/player/${props.typeOfId}/${item.id}`}>
                        <div className="w-full rounded-md overflow-hidden">
                            <Image
                                src={`https://image.tmdb.org/t/p/original${item.poster_path ?? item.backdrop_path}`}
                                alt={`${item.title ?? item.name} serie/movie presentation image`}
                                width={170}
                                height={500}
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL={`https://image.tmdb.org/t/p/w92/${item.poster_path ?? item.backdrop_path}`}
                                className="w-full h-auto "
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </Style.SearchResultWrapper>
    );
};