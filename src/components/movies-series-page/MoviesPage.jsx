import React from 'react';
import MoviesFetcher from '../app/shared-components/MovieFetcher';
import Loading from '../app/shared-components/LoadingContent';
import { useState, useRef} from "react";
import MovieSlides from '../app/shared-components/MoviesSlides';
import './Movies-Series.css';

function Movies() {
    const [movieGenre, setMovieGenre] = useState('Lançamentos');
    const genreBtns = useRef([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [prevGenreBtn, setPrevGenreBtn] = useState(undefined);

    const handleComponentIsLoading = (e) => {
        setIsLoading(e);
    };

    const componentIsVisible = (e) => {
        setIsVisible(e);
    };

    const handleGenreSelected = (btnRef) => {
        if(!isLoading){
            setMovieGenre(btnRef.target.value);

            if (!prevGenreBtn){
                btnRef.target.classList.toggle('genreSelected');
                setPrevGenreBtn(btnRef);
            }else{
                prevGenreBtn.target.classList.toggle('genreSelected'); 
                btnRef.target.classList.toggle('genreSelected');
                setPrevGenreBtn(btnRef);
            }
        }
    };

    return(
        <section className='movies-pg'>
            <section className="movies-pg-container">
                <MovieSlides isVisible={componentIsVisible} contentType={'Filme'} currentPage={'MoviesPage'}/>
                
                {isVisible  &&
                    <div className='genres-bar'>
                        <ul>
                            <li><button ref={(e) => {genreBtns.current[0] = e}} value='Lançamentos' onClick={(e) => {handleGenreSelected(e)}}>Lançamentos</button></li>
                            <li><button ref={(e) => {genreBtns.current[1] = e}} value='Terror' onClick={(e) => {handleGenreSelected(e)}}>Terror</button></li>
                            <li><button ref={(e) => {genreBtns.current[2] = e}} value='Ação' onClick={(e) => {handleGenreSelected(e)}}>Ação</button></li>
                            <li><button ref={(e) => {genreBtns.current[3] = e}} value='Comedia' onClick={(e) => {handleGenreSelected(e)}}>Comedia</button></li>
                            <li><button ref={(e) => {genreBtns.current[4] = e}} value='Guerra' onClick={(e) => {handleGenreSelected(e)}}>Guerra</button></li>
                            <li><button ref={(e) => {genreBtns.current[5] = e}} value='Animação' onClick={(e) => {handleGenreSelected(e)}}>Animação</button></li>
                            <li><button ref={(e) => {genreBtns.current[6] = e}} value='Documentario' onClick={(e) => {handleGenreSelected(e)}}>Documentarios</button></li>
                        </ul>
                    </div>
                };
                    
                <section className='box-movies'>
                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={true} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={movieGenre} btn='false' page='1' type='Movie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={movieGenre} btn='false' page='1' type='Movie' genre={movieGenre}/>
                            </div>
                        )}


                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='2' type='Movie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='2' type='Movie' genre={movieGenre}/>
                            </div>
                        )}


                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='3' type='Movie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='3' type='Movie' genre={movieGenre}/>
                            </div>
                        )}


                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='4' type='Movie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='4' type='Movie' genre={movieGenre}/>
                            </div>
                        )}


                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='5' type='Movie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='5' type='Movie' genre={movieGenre}/>
                            </div>
                        )}

                        
                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='6' type='Movie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='6' type='Movie' genre={movieGenre}/>
                            </div>
                        )}
                </section>

            </section>
        </section>
    )
}

export default Movies;