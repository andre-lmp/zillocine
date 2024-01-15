import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import {FaSearch} from "react-icons/fa";
import imgFundo from '/src/images/fundo.png';

function Perfil() {
    const [autorizado, setAutorizado] = useState(false);
    const navigate = useNavigate();
    const [btnAtivo, setBtnAtivo] = useState('btnDesativado');

    const delay = setTimeout(() => {
        setAutorizado(true);
    }, 1000);

    const btnClick = () => {
        if (btnAtivo === 'btnDesativado'){
          setBtnAtivo('btnAtivo')
        }else{
          setBtnAtivo('btnDesativado')
        }
    }

    const btnFilmes = () => {
        navigate('/Filmes');
    }
    
      const btnSeries = () => {
        navigate('/Series');
    }

    const btnInicio = () => {
        navigate('/');
        setBtnAtivo('btnDesativado');
    }

    const handleURL = () => {
        navigate("/");
    }

    return autorizado ?(
        <main className="perfilContainer">
            <div className="div-menu" id={btnAtivo}>
                <ul>
                    <li><button onClick={btnClick}><h1 id="p-1">/</h1><h1 id="p-2">\</h1></button></li>
                    <li><p onClick={btnInicio}>Inicio</p></li>
                    <li><p onClick={btnFilmes}>Filmes</p></li>
                    <li><p onClick={btnSeries}>Series</p></li>
                    <li><p>Conta</p></li>
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
                        <button>C</button>
                        <h3>Conta</h3>
                        </div>
                    </div>

                </div>
            </div>

            <div className="fundoContainerPerfil">
                <div className="fundoImageContainer">
                    <img src={imgFundo}/>
                </div>
                <div className="basePerfil"><div className="perfilIMG"><FontAwesomeIcon id='userIcon' icon={faUser}/></div></div>
                <div className="perfilLinear"></div>
            </div>

            <div className="dadosCadastroContainer">
                <div className="cadastroDados"><h1>Nome</h1><h2>UsuarioTest</h2></div>
                <div className="cadastroDados"><h1>Endereço de Email</h1><h2>Usuariotest43@gmail.com</h2></div>
                <div className="cadastroDados"><h1>Senha</h1><h2>********</h2></div>
            </div>
        </main>
    ) : null;
}

export default Perfil;