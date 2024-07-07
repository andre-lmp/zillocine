import '../../../shared-styles/App.css';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { LuSearch } from "react-icons/lu";
import { FaUserLarge } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { TbMovie } from "react-icons/tb";
import { BiMoviePlay } from "react-icons/bi";
import { useParams } from 'react-router-dom';

function Header(props) {
  
  const [authorized, setAuthorized] = useState(false);
  const scrolled = useRef(undefined);
  const overlayRef = useRef(undefined);
  const navigate = useNavigate();
  const navLinks = useRef([]);
  const navBar = useRef(undefined);
  const indicatorBar = useRef(undefined);
  const currentPage = useParams();

  const handleNavigationLinks = (e) => {
    navigate(`/${e}`)
  };

  const animationBar = (elements) => {
    for (let index = 0; index < elements.length; index++) {
      elements[index].addEventListener('click', () => {
        const navCords = navBar.current.getBoundingClientRect();
        const linkCords = elements[index].getBoundingClientRect();
        indicatorBar.current.style.left = `${linkCords.left - navCords.left}px`;
        indicatorBar.current.style.width = `${elements[index].offsetWidth}px`;
      });
    }
  };

  const startLinksBar = (navLinksRef) => {
    const page = Object.values(currentPage)[0];
    const navCords = navBar.current.getBoundingClientRect();
    for (let index = 0; index < navLinksRef.length; index++) {
      page === navLinksRef[index].id && (
        indicatorBar.current.style.left = `${navLinksRef[index].getBoundingClientRect().left - navCords.left}px`,
        indicatorBar.current.style.width = `${navLinksRef[index].offsetWidth}px`
      )
    }
  };

  useEffect(() => {

    const callAnimation = () => {
      navLinks.current.length > 0 && indicatorBar.current && navBar.current ? (
        animationBar(navLinks.current),
        startLinksBar(navLinks.current)
      ) : (
        setTimeout(() => {
          callAnimation();
        }, 100)  
      )  
    };

    callAnimation();
    setAuthorized(true);

  },[]);

  useEffect(() => {
    const page = Object.values(currentPage)[0];
    const paths = ['Series', 'Movies', 'Search', ''];
    const insideSpecialRoutes = () => {
      for (let index in paths) {
        if (paths[index] === page) {
          return true;
        }
      }

      return false;
    };

    if (!insideSpecialRoutes()) {
      if (indicatorBar.current) {
        indicatorBar.current.style.width = '0px';
      }
    }
  },[Object.values(currentPage)[0]]);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50){
        scrolled.current.style.backgroundColor = 'rgb(0, 0, 0, 0.9)';
        scrolled.current.style.backdropFilter = 'blur(10px);'
    }else{
      scrolled.current.style.backgroundColor = 'transparent';
      scrolled.current.style.backdropFilter = 'none;'
    }
  });
  
  return authorized ? (
    <header>
      <div ref={overlayRef} className="overlayDiv"></div>
          <nav ref={scrolled} className="navbar">
             
              <div onClick={() => {props.menuIsActive(true)}} className="menu-icon">
                <div className=""></div>
                <div className=""></div>
                <div className=""></div>
              </div>

              <div className="project-title">
                <h1>
                  <span>Zillo</span>
                  <span>Cine</span>
                </h1>
              </div>

              <ul ref={navBar} className='nav-links'>
                <li id='' ref={(e) => {navLinks.current[0] = e}} onClick={() => {handleNavigationLinks('')}}>
                  <FiHome className="link-icons home-icon"/>
                  Inicio
                </li>
                <li id='Movies' ref={(e) => {navLinks.current[1] = e}} onClick={() => {handleNavigationLinks('Movies')}}>
                  <TbMovie className="link-icons"/>
                  Filmes
                </li>
                <li id='Series' ref={(e) => {navLinks.current[2] = e}} onClick={() => {handleNavigationLinks('Series')}}>
                  <BiMoviePlay className="link-icons"/>
                  Series
                </li>
                <li id='Search' ref={(e) => {navLinks.current[3] = e}} onClick={() => {handleNavigationLinks('Search')}}>
                  <LuSearch className='lupa-icon'/>
                </li>

                <div ref={indicatorBar} className='bar-indecator'></div>
              </ul>

              <div className='links user-links'>
                <button className="icon-conta" onClick={() => {handleNavigationLinks('Profile')}}>
                  <FaUserLarge onClick={() => {handleNavigationLinks('Profile')}} className="user-icon"/>
                </button>
                <h3 id="Auth" onClick={() => {handleNavigationLinks('Auth')}}>Entrar</h3>
              </div>
              
            </nav>
    </header>
  ) : null;
}


export default Header;