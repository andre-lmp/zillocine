import MoviesFetcher from '/src/components/MovieFetcher.jsx';
import Loading from '/src/components/LoadingContent.jsx';
import { useState, useEffect, useRef} from "react";
import Footer from '/src/components/footer';
import '/src/styles/Movies.css';

function Series() {
    const [authorized, setAuthorized] = useState(false);
    const [movieGenre, setMovieGenre] = useState('lançamentos');
    const genreBtns = useRef(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingIsDisable, setLoadingIsDisable] = useState(false);

    const handleLoadingDisable = (e) => {
        setLoadingIsDisable(e);
    };

    const handleComponentLoaded = (e) => {
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
                            <li><button value='Terror' onClick={handleGenres}>Suspense</button></li>
                            <li><button value='Ação' onClick={handleGenres}>Ação</button></li>
                            <li><button value='Comedia' onClick={handleGenres}>Comedia</button></li>
                            <li><button value='Documentario' onClick={handleGenres}>Documentarios</button></li>
                        </ul>
                    </div>
                ) : null
            }

                <div className='box-series'>
            
                    <div className="loading-container">
                        <Loading title={true} active={isLoading}/>
                        <MoviesFetcher isLoaded={handleComponentLoaded} title={movieGenre} btn='false' page='1' type='Serie' genre={movieGenre}/>
                    </div>

                    <div className="loading-container">
                        <Loading title={false} active={isLoading}/>
                        <MoviesFetcher isLoaded={handleComponentLoaded} page='2' type='Serie' genre={movieGenre}/>
                    </div>

                    <div className="loading-container">
                        <Loading title={false} active={isLoading}/>
                        <MoviesFetcher isLoaded={handleComponentLoaded} page='3' type='Serie' genre={movieGenre}/>
                    </div>

                    <div className="loading-container">
                        <Loading title={false} active={isLoading}/>
                        <MoviesFetcher isLoaded={handleComponentLoaded} page='4' type='Serie' genre={movieGenre}/>
                    </div>

                    <div className="loading-container">
                        <Loading title={false} active={isLoading}/>
                        <MoviesFetcher isLoaded={handleComponentLoaded} page='5' type='Serie' genre={movieGenre}/>
                    </div>

                </div>
            
            <Footer/>
        </main>
    )
}

export default Series;