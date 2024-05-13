import { useNavigate } from "react-router-dom";
import { CgClose } from "react-icons/cg";
import { useRef, useState, useEffect } from "react";
import '/src/styles/App.css';
import { isAccessor } from "typescript";

function Menu(props) {
    const navigate = useNavigate(undefined);
    const menuRef = useRef(undefined);
    const [menuActive, setMenuActive] = useState(props.isActive);

    const handleNavigationLinks = (e) => {
        navigate(`/${e.target.id}`)
        props.isDisable(false);
    };

    const closeMenu = () => {
      props.isDisable(false);
    }

    useEffect(() => {
      const handleActiveMenu = () => {
        if (props.isActive){
          menuRef.current.style.transform = 'translateX(0%)';
        }else{
          menuRef.current.style.transform = 'translateX(-100%)';
        }
      };

      handleActiveMenu();
    },[props.isActive]);

    return(
        <section ref={menuRef} className="menu-component">
            <nav className="menu-container">
                <ul>
                    <li><button><CgClose onClick={closeMenu} className="close-icon"/></button></li>
                    <li><p id="" onClick={handleNavigationLinks}>Inicio</p></li>
                    <li><p id="Movies" onClick={handleNavigationLinks}>Filmes</p></li>
                    <li><p id="Series" onClick={handleNavigationLinks}>Series</p></li>
                    <li><p>Pesquisar</p></li>
                    <li><p id="Profile" onClick={handleNavigationLinks}>Conta</p></li>
                </ul>
            </nav>
        </section>
    )
};

export default Menu;