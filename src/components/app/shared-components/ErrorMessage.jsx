import { BiSolidMoviePlay } from "react-icons/bi";
import '../shared-styles/App.css';
import { useEffect, useRef } from "react";

export default function Message(props) {
    const componentRef = useRef(undefined);

    useEffect(() => {
        if (componentRef.current){
            if (props.isVisible){
                componentRef.current.style.opacity = '1';
            }else{
                componentRef.current.style.opacity = '0';
            }
        }
    },[props.isVisible]);

    return(
        <section ref={componentRef} className="error-component">
            <BiSolidMoviePlay  className="error-icon"/>
            <h1>Conteudo não disponivel !</h1>
            <p>Parece que algo deu errado... recarregue a pagina.</p>
        </section>
    );
};