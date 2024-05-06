import React from 'react';
import MoviesFetcher from '/src/components/MovieFetcher.jsx';
import { useState, useEffect, useRef} from "react";
import '/src/styles/Movies.css';
import Footer from '/src/components/footer';

function Movies() {
    const [authorized, setAuthorized] = useState(false);
    const [movieGenre, setMovieGenre] = useState('Lançamentos');
    const [key, setKey] = useState(0); 
    const genreBtns = useRef(undefined);

    const handleGenres = (e) => {
        setMovieGenre(e.target.value);
        setKey(prevKey => prevKey + 1);
        handleColorBtn(e.target.value);
    }

    const handleColorBtn = (genre) => {
        if (genreBtns.current){
            const children = genreBtns.current.children;
            for (let child in children){
                if (children[child].childNodes[0].value === genre){
                    children[child].childNodes[0].style.color = 'white';
                }else{
                    children[child].childNodes[0].style.color = 'rgba(255, 255, 255, 0.7)';
                }
            }
        }
    }

    useEffect(() => {
        const delay = setTimeout(() => {
            setAuthorized(true);
        }, 1000);
        
    },[]);

    return(
        <main className="movies-page-container">
            {authorized === true ? (
                    <div className='genres-bar'>
                        <ul ref={genreBtns}>
                            <li><button value='Lançamentos' onClick={handleGenres}>Lançamentos</button></li>
                            <li><button value='Terror' onClick={handleGenres}>Terror</button></li>
                            <li><button value='Ação' onClick={handleGenres}>Ação</button></li>
                            <li><button value='Comedia' onClick={handleGenres}>Comedia</button></li>
                            <li><button value='Documentario' onClick={handleGenres}>Documentarios</button></li>
                        </ul>
                    </div>
                ) : null
            }
            <div className='box-movies'>
                <MoviesFetcher titulo={movieGenre} btn='false' page='1' tipo='filme' genre={movieGenre}/>
                <MoviesFetcher page='2' tipo='filme' genre={movieGenre}/>
                <MoviesFetcher page='3' tipo='filme' genre={movieGenre}/>
                <MoviesFetcher page='4' tipo='filme' genre={movieGenre}/>
                <MoviesFetcher page='5' tipo='filme' genre={movieGenre}/>
            </div>

            <Footer/>
        </main>
    )
}

export default Movies;