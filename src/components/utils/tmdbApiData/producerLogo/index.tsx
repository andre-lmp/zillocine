import { tmdbObjProps } from "@/components/contexts/tmdbContext";

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

// Carrega a imagem de logo da empresa de produção do filme/serie
export const getCompanyLogo = ( companiesList: tmdbObjProps[] ) => {
    for ( let company of companiesList ) {
        if ( company.logo_path ) {
            return (
                <LazyLoadImage 
                    src={`https://image.tmdb.org/t/p/original${company.logo_path}`} 
                    alt={`${company.name} logo image`} 
                    height={28}
                    effect="opacity"
                    placeholderSrc={`https://image.tmdb.org/t/p/w92/${company.logo_path}`}
                    className="object-cover w-fit h-7 bg-neutral-400 rounded-md"
                />
            )
        }
    };

    return null;
};
