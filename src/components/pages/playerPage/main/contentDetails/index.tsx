'use client';

import { tmdbObjProps } from "@/components/contexts/tmdbContext";

import * as Style from '@/components/pages/playerPage/styles';

type ComponentProps = {
    contentData: tmdbObjProps;
    contentType: string;
};

export default function ContentDetails( props: ComponentProps ) {

    // Obtem a nota do publico sobre o conteudo
    const getImdbReviews = ( vote_average: number, vote_count: number ) => {
        return (
            <p className='text-[17px] font-medium font-noto_sans rounded'>
                <span className="mr-[6px]">Imdb: </span>

                <span className=' text-neutral-400 font-normal'>{ vote_average.toFixed(1) } ({ vote_count } Avaliações)</span>
            </p>
        );
    };

    // Obtem o orçamento do filme/serie
    const handleBudgetAndRevenue = ( value: number ) => {

        if ( value < 1000000000 ) {
            if ( value < 1000000 ){
                if ( value < 1000 ) {
                    if ( value > 0 ) return `${ value } dolares`;
                    return 'Valor não disponivel';
                };
        
                const division = parseInt(( value / 1000 ).toFixed(0));
                return `${ division } mil dolares`;
            };

            const division = parseInt(( value / 1000000 ).toFixed(0));
            return `${ division } milhões de dolares`;

        } else {
            if ( value > 0 ) {
                const division = parseInt(( value / 1000000000 ).toString()[0]);
                const rest = parseInt(( value % 1000000000 ).toString()[0]);
                return `${[ division, rest ].join('.')} bilhões de dolares`;
            };
        };

        return 'Valor não disponivel';
    };

    // Obtem o tempo de duração do filme 
    const getRunTime = ( runtime: number | null ) => {

        if ( !runtime || runtime === 0 ) {
            return (
                <span className="font-noto_sans whitespace-nowrap text-[17px] font-normal text-neutral-400 ">
                    Duração não disponivel
                </span>
            );
        };

        if ( runtime < 60 ) {
            return <span className="font-noto_sans whitespace-nowrap text-[17px] font-normal text-neutral-400 ">{ runtime }m</span>
        };

        const hours = ( runtime / 60 ).toFixed(0);
        const minites = runtime % 60;

        return  <span className="font-noto_sans whitespace-nowrap text-[17px] font-normal text-neutral-400 ">{ hours }h { minites }m</span>
    };

    // Obtem o nome dos produtores do filme/serie
    const getContentProducers = ( crew: tmdbObjProps[] ) => {
        const producers = crew.filter( people => people.job === 'Producer');
        const producersName: string[] = [];

        if ( producers.length > 0 ) {
            producers.forEach( producer => {
                producersName.push( producer.name );
            });

            if ( producersName.length >= 2 ) return producersName.join(', ');
            return producersName[0];
        };

        return 'Informação não disponivel';
    };

    const getContentCreator = ( creators: tmdbObjProps[] ) => {
        const creatorsName: string[] = []

        if ( creators.length > 0 ) {
            creators.forEach( creator => {
                creatorsName.push( creator.name );
            });

            if ( creatorsName.length >= 2 ) return creatorsName.join(', ');
            return creatorsName[0];
        };

        return 'Informação não disponivel';
    };


    return (
        <Style.ContentDetailsWrapper>
            {/* Coluna 1 de informações*/}
            <div>

                {/* Nota do publico ao conteudo */}
                {getImdbReviews( props.contentData.vote_average, props.contentData.vote_count )}

                {/* Generos */}
                <p className="content-detail text-[17px] font-medium rounded">
                    <span className="mr-[6px]">Gêneros:</span>

                    <span className="text-neutral-400 font-normal ">
                        { props.contentData.genres.map(( genre: Record<string, (string | number)> ) => genre.name ).join(', ')}
                    </span>
                </p>

                {/* Criador do filme/serie */}
                { props.contentType === 'serie' ? (
                    <p className="content-detail text-[17px] font-medium rounded">
                        <span className="mr-[6px]">Criado por:</span>

                        <span className="text-neutral-400 font-normal ">
                            {getContentCreator( props.contentData.created_by )}
                        </span>
                    </p>
                ) : null }

                {/* Direção */}
                <p className="content-detail text-[17px] font-medium rounded">
                    <span className="mr-[6px]">Direção:</span>

                    <span className="text-neutral-400 font-normal ">
                        {getContentProducers( props.contentData.credits.crew )}
                    </span>
                </p>

                {/* Lançamento */}
                <p className="content-detail text-[17px] font-medium rounded">
                    <span className="mr-[6px]">Data de lançamento:</span>

                    <span className="text-neutral-400 font-normal ">
                        { props.contentData.release_date ?? props.contentData.first_air_date }
                    </span>
                </p>

                {/* Orçamento */}
                { props.contentType === 'movie' ? (
                    <p className="content-detail text-[17px] font-medium rounded">
                        <span className="mr-[6px]">Orçamento:</span>

                        <span className="text-neutral-400 font-normal ">
                            {handleBudgetAndRevenue( props.contentData.budget )}
                        </span>
                    </p>
                ) : null }
            </div>

            {/* Coluna 2 de informações */}
            <div>

                {/* Bilheteria */}
                { props.contentType === 'movie' ? (
                    <p className="content-detail text-[17px] font-medium rounded">
                        <span className="mr-[6px]">Bilheteria:</span>

                        <span className="text-neutral-400 font-normal ">
                            {handleBudgetAndRevenue( props.contentData.revenue )}
                        </span>
                    </p>
                ) : null }

                {/* Pais de produção */}
                <p className="content-detail text-[17px] font-medium rounded">
                    <span className="mr-[6px]">Pais de produção:</span>

                    <span className="text-neutral-400 font-normal ">
                        { props.contentData.production_countries.map(( genre: Record<string, (string | number)> ) => genre.name ).join(', ')}
                    </span>
                </p>

                {/* Empresa de produção */}
                <p className="content-detail text-[17px] font-medium rounded">
                    <span className="mr-[6px]">Produtora(s):</span>

                    <span className="text-neutral-400 font-normal ">
                        { props.contentData.production_companies.map(( company: Record<string, (string | number)> ) => company.name ).join(', ')}
                    </span>
                </p>

                {/* Duração */}
                { props.contentType === 'movie' ? (
                    <p className="content-detail text-[17px] font-medium rounded">
                        <span className="mr-[6px]">Duração:</span>

                        {getRunTime( props.contentData.runtime )}
                    </p>
                ) : null }

                {/* Temporadas */}
                { props.contentType === 'serie' ? (
                    <p className="content-detail text-[17px] font-medium rounded">
                        <span className="mr-[6px]">Numero de temporadas:</span>

                        <span className="text-neutral-400 font-normal ">
                            { props.contentData.number_of_seasons }
                        </span>
                    </p>
                ) : null }

                {/* Episodios */}
                { props.contentType === 'serie' ? (
                    <p className="content-detail text-[17px] font-medium rounded">
                        <span className="mr-[6px]">Numero de episódios:</span>

                        <span className="text-neutral-400 font-normal ">
                            { props.contentData.number_of_episodes }
                        </span>
                    </p>
                ) : null }

            </div>
        </Style.ContentDetailsWrapper>
    );
};