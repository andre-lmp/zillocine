import { useState, useEffect, useContext } from "react";
import Carousel from '../content-sliders/Carousel.jsx';
import { TmdbContext } from "../context-api/tmdb-context/tmdbContext.jsx";

const MoviesFetcher = (props) => {
    const [movies, setMovies] = useState(undefined);
    const newDate = new Date().toISOString().split('T')[0];
    const apiKey = useContext(TmdbContext);

    const fetchMovies = async (token, genre, page, currentDate) => {
        if (genre === 'lançamentos'){
            try{
                const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${token}&primary_release_date.gte=${currentDate}&sort=primary_release_date.desc&language=pt-BR&include_image_language=pt&page=${page}`);
                if (response.ok){
                    const data = await response.json();
                    setMovies(data.results);
                }

            } catch (error){
                console.error(error);
            }

        } else{
            try{
                const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${token}&with_genres=${genre}&language=pt-BR&include_image_language=pt&page=${page}`);
                if (response.ok){
                    const data = await response.json();
                    setMovies(data.results);
                }

            } catch (error){
                console.error(error);
            }
        }
    };

    useEffect(() => {
        if (props.genre && props.page){
            fetchMovies(apiKey.token, props.genre, props.page, newDate);
        };
    },[props.genre]);

    return(
        movies ? <Carousel slidesData={movies} sectionTitle={props.sectionTitle} removeLine={props.removeLine ? props.removeLine : false} contentType='Movie'/> : null
    );
};

export default MoviesFetcher;