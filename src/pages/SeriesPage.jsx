import MoviesFetcher from '/src/components/MovieFetcher.jsx';
import Loading from '/src/components/LoadingContent.jsx';
import { useState, useEffect, useRef} from "react";
import '/src/styles/Movies.css';

function Series() {
    const [authorized, setAuthorized] = useState(false);
    const [movieGenre, setMovieGenre] = useState('lançamentos');
    const genreBtns = useRef(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const handleComponentIsLoading = (e) => {
        setIsLoading(e);
    };

    const handleGenres = (e) => {
        setMovieGenre(e.target.value);
        handleColorBtn(e.target.value);
    };

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
        setAuthorized(true);
    },[]);

    return(
        <main className="movies-page-container">
            {authorized === true ? (
                    <div className='genres-bar'>
                        <ul ref={genreBtns}>
                            <li><button value='Lançamentos' onClick={handleGenres}>Lançamentos</button></li>
                            <li><button value='Terror' onClick={handleGenres}>Suspense</button></li>
                            <li><button value='Ação' onClick={handleGenres}>Ação</button></li>
                            <li><button value='Comedia' onClick={handleGenres}>Comedia</button></li>
                            <li><button value='Documentario' onClick={handleGenres}>Documentarios</button></li>
                        </ul>
                    </div>
                ) : null
            }

                <div className='box-series'>

                    {isLoading ? (
                        <div className='loading-container'>
                            <Loading title={true} />
                            <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={movieGenre} btn='false' page='1' type='Serie' genre={movieGenre}/>
                        </div>
                    ): (
                        <div className='loading-container'>
                            <MoviesFetcher visible={true} isLoading={handleComponentIsLoading} title={movieGenre} btn='false' page='1' type='Serie' genre={movieGenre}/>
                        </div>
                    )}


                    {isLoading ? (
                        <div className='loading-container'>
                            <Loading title={false} />
                            <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='2' type='Serie' genre={movieGenre}/>
                        </div>
                    ): (
                        <div className='loading-container'>
                            <MoviesFetcher visible={true} isLoading={handleComponentIsLoading} title={false} btn='false' page='2' type='Serie' genre={movieGenre}/>
                        </div>
                    )}


                    {isLoading ? (
                        <div className='loading-container'>
                            <Loading title={false} />
                            <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='3' type='Serie' genre={movieGenre}/>
                        </div>
                    ): (
                        <div className='loading-container'>
                            <MoviesFetcher visible={true} isLoading={handleComponentIsLoading} title={false} btn='false' page='3' type='Serie' genre={movieGenre}/>
                        </div>
                    )}


                    {isLoading ? (
                        <div className='loading-container'>
                            <Loading title={false} />
                            <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='4' type='Serie' genre={movieGenre}/>
                        </div>
                    ): (
                        <div className='loading-container'>
                            <MoviesFetcher visible={true} isLoading={handleComponentIsLoading} title={false} btn='false' page='4' type='Serie' genre={movieGenre}/>
                        </div>
                    )}


                    {isLoading ? (
                        <div className='loading-container'>
                            <Loading title={false} />
                            <MoviesFetcher visible={false} isLoading={handleComponentIsLoading} title={false} btn='false' page='5' type='Serie' genre={movieGenre}/>
                        </div>
                    ): (
                        <div className='loading-container'>
                            <MoviesFetcher visible={true} isLoading={handleComponentIsLoading} title={false} btn='false' page='5' type='Serie' genre={movieGenre}/>
                        </div>
                    )}
                </div>
            
        </main>
    )
}

export default Series;