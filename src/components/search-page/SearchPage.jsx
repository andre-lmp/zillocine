import { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { HiXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import './Search.css';

function SearchContent() {
    const [contentData, setContentData] = useState([]);
    const apiKey = "df087968ddf338b4ac0f9876af17f739";
    const userInputRef = useRef(undefined);
    const [fetchContentType, setFetchContentType] = useState('Movie');
    const navigate = useNavigate(undefined);
    const contentTypeBtnsRef = useRef([]);

    const FetchMovies = async (e) => {
        try{
             const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${e}`);
             if (response.ok) {
                 const data = await response.json();
                 setContentData(data.results);
             }else{
                setContentData([]);
             }
        }catch (error) {
             console.error(error);
             setContentData([]);
        }
     };

     const FetchSeries = async (e) => {
        try{
             const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=pt-BR&query=${e}`);
             if (response.ok) {
                 const data = await response.json();
                 setContentData(data.results);
             }else{
                setContentData([]);
             }
        }catch (error) {
             console.error(error);
             setContentData([]);
        }
     };

     const getUserInputValue = (e) => {
        if (e) {
            if (fetchContentType === 'Movie'){
                FetchMovies(e.target.value);
            }else{
                FetchSeries(e.target.value);
            }
        }else{
            if (fetchContentType === 'Movie'){
                FetchMovies('Familia');
            }else{
                FetchSeries('Familia');
            }
        }
     };

     const changeFetchType = (e, term) => {
        if (e === 'Movie'){
            setFetchContentType('Movie');
            if (!term) {
                FetchMovies(userInputRef.current.value);
            }else{
                FetchMovies(term);
            }

            if (contentTypeBtnsRef){
                contentTypeBtnsRef[0].style.border = '1.5pt solid rgb(255, 255, 255)';
                contentTypeBtnsRef[1].style.border = '1.5pt solid transparent';
            }
        }else{
            setFetchContentType('Serie');
            if (!term) {
                FetchSeries(userInputRef.current.value);
            }else{
                FetchSeries(term);
            }
            if (contentTypeBtnsRef){
                contentTypeBtnsRef[1].style.border = '1.5pt solid rgb(255, 255, 255)';
                contentTypeBtnsRef[0].style.border = '1.5pt solid transparent';
            }
        }
     };

     const handleUnavailableContent = (index) => {
        if (contentData[index]){
            contentData.splice(index, 1);
        }
     };

     const resetInputValue = () => {
        if (userInputRef.current){
            userInputRef.current.value = null;
            FetchMovies('the');
        }
     };

     const handleNavigation = (id) => {
        navigate(`/Page/${id}/${fetchContentType}`);
     };

     useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        FetchMovies('the');
        changeFetchType('Movie', 'the');

        return () => {
            controller.abort();
        };
     }, []);

    return(
        <section className="search-pg">
            <section className="search-container">
                <section className="input-container">
                    <div className="input-box">
                        <FiSearch className="lupa-icon"/>
                        <input onChange={getUserInputValue} ref={userInputRef} type="text" placeholder="O que voce está procurando ?"></input>
                        <HiXMark onClick={resetInputValue} className="reset-input-icon"/>
            
                        <div className="content-tp-options">
                            <button value='Movie' onClick={(e) => {changeFetchType(e.target.value, undefined)}} ref={(e) => {contentTypeBtnsRef[0] = e}}>Filmes</button>
                            <button value='Serie' onClick={(e) => {changeFetchType(e.target.value, undefined)}} ref={(e) => {contentTypeBtnsRef[1] = e}}>Series</button>
                        </div>
                    </div>
                </section>
                <section className="fetch-result-container">
                    {contentData.length !== 0 ? (
                        <h2>({contentData.length}) Encontrados</h2>
                    ): null}
                    {contentData.map((content, index) => (
                        <div key={content.id} className="content-box" onClick={() => {handleNavigation(content.id)}} >
            
                            {content.poster_path &&
                             <img display={undefined} src={`https://image.tmdb.org/t/p/w500${content.poster_path}`}></img>
                            }
                            {content.backdrop_path &&
                                <img display={undefined} src={`https://image.tmdb.org/t/p/w500${content.backdrop_path}`}></img>
                            }
                            {!content.backdrop_path && !content.poster_path ? (
                                handleUnavailableContent(index)
                            ): null}
                        </div>
                    ))}
                </section>
            </section>
        </section>
    )
};

export default SearchContent;