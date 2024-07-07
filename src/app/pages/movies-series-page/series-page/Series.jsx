import '../pages-css/Movies-Series.css';
import React from 'react';
import { useState, useRef} from "react";
import HeaderSlides from '../../../shared-components/content-sliders/HeaderSlides.jsx';
const SeriesFetcher = React.lazy(() => import('../../../shared-components/content-fetcher/SeriesFetcher.jsx'));

function Series() {
    const [serieGenre, setserieGenre] = useState('lançamentos');
    const genreBtns = useRef(undefined);
    const [isVisible, setIsVisible] = useState(false);
    const [prevGenreBtn, setPrevGenreBtn] = useState(undefined);

    const handleSelectedGenre = (btnRef) => {
        setserieGenre(btnRef.target.value);

        if (!prevGenreBtn){
            btnRef.target.classList.toggle('genreSelected');
            setPrevGenreBtn(btnRef);
        }else{
            prevGenreBtn.target.classList.toggle('genreSelected'); 
            btnRef.target.classList.toggle('genreSelected');
            setPrevGenreBtn(btnRef);
        }
    }

    return(
        <section className='movies-pg'>
            <section className="movies-pg-container">
                    <HeaderSlides isVisible={(value) => {setIsVisible(value)}} currentPage={'Series'}/>

                    {isVisible &&
                        <div className='genres-bar'>
                            <ul ref={genreBtns}>
                                <li><button value='lançamentos' onClick={(e) => {handleSelectedGenre(e)}}>Lançamentos</button></li>
                                <li><button value={9648} onClick={(e) => {handleSelectedGenre(e)}}>Suspense</button></li>
                                <li><button value={10759} onClick={(e) => {handleSelectedGenre(e)}}>Ação</button></li>
                                <li><button value={35} onClick={(e) => {handleSelectedGenre(e)}}>Comedia</button></li>
                                <li><button value={10768} onClick={(e) => {handleSelectedGenre(e)}}>Guerra</button></li>
                                <li><button value={16} onClick={(e) => {handleSelectedGenre(e)}}>Animação</button></li>
                                <li><button value={99} onClick={(e) => {handleSelectedGenre(e)}}>Documentarios</button></li>
                            </ul>
                        </div>
                    };

                    {isVisible ? (
                        <section className='box-series'>
                            <SeriesFetcher sectionTitle={serieGenre} page='1' genre={serieGenre}/>
                    
                            <SeriesFetcher sectionTitle={null} page='2' genre={serieGenre}/>
                    
                            <SeriesFetcher sectionTitle={null} page='3' genre={serieGenre}/>
                    
                            <SeriesFetcher sectionTitle={null} page='4' genre={serieGenre}/>
                    
                            <SeriesFetcher sectionTitle={null} page='5' genre={serieGenre}/>
                    
                            <SeriesFetcher sectionTitle={null} page='6' genre={serieGenre}/>
                        </section>
                    ) : null}
            </section>
        </section>
    )
}

export default Series;