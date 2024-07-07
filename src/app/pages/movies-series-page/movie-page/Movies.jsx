import '../pages-css/Movies-Series.css';
import React from 'react';
import { useState, useRef} from "react";
import HeaderSlides from '../../../shared-components/content-sliders/HeaderSlides.jsx';
const MoviesFetcher = React.lazy(() => import('../../../shared-components/content-fetcher/MoviesFetcher.jsx'));

function Movies() {
    const [movieGenre, setMovieGenre] = useState('lançamentos');
    const genreBtns = useRef([]);
    const [isVisible, setIsVisible] = useState(false);
    const [prevGenreBtn, setPrevGenreBtn] = useState(undefined);

    const handleGenreSelected = (btnRef) => {
        setMovieGenre(btnRef.target.value);

        if (!prevGenreBtn){
            btnRef.target.classList.toggle('genreSelected');
            setPrevGenreBtn(btnRef);
        }else{
            prevGenreBtn.target.classList.toggle('genreSelected'); 
            btnRef.target.classList.toggle('genreSelected');
            setPrevGenreBtn(btnRef);
        }
    };

    return(
        <section className='movies-pg'>
            <section className="container">
                <HeaderSlides isVisible={(value) => {setIsVisible(value)}} currentPage={'Movies'}/>
                
                {isVisible  &&
                    <div className='genres-bar'>
                        <ul>
                            <li><button ref={(e) => {genreBtns.current[0] = e}} value='lançamentos' onClick={(e) => {handleGenreSelected(e)}}>Lançamentos</button></li>
                            <li><button ref={(e) => {genreBtns.current[1] = e}} value='27' onClick={(e) => {handleGenreSelected(e)}}>Terror</button></li>
                            <li><button ref={(e) => {genreBtns.current[2] = e}} value='28' onClick={(e) => {handleGenreSelected(e)}}>Ação</button></li>
                            <li><button ref={(e) => {genreBtns.current[3] = e}} value='35' onClick={(e) => {handleGenreSelected(e)}}>Comedia</button></li>
                            <li><button ref={(e) => {genreBtns.current[4] = e}} value='10752' onClick={(e) => {handleGenreSelected(e)}}>Guerra</button></li>
                            <li><button ref={(e) => {genreBtns.current[5] = e}} value='16' onClick={(e) => {handleGenreSelected(e)}}>Animação</button></li>
                            <li><button ref={(e) => {genreBtns.current[6] = e}} value='99' onClick={(e) => {handleGenreSelected(e)}}>Documentarios</button></li>
                        </ul>
                    </div>
                };
                    
                {isVisible &&
                    <section className='box-movies'>
                        <MoviesFetcher sectionTitle={movieGenre} page='1' genre={movieGenre}/>

                        <MoviesFetcher sectionTitle={null} page='2' genre={movieGenre}/>

                        <MoviesFetcher sectionTitle={null} page='3' genre={movieGenre}/>

                        <MoviesFetcher sectionTitle={null} page='4' genre={movieGenre}/>

                        <MoviesFetcher sectionTitle={null} page='5' genre={movieGenre}/>
                    
                        <MoviesFetcher sectionTitle={null} page='6' genre={movieGenre}/>
                    </section>
                }
            </section>
        </section>
    )
}

export default Movies;