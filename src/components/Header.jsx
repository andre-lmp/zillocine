import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { LuSearch } from "react-icons/lu";
import { FaUserLarge } from "react-icons/fa6";
import '/src/styles/App.css';

function Header(props) {
  
  const [authorized, setAuthorized] = useState(false);
  const [hideSearchBar, setHideSearchBar] = useState(true);
  const scrolled = useRef(undefined);
  const overlayRef = useRef(undefined);
  const navigate = useNavigate();
  const [displayWidth, setDisplayWidth] = useState(0);

  const handleNavigationLinks = (e) => {
    navigate(`/${e}`)
  };

  useEffect(() => {
    const getDocumentWidth = () => {
      if (window.innerWidth){
        setDisplayWidth(window.innerWidth);
      }else{
        setTimeout(getDocumentWidth, 100);
      }
    };
  
    getDocumentWidth();

    window.addEventListener('resize', getDocumentWidth);


    setAuthorized(true);
  },[]);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100){
        scrolled.current.style.backgroundColor = 'rgb(2, 8, 23)';
    }else{
      scrolled.current.style.backgroundColor = 'transparent';
    }
  });
  
  return authorized ? (
    <header>
      <div ref={overlayRef} className="overlayDiv"></div>
          <div ref={scrolled} className="header-links">
             
              <div onClick={() => {props.menuIsActive(true)}} className="menu-icon">
                <div className=""></div>
                <div className=""></div>
                <div className=""></div>
              </div>

              <div className="project-title">
                <h1>ZilloCine</h1>
              </div>

              <div className="links center-links">
                <a onClick={() => {handleNavigationLinks('')}}>Inicio</a>
                <a  onClick={() => {handleNavigationLinks('Movies')}}>Filmes</a>
                <a  onClick={() => {handleNavigationLinks('Series')}}>Séries</a>
                <LuSearch onClick={() => {handleNavigationLinks('Search')}} className='lupa-icon'/>
              </div>

              <div className='links right-links'>
                <button className="icon-conta" onClick={() => {handleNavigationLinks('Profile')}}>
                  <FaUserLarge onClick={() => {handleNavigationLinks('Profile')}} className="user-icon"/>
                </button>
                <h3 id="Auth" onClick={() => {handleNavigationLinks('Auth')}}>Entrar</h3>
              </div>
              
            </div>
    </header>
  ) : null;
}


export default Header;