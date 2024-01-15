import Lançamentos from '/src/components/lançamentos';
import Populares from '/src/components/populares';
import Terror from '/src/components/Terror';
import Ação from '/src/components/Açao';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef} from "react";
import {FaSearch} from "react-icons/fa";
import '/src/App.css';

function Movies() {
    const [btnAtivo, setBtnAtivo] = useState('btnDesativado');
    const navigate = useNavigate();
    const [autorizado, setAutorizado] = useState(false);
    const [component, setComponent] = useState('lançamentos');
    const btnInicio = () => {
        navigate('/');
        setBtnAtivo('btnDesativado');
    }

    const btnClick = () => {
        if (btnAtivo === 'btnDesativado'){
          setBtnAtivo('btnAtivo')
        }else{
          setBtnAtivo('btnDesativado')
        }
    }

    const handleURL = () => {
        navigate("/");
    }

    const btnFilmes = () => {
        navigate('/Filmes');
    }

    const clickBtnDef = (e) => {
        const valor = e.target.value
        setComponent(valor);
    }

    const btnSeriesMenu = () => {
        navigate('/Series');
    }

    const btnPerfil = () => {
        navigate('/Perfil');
    }

    useEffect(() => {
        const delay = setTimeout(() => {
            setAutorizado(true);
          }, 1000);
    },[]);

    return(
        <main className="moviesPageContainer">
            <div className="div-menu" id={btnAtivo}>
                <ul>
                    <li><button onClick={btnClick}><h1 id="p-1">/</h1><h1 id="p-2">\</h1></button></li>
                    <li><p onClick={btnInicio}>Inicio</p></li>
                    <li><p onClick={btnSeriesMenu}>Series</p></li>
                    <li><p onClick={btnFilmes}>Filmes</p></li>
                    <li><p onClick={btnPerfil}>Conta</p></li>
                </ul>
            </div>

            <div className="header-links">
                <div className='links-content'>
                    <div id="btn-filmes-series" className="link-icons">
                        <button onClick={btnClick} id="btn-menu">|||</button>
                        <a onClick={handleURL} className='btn-header'>Home</a>
                        <a className='btn-header' onClick={btnSeriesMenu}>Series</a>
                    </div>

                    <div className="links-titulo">
                        <h1>MovieZilla</h1>
                    </div>

                    <div className='link-icons'>
                        <FaSearch className='lupa-icon'/>
                        <div className="button-header-div">
                        <button>C</button>
                        <h3>Conta</h3>
                        </div>
                    </div>
                </div>
            </div>

            {autorizado === true ? (
                    <div className='barraGeneros'>
                        <ul>
                            <li><button value='lançamentos' onClick={clickBtnDef}>Lançamentos</button></li>
                            <li><button value='terror' onClick={clickBtnDef}>Terror</button></li>
                            <li><button value='ação' onClick={clickBtnDef}>Ação</button></li>
                            <li><button value='popular' onClick={clickBtnDef}>Populares</button></li>
                        </ul>
                    </div>
                ) : null
            }

            {component === 'lançamentos' ? (
                <div className='moviesPageLançamentos'>
                    <Lançamentos titulo='true' btn='false' page='1' tipo='filme'/>
                    <Lançamentos  page='2' tipo='filme'/>
                    <Lançamentos  page='3' tipo='filme'/>
                    <Lançamentos  page='4' tipo='filme'/>
                    <Lançamentos  page='5' tipo='filme'/>
                </div>
            ): null}

            {component === 'terror' ? (
                <div className='moviesPageLançamentos'>
                    <Terror titulo='true' btn='false' page='1' tipo='filme'/>
                    <Terror page='2' tipo='filme'/>
                    <Terror page='3' tipo='filme'/>
                    <Terror page='4' tipo='filme'/>
                    <Terror page='5' tipo='filme'/>
                </div>
            ):null}

            {component === 'ação' ? (
                <div className='moviesPageLançamentos'>
                    <Ação titulo='true' btn='false' page='1' tipo='filme'/>
                    <Ação page='2' tipo='filme'/>
                    <Ação page='3' tipo='filme'/>
                    <Ação page='4' tipo='filme'/>
                    <Ação page='5' tipo='filme'/>    
                </div>
            ):null}

            {component === 'popular' ? (
                <div className='moviesPageLançamentos'>
                    <Populares titulo='true' btn='false' page='1' tipo='filme'/>
                    <Populares page='2' tipo='filme'/>
                    <Populares page='3' tipo='filme'/>
                    <Populares page='4' tipo='filme'/>
                    <Populares page='5' tipo='filme'/>
                </div>
            ):null}

        </main>
    )
}

export default Movies;