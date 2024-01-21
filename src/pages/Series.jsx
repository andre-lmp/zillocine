import Lançamentos from '/src/components/lançamentos';
import Populares from '/src/components/populares';
import Terror from '/src/components/Terror';
import Ação from '/src/components/Açao';
import Documentarios from '/src/components/Documentarios';
import Comedia from '/src/components/Comedia';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef} from "react";
import {FaSearch} from "react-icons/fa";
import '/src/App.css';

function Series() {
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
                        <a className='btn-header' onClick={btnFilmes}>Filmes</a>
                    </div>

                    <div className="links-titulo">
                        <h1>MovieZilla</h1>
                    </div>

                    <div className='link-icons'>
                        <FaSearch className='lupa-icon'/>
                        <div className="button-header-div">
                        <button onClick={btnPerfil}>C</button>
                        <h3 onClick={btnPerfil}>Conta</h3>
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
                            <li><button value='comedia' onClick={clickBtnDef}>Comedia</button></li>
                            <li><button value='documentario' onClick={clickBtnDef}>Documentarios</button></li>
                        </ul>
                    </div>
                ) : null
            }

            {component === 'lançamentos' ? (
                <div className='moviesPageLançamentos'>
                    <Lançamentos titulo='true' btn='false' page='1' tipo='serie'/>
                    <Lançamentos  page='2' tipo='serie'/>
                    <Lançamentos  page='3' tipo='serie'/>
                    <Lançamentos  page='4' tipo='serie'/>
                    <Lançamentos  page='5' tipo='serie'/>
                </div>
            ): null}

            {component === 'terror' ? (
                <div className='moviesPageLançamentos'>
                    <Terror titulo='true' btn='false' page='1' tipo='serie'/>
                    <Terror page='2' tipo='serie'/>
                    <Terror page='3' tipo='serie'/>
                    <Terror page='4' tipo='serie'/>
                    <Terror page='5' tipo='serie'/>
                </div>
            ):null}

            {component === 'ação' ? (
                <div className='moviesPageLançamentos'>
                    <Ação titulo='true' btn='false' page='1' tipo='serie'/>
                    <Ação page='2' tipo='serie'/>
                    <Ação page='3' tipo='serie'/>
                    <Ação page='4' tipo='serie'/>
                    <Ação page='5' tipo='serie'/>    
                </div>
            ):null}

            {component === 'documentario' ? (
                <div className='moviesPageLançamentos'>
                    <Documentarios titulo='true' btn='false' page='1' tipo='serie'/>
                    <Documentarios page='2' tipo='serie'/>
                    <Documentarios page='3' tipo='serie'/>
                    <Documentarios page='4' tipo='serie'/>
                    <Documentarios page='5' tipo='serie'/>
                </div>
            ):null}

            {component === 'comedia' ? (
                <div className='moviesPageLançamentos'>
                    <Comedia titulo='true' btn='false' page='1' tipo='serie'/>
                    <Comedia page='2' tipo='serie'/>
                    <Comedia page='3' tipo='serie'/>
                    <Comedia page='4' tipo='serie'/>
                    <Comedia page='5' tipo='serie'/>
                </div>
            ):null}

        </main>
    )
}

export default Series;