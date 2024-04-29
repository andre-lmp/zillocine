import FetchMovies from '/src/components/ContainerMovies';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef} from "react";
import { LuSearch } from "react-icons/lu";
import Search from "/src/components/SearchBar";
import Footer from '/src/components/footer';
import '/src/App.css';
import { CgClose } from "react-icons/cg";

function Series() {
    const [menuActive, setMenuActive] = useState('disabled');
    const navigate = useNavigate(undefined);
    const [authorized, setAuthorized] = useState(false);
    const [movieGenre, setMovieGenre] = useState('lançamentos');
    const [hideBar, setHideBar] = useState(true);
    const AppRef = useRef(undefined);
    const genreBtns = useRef(undefined);
    const [scrolled, setScrolled] = useState(undefined);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50){
            setScrolled('scrolled');
        }else{
            setScrolled(undefined);
        }
    });

    const btnClick = () => {
        if (menuActive === 'disabled'){
          setMenuActive('menuActive');
          AppRef.current.style.transition = 'all .2s ease-in-out'
          AppRef.current.style.opacity = '.55';
          AppRef.current.style.zIndex = '1000';
        }else{
          setMenuActive('disabled');
          AppRef.current.style.opacity = 0;
          setTimeout(() => {
            AppRef.current.style.zIndex = '-200';
            AppRef.current.style.transition = 'all .3s ease-in-out';
          }, 200);
        }
    }
    
    const handleGenres = (e) => {
        const valor = e.target.value
        setMovieGenre(valor);
        handleColorBtn(e.target.value);
    }

    const btnNavigate = (e) => {
        navigate(`/${e.target.id}`)
    }

    const HandleHideChange = (newValue) => {
        setHideBar(newValue);
        AppRef.current.style.opacity = '0';
        AppRef.current.style.zIndex = '-200';
    }

    const hideBarSearch = () => {
        if (hideBar === true) {
          setMenuActive('desativado');
          setHideBar(false);
        AppRef.current.style.opacity = '.9';
        AppRef.current.style.zIndex = '100';
        }
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
        <main className="moviesPageContainer">
            <div ref={AppRef} className='opacity-div'></div>
            <div className="div-menu" id={menuActive}>
                <ul>
                    <li><button><CgClose onClick={btnClick} className="close-icon"/></button></li>
                    <li><p id='' onClick={btnNavigate}>Inicio</p></li>
                    <li><p id='Series' onClick={btnNavigate}>Series</p></li>
                    <li><p id='Filmes' onClick={btnNavigate}>Filmes</p></li>
                    <li><p onClick={hideBarSearch}>Pesquisar</p></li>
                    <li><p id='Perfil' onClick={btnNavigate}>Conta</p></li>
                </ul>
            </div>

            <Search onValueChange={HandleHideChange} hide={hideBar}/>

            <div id={scrolled} className="header-links">
                <div className='links-content'>
                    <div id="btn-filmes-series" className="link-icons">
                        <button onClick={btnClick} className="btn-menu">|||</button>
                        <a onClick={btnNavigate} id='' className='btn-header'>Home</a>
                        <a className='btn-header' id='Filmes' onClick={btnNavigate}>Filmes</a>
                    </div>

                    <div className="links-titulo">
                        <h1>MovieZilla</h1>
                    </div>

                    <div className='link-icons'>
                        <LuSearch onClick={hideBarSearch} className='lupa-icon'/>
                        <div className="button-header-div">
                        <button  id='Perfil' onClick={btnNavigate}>C</button>
                        <h3 id='Perfil' onClick={btnNavigate}>Conta</h3>
                        </div>
                    </div>
                </div>
            </div>

            {authorized === true ? (
                    <div className='barraGeneros'>
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
                    <FetchMovies titulo={movieGenre} btn='false' page='1' tipo='serie' genre={movieGenre}/>
                    <FetchMovies  page='2' tipo='serie' genre={movieGenre}/>
                    <FetchMovies  page='3' tipo='serie' genre={movieGenre}/>
                    <FetchMovies  page='4' tipo='serie' genre={movieGenre}/>
                    <FetchMovies  page='5' tipo='serie' genre={movieGenre}/>
                </div>
            
            <Footer/>
        </main>
    )
}

export default Series;