import '../shared-styles/App.css';
import { useRef, useEffect } from 'react';

export default function userAlert({message = 'Mensagem de erro', isActive = false, onValueChange}){
    const alertElementsRef = useRef([]);

    useEffect(() => {
        if (isActive){
            if (alertElementsRef.current){
                alertElementsRef.current[0].style.zIndex = 200;
                alertElementsRef.current[0].style.animation = 'dark .2s linear forwards';
                alertElementsRef.current[1].style.transform = 'translateY(0%)';
                setTimeout(() => {
                    alertElementsRef.current[2].style.animation = 'width 1.5s linear';
                    setTimeout(() => {
                        alertElementsRef.current[1].style.transform = 'translateY(-100%)';
                        alertElementsRef.current[2].style.animation = '';
                        alertElementsRef.current[0].style.animation = '';
                        setTimeout(() => {
                            alertElementsRef.current[0].style.zIndex = -200;
                            onValueChange(false);
                        }, 200);
                    }, 1600);
                }, 250);
            }
        }
    },[isActive]);

    return(
        <section ref={(e) => {alertElementsRef.current[0] = e}} className="user-alert-component">
            <div  ref={(e) => {alertElementsRef.current[1] = e}} className="msg-container">
                <h1>{message}</h1>
                <div ref={(e) => alertElementsRef.current[2] = e} className="loading-bar"></div>
            </div>
        </section>
    );
};