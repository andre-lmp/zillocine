import LatestMovies from '/src/components/LatestMovies';
import PopularMovies from '/src/components/PopularMovies';
import HorrorMovies from '/src/components/HorrorMovies';
import ActionMovies from '/src/components/ActionMovies';
import Documentaries from '/src/components/Documentaries';
import ComedyMovies from '/src/components/ComedyMovies';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef} from "react";
import { LuSearch, LuServer } from "react-icons/lu";
import Search from "/src/components/SearchBar";
import '/src/App.css';

function Movies() {
    const [btnAtivo, setBtnAtivo] = useState('btnDesativado');
    const navigate = useNavigate();
    const [autorizado, setAutorizado] = useState(false);
    const [component, setComponent] = useState('LatestMovies');
    const [hideBar, setHideBar] = useState(true);
    const AppRef = useRef();
    const HeightMovies = useRef();
    const [heightPageMovies, setHeightPageMovies] = useState(); 

    const btnClick = () => {
        if (btnAtivo === 'btnDesativado'){
          setBtnAtivo('btnAtivo')
        }else{
          setBtnAtivo('btnDesativado')
        }
    }

    const DefComponent = (e) => {
        const valor = e.target.value
        setComponent(valor);
    }

    const btnNavigate = (e) => {
        console.log(e);
        navigate(`/${e.target.id}`)
    }

    const HandleHideChange = (newValue) => {
        setHideBar(newValue);
        AppRef.current.style.opacity = '0';
        AppRef.current.style.zIndex = '-200';
    }

    const hideBarSearch = () => {
        if (hideBar === true) {
          setBtnAtivo('desativado');
          setHideBar(false);
          AppRef.current.style.opacity = '.9';
          AppRef.current.style.zIndex = '100';
          AppRef.current.style.height = `${heightPageMovies}px`;
        }
    }

    const GetHeight = setTimeout(() => {
        setHeightPageMovies(HeightMovies.current?.scrollHeight);
    }, 2000);

    useEffect(() => {
        const delay = setTimeout(() => {
            setAutorizado(true);
        }, 1000);
        
    },[]);

    return(
        <main ref={HeightMovies} className="moviesPageContainer">
            <div ref={AppRef} className='opacity-div'></div>
            <div className="div-menu" id={btnAtivo}>
                <ul>
                    <li><button onClick={btnClick}><h1 id="p-1">/</h1><h1 id="p-2">\</h1></button></li>
                    <li><p id='' onClick={btnNavigate}>Inicio</p></li>
                    <li><p id='Series' onClick={btnNavigate}>Series</p></li>
                    <li><p id='Filmes' onClick={btnNavigate}>Filmes</p></li>
                    <li><p id='Perfil' onClick={btnNavigate}>Conta</p></li>
                    <li><p onClick={hideBarSearch}>Pesquisar</p></li>
                </ul>
            </div>

            <Search onValueChange={HandleHideChange} hide={hideBar}/>

            <div className="header-links">
                <div className='links-content'>
                    <div id="btn-filmes-series" className="link-icons">
                        <button onClick={btnClick} className="btn-menu">|||</button>
                        <a onClick={btnNavigate} id='' className='btn-header'>Home</a>
                        <a className='btn-header' id='Series' onClick={btnNavigate}>Series</a>
                    </div>

                    <div className="links-titulo">
                        <h1>MovieZilla</h1>
                    </div>

                    <div className='link-icons'>
                        <LuSearch onClick={hideBarSearch} className='lupa-icon'/>
                        <div className="button-header-div">
                        <button id='Perfil' onClick={btnNavigate}>C</button>
                        <h3 id='Perfil' onClick={btnNavigate}>Conta</h3>
                        </div>
                    </div>
                </div>
            </div>

            {autorizado === true ? (
                    <div className='barraGeneros'>
                        <ul>
                            <li><button value='LatestMovies' onClick={DefComponent}>Lançamentos</button></li>
                            <li><button value='HorrorMovies' onClick={DefComponent}>Suspense</button></li>
                            <li><button value='ActionMovies' onClick={DefComponent}>Ação</button></li>
                            <li><button value='PopularMovies' onClick={DefComponent}>Populares</button></li>
                            <li><button value='ComedyMovies' onClick={DefComponent}>Comedia</button></li>
                            <li><button value='Documentaries' onClick={DefComponent}>Documentarios</button></li>
                        </ul>
                    </div>
                ) : null
            }

            {component === 'LatestMovies' ? (
                <div className='moviesPageLatestMovies'>
                    <LatestMovies titulo='true' btn='false' page='1' tipo='filme'/>
                    <LatestMovies  page='2' tipo='filme'/>
                    <LatestMovies  page='3' tipo='filme'/>
                    <LatestMovies  page='4' tipo='filme'/>
                    <LatestMovies  page='5' tipo='filme'/>
                </div>
            ): null}

            {component === 'HorrorMovies' ? (
                <div className='moviesPageLatestMovies'>
                    <HorrorMovies titulo='true' btn='false' page='1' tipo='filme'/>
                    <HorrorMovies page='2' tipo='filme'/>
                    <HorrorMovies page='3' tipo='filme'/>
                    <HorrorMovies page='4' tipo='filme'/>
                    <HorrorMovies page='5' tipo='filme'/>
                </div>
            ):null}

            {component === 'ActionMovies' ? (
                <div className='moviesPageLatestMovies'>
                    <ActionMovies titulo='true' btn='false' page='1' tipo='filme'/>
                    <ActionMovies page='2' tipo='filme'/>
                    <ActionMovies page='3' tipo='filme'/>
                    <ActionMovies page='4' tipo='filme'/>
                    <ActionMovies page='5' tipo='filme'/>    
                </div>
            ):null}

            {component === 'PopularMovies' ? (
                <div className='moviesPageLatestMovies'>
                    <PopularMovies titulo='true' btn='false' page='1' tipo='filme'/>
                    <PopularMovies page='2' tipo='filme'/>
                    <PopularMovies page='3' tipo='filme'/>
                    <PopularMovies page='4' tipo='filme'/>
                    <PopularMovies page='5' tipo='filme'/>
                </div>
            ):null}

            {component === 'Documentaries' ? (
                <div className='moviesPageLatestMovies'>
                    <Documentaries titulo='true' btn='false' page='1' tipo='filme'/>
                    <Documentaries page='2' tipo='filme'/>
                    <Documentaries page='3' tipo='filme'/>
                    <Documentaries page='4' tipo='filme'/>
                    <Documentaries page='5' tipo='filme'/>
                </div>
            ):null}

            {component === 'ComedyMovies' ? (
                <div className='moviesPageLatestMovies'>
                    <ComedyMovies titulo='true' btn='false' page='1' tipo='filme'/>
                    <ComedyMovies page='2' tipo='filme'/>
                    <ComedyMovies page='3' tipo='filme'/>
                    <ComedyMovies page='4' tipo='filme'/>
                    <ComedyMovies page='5' tipo='filme'/>
                </div>
            ):null}

        </main>
    )
}

export default Movies;