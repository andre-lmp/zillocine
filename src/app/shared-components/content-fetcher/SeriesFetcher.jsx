import { useState, useEffect, useContext } from "react";
import Carousel from '../content-sliders/Carousel.jsx';
import { TmdbContext } from "../context-api/tmdb-context/tmdbContext.jsx";

const SeriesFetcher = (props) => {
    const [series, setSeries] = useState(undefined);
    const apiKey = useContext(TmdbContext);

    const fetchSeries = async (token, genre, page) => {
        if (genre === 'lançamentos'){
            try{
                const response = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${token}&language=pt-BR&page=${page}`);
                if (response.ok){
                    const data = await response.json();
                    setSeries(data.results);
                }

            } catch (error){
                console.error(error);
            }

        } else{
            try{
                const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${token}&with_genres=${genre}&page=${page}`);
                if (response.ok){
                    const data = await response.json();
                    setSeries(data.results);
                }

            } catch (error){
                console.error(error);
            }
        }
    };

    useEffect(() => {
        if (props.genre && props.page){
            fetchSeries(apiKey.token, props.genre, props.page);
        };
    },[props.genre]);

    return(
        series ? <Carousel slidesData={series} sectionTitle={props.sectionTitle} contentType='Serie'/> : null
    );

};

export default SeriesFetcher;