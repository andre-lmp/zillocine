import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import BackgroundProfile from '/src/images/BackgroundProfile.png';
import Search from "/src/components/SearchBar";
import Footer from '/src/components/footer';
import { CgClose } from "react-icons/cg";

function ProfilePage() {
    const [autorizado, setAutorizado] = useState(false);
    const navigate = useNavigate();
    const [btnAtivo, setBtnAtivo] = useState('btnDesativado');
    const [hideBar, setHideBar] = useState(true);
    const AppRef = useRef();

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
        }
    }

    return autorizado ?(
        <main className="perfilContainer">
            <div ref={AppRef} className='opacity-div'></div>
            <div className="div-menu" id={btnAtivo}>
                <ul>
                    <li><button><CgClose onClick={btnClick} className="close-icon"/></button></li>
                    <li><p id="" onClick={btnNavigate}>Inicio</p></li>
                    <li><p id="Filmes" onClick={btnNavigate}>Filmes</p></li>
                    <li><p id='Series' onClick={btnNavigate}>Series</p></li>
                    <li><p onClick={hideBarSearch}>Pesquisar</p></li>
                    <li><p id="Perfil" onClick={btnNavigate}>Conta</p></li>
                </ul>
            </div>

            <Search onValueChange={HandleHideChange} hide={hideBar}/>

            <div className="header-links">
                <div className='links-content'>
                    <div id="btn-filmes-series" className="link-icons">
                        <button onClick={btnClick} className="btn-menu">|||</button>
                        <a onClick={btnNavigate} id="" className='btn-header'>Home</a>
                        <a className='btn-header' id="Filmes" onClick={btnNavigate}>Filmes</a>
                    </div>

                    <div className="links-titulo">
                        <h1>MovieZilla</h1>
                    </div>

                    <div className='link-icons'>
                        <LuSearch onClick={hideBarSearch} className='lupa-icon'/>
                        <div className="button-header-div">
                        <button>C</button>
                        <h3>Conta</h3>
                        </div>
                    </div>

                </div>
            </div>

            <div className="fundoContainerPerfil">
                <div className="fundoImageContainer">
                    <img src={BackgroundProfile}/>
                </div>
                <div className="basePerfil"><div className="perfilIMG"><FontAwesomeIcon id='userIcon' icon={faUser}/></div></div>
                <div className="perfilLinear"></div>
            </div>

            <div className="dadosCadastroContainer">
                <div className="cadastroDados"><h1>Nome</h1><h2>UsuarioTest</h2></div>
                <div className="cadastroDados"><h1>Endereço de Email</h1><h2>Usuariotest43@gmail.com</h2></div>
                <div className="cadastroDados"><h1>Senha</h1><h2>********</h2></div>
            </div>
            
            <Footer/>
        </main>
    ) : null;
}

export default ProfilePage;