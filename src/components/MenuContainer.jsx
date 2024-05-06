import { useNavigate } from "react-router-dom";
import { CgClose } from "react-icons/cg";
import { useRef, useState } from "react";

function Menu() {
    const navigate = useNavigate(undefined);
    const [menuActive, setMenuActive] = useState(false);
    const menuRef = useRef(undefined);

    const handleNavigationLinks = (e) => {
        navigate(`/${e.target.id}`)
    };

    const handleChangeMenu = () => {
        if (!menuActive){
          setMenuActive(true);
          if (menuRef.current){
            menuRef.current.style.opacity = '1';
            menuRef.current.style.transform = 'translateX(100%)';
          }
        }else{
          setMenuActive(false);
          if (menuRef.current){
            menuRef.current.style.opacity = '0';
            menuRef.current.style.transform = 'translateX(-100%)';
          }
        }
    };

    return(
        <section ref={menuRef} className="menu-component">
            <nav className="menu-container">
                <ul>
                    <li><button><CgClose className="close-icon"/></button></li>
                    <li><p id="" onClick={handleNavigationLinks}>Inicio</p></li>
                    <li><p id="Filmes" onClick={handleNavigationLinks}>Filmes</p></li>
                    <li><p id="Series" onClick={handleNavigationLinks}>Series</p></li>
                    <li><p>Pesquisar</p></li>
                    <li><p id="Perfil" onClick={handleNavigationLinks}>Conta</p></li>
                </ul>
            </nav>
        </section>
    )
};

export default Menu;