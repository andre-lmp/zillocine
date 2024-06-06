import '../shared-styles/App.css';
import { useNavigate } from "react-router-dom";
import { CgClose } from "react-icons/cg";
import { useRef, useEffect } from "react";
import { FiHome } from "react-icons/fi";
import { TbMovie } from "react-icons/tb";
import { BiMoviePlay } from "react-icons/bi";
import { LuSearch } from 'react-icons/lu';
import { FaUserLarge } from 'react-icons/fa6';

function Menu(props) {
    const navigate = useNavigate(undefined);
    const menuRef = useRef(undefined);

    const handleNavigationLinks = (e) => {
        navigate(`/${e}`)
        props.isDisable(false);
    };

    const closeMenu = () => {
      props.isDisable(false);
    }

    useEffect(() => {
      const handleActiveMenu = () => {
        const children = menuRef.current.childNodes;
        if (props.isActive){
          menuRef.current.style.zIndex = '155';
          menuRef.current.style.backdropFilter = 'blur(10px)';
          children[0].style.transform = 'translateX(0%)';
        }else{
          children[0].style.transform = 'translateX(-100%)';
          menuRef.current.style.backdropFilter = 'blur(0px)';
          setTimeout(() => {
            menuRef.current.style.zIndex = '-15';
          }, 220);
        }
      };

      handleActiveMenu();
    },[props.isActive]);

    return(
        <section ref={menuRef} className="menu-component">
            <nav className="menu-container">
                <ul>
                    <li><button><CgClose onClick={closeMenu} className="close-icon"/></button></li>
                    
                    <li><p onClick={() => {handleNavigationLinks('')}}>
                      <FiHome className='link-icons menu-icons'/>
                      Inicio
                    </p></li>
                    
                    <li><p onClick={() => {handleNavigationLinks('Movies')}}>
                      <TbMovie className='link-icons menu-icons'/>
                      Filmes
                    </p></li>
                    
                    <li><p onClick={() => {handleNavigationLinks('Series')}}>
                      <BiMoviePlay className='link-icons menu-icons'/>
                      Series
                    </p></li>
                   
                    <li><p onClick={() => {handleNavigationLinks('Search')}}>
                      <LuSearch className='link-icons menu-icons'/>
                      Pesquisar
                    </p></li>
                    
                    <li><p onClick={() => {handleNavigationLinks('Profile')}}>
                      <FaUserLarge className='link-icons user-icon menu-icons'/>
                      Conta
                    </p></li>
                    
                    <li></li>
                    <li><p onClick={() => {handleNavigationLinks('Auth')}}>Entrar</p></li>
                </ul>
            </nav>
        </section>
    )
};

export default Menu;