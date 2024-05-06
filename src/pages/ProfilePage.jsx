import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import BackgroundProfile from '/src/images/BackgroundProfile.png';
import Footer from '/src/components/footer';
import '/src/styles/Profile.css';

function ProfilePage() {
    const [autorizado, setAutorizado] = useState(false);

    useEffect(() => {
        setAutorizado(true);
    },[]);

    return autorizado ?(
        <main className="profile-page">
            <div className="background-container">
                <div className="background-image-container">
                    <img src={BackgroundProfile} alt="Background"/>
                </div>
                <div className="base-profile">
                    <div className="profile-image">
                        <FontAwesomeIcon id='userIcon' icon={faUser}/>
                    </div>
                </div>
                <div className="profile-linear"></div>
            </div>
        
            <div className="data-container">
                <div className="data-item"><h1>Nome</h1><h2>UsuarioTest</h2></div>
                <div className="data-item"><h1>Endereço de Email</h1><h2>Usuariotest43@gmail.com</h2></div>
                <div className="data-item"><h1>Senha</h1><h2>********</h2></div>
            </div>
                    
            <Footer/>
        </main>
    
    ) : null;
}

export default ProfilePage;