import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Search from "/src/components/SearchBar";
import { LuSearch } from "react-icons/lu";
import '/src/styles/App.css';

function Header() {
  
  const [authorized, setAuthorized] = useState(false);
  const [hideSearchBar, setHideSearchBar] = useState(true);
  const scrolled = useRef(undefined);
  const overlayRef = useRef(undefined);
  const navigate = useNavigate();

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50){
      scrolled.current.style.padding = '20px 50px';
      scrolled.current.style.backgroundColor = 'rgb(2, 8, 23)';
    }else{
      scrolled.current.style.backgroundColor = 'transparent';
      scrolled.current.style.padding = '20px 50px 40px 50px';
    }
  });

  const handleNavigationLinks = (e) => {
    navigate(`/${e.target.id}`)
  };

  const HandleHideChange = (newValue) => {
  };


  const handleBarSearch = () => {
    if (hideSearchBar) {
      setHideSearchBar(false);
    };
  };
 
  useEffect(() => {
    setAuthorized(true);
  },[]);
  
  return authorized ? (
    <header>
      <div ref={overlayRef} className="overlayDiv"></div>
          <div ref={scrolled} className="header-links">
            <Search className='search-bar-header' onValueChange={HandleHideChange} hide={hideSearchBar}/>
              <div className="links left-links">
                <button>|||</button>
                <a id="Movies" onClick={handleNavigationLinks}>Filmes</a>
                <a id="Series" onClick={handleNavigationLinks}>Séries</a>
              </div>

              <div className="project-title">
                <h1>MovieZilla</h1>
              </div>

              <div className='links right-links'>
                <LuSearch onClick={handleBarSearch} className='lupa-icon'/>
                <button className="icon-conta" id='Profile' onClick={handleNavigationLinks}>C</button>
                <h3 id="Profile" onClick={handleNavigationLinks}>Conta</h3>
              </div>
              
            </div>
    </header>
  ) : null;
}


export default Header;