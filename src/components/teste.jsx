import { useEffect, useState } from "react";

function Test() {
    const apiKey = "df087968ddf338b4ac0f9876af17f739";
    const [moviesDetails, setMoviesDetails] = useState();


    useEffect(() => {
        const fetchMovies = async () => {
            try {
              const lançamentos = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`);
              const data = await lançamentos.json();
              setMoviesDetails(data.results);
              console.log(data)
            } catch (error) {
              console.log(error);
            }
          }
             
          fetchMovies();
    },[]);

    return(
        <main>
            <h1>Ola</h1>
        </main>
    )
}

export default Test;