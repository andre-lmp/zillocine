import ContentCarousel from "@/components/contentCarousel";

import { useContext } from "react";
import { TmdbContext } from "@/components/contexts/tmdbContext";

export default function Main() {
    const tmdb = useContext( TmdbContext );

    const carouselsList =  Object.keys( tmdb.movieGenres ).map(( key, index ) => (
        key !== 'allGenres' && 
            <ContentCarousel 
                key={`home-${key}`} 
                contentGenre={ tmdb.movieGenres[key][0] } 
                contentType='movie' 
                sectionTitle={ tmdb.movieGenres[key][1] } 
                pageNumber={1}
                navigation={{ prevEl: `button-prev-${index}`, nextEl: `button-next-${index}` }}
            />
    ));

    return (
        <div className="py-6 px- flex flex-col gap-y-7">
            { carouselsList }
        </div> 
    )
};