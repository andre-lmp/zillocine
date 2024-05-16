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

  const activeMenu = () => {
    props.menuIsActive(true);
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
    if (window.scrollY > 50){
      if (displayWidth >= 750){
        scrolled.current.style.padding = '20px 40px';
        scrolled.current.style.backgroundColor = 'rgb(2, 8, 23)';
      }else{
        scrolled.current.style.padding = '25px 20px';
        scrolled.current.style.backgroundColor = 'rgb(2, 8, 23)';
      }

    }else{
      scrolled.current.style.backgroundColor = 'transparent';
      if (displayWidth >= 750){
        scrolled.current.style.padding = '20px 40px 40px 40px';
      }else{
        scrolled.current.style.padding = '25px 20px';
      }
    }
  });
  
  return authorized ? (
    <header>
      <div ref={overlayRef} className="overlayDiv"></div>
          <div ref={scrolled} className="header-links">
              <div className="links left-links">
                <button onClick={activeMenu}>|||</button>
                <a  onClick={() => {handleNavigationLinks('Movies')}}>Filmes</a>
                <a  onClick={() => {handleNavigationLinks('Series')}}>Séries</a>
              </div>

              <div className="project-title">
                <h1>MovieZilla</h1>
              </div>

              <div className='links right-links'>
                <LuSearch onClick={() => {handleNavigationLinks('Search')}} className='lupa-icon'/>
                <button className="icon-conta" onClick={() => {handleNavigationLinks('Profile')}}>
                  <FaUserLarge onClick={() => {handleNavigationLinks('Profile')}} className="user-icon"/>
                </button>
                <h3 id="Auth" >Entrar</h3>
              </div>
              
            </div>
    </header>
  ) : null;
}


export default Header;