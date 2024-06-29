import { useState, useEffect } from "react";
import Carousel from '../content-sliders/Carousel.jsx';

const SeriesFetcher = (props) => {
    const [series, setSeries] = useState(undefined);
    const apiKey = "e1534e69b483f2e9d62ea1c394850e4e";
    const newDate = new Date().toISOString().split('T')[0];

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
            fetchSeries(apiKey, props.genre, props.page);
        };
    },[props.genre]);

    return(
        series ? <Carousel slidesData={series} sectionTitle={props.sectionTitle} contentType='Serie'/> : null
    );

};

export default SeriesFetcher;