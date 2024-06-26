import MoviesFetcher from '../app/shared-components/MovieFetcher';
import Loading from '../app/shared-components/LoadingContent';
import { useState, useRef} from "react";
import MovieSlides from '../app/shared-components/MoviesSlides';
import './Movies-Series.css';

function Series() {
    const [movieGenre, setMovieGenre] = useState('lançamentos');
    const genreBtns = useRef(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [prevGenreBtn, setPrevGenreBtn] = useState(undefined);

    const componentIsVisible = (e) => {
        setIsVisible(e);
    };

    const handleComponentIsLoading = (e) => {
        setIsLoading(e);
    };

    const handleSelectedGenre = (btnRef) => {
        if (!isLoading){
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
    }

    return(
        <section className='movies-pg'>
            <section className="movies-pg-container">
                    <MovieSlides isVisible={componentIsVisible} contentType={'Serie'} currentPage={'SeriesPage'}/>

                    {isVisible &&
                        <div className='genres-bar'>
                            <ul ref={genreBtns}>
                                <li><button value='Lançamentos' onClick={(e) => {handleSelectedGenre(e)}}>Lançamentos</button></li>
                                <li><button value='Terror' onClick={(e) => {handleSelectedGenre(e)}}>Suspense</button></li>
                                <li><button value='Ação' onClick={(e) => {handleSelectedGenre(e)}}>Ação</button></li>
                                <li><button value='Comedia' onClick={(e) => {handleSelectedGenre(e)}}>Comedia</button></li>
                                <li><button value='Guerra' onClick={(e) => {handleSelectedGenre(e)}}>Guerra</button></li>
                                <li><button value='Animação' onClick={(e) => {handleSelectedGenre(e)}}>Animação</button></li>
                                <li><button value='Documentario' onClick={(e) => {handleSelectedGenre(e)}}>Documentarios</button></li>
                            </ul>
                        </div>
                    };

                    <div className='box-series'>
                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={true} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={movieGenre} btn='false' page='1' type='Serie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={movieGenre} btn='false' page='1' type='Serie' genre={movieGenre}/>
                            </div>
                        )}
                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='2' type='Serie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='2' type='Serie' genre={movieGenre}/>
                            </div>
                        )}
                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='3' type='Serie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='3' type='Serie' genre={movieGenre}/>
                            </div>
                        )}
                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='4' type='Serie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='4' type='Serie' genre={movieGenre}/>
                            </div>
                        )}
                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='5' type='Serie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='5' type='Serie' genre={movieGenre}/>
                            </div>
                        )}

                        {isLoading ? (
                            <div className='loading-container'>
                                <Loading title={false} />
                                <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='5' type='Serie' genre={movieGenre}/>
                            </div>
                        ): (
                            <div className='loading-container'>
                                <MoviesFetcher visible={isVisible} isLoading={handleComponentIsLoading} title={false} btn='false' page='6' type='Serie' genre={movieGenre}/>
                            </div>
                        )}
                    </div>
            </section>
        </section>
    )
}

export default Series;