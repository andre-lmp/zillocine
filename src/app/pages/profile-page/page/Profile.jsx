import '../profile-css/Profile.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { SlLogin } from "react-icons/sl";

function ProfilePage({userData}) {
    const [autorizado, setAutorizado] = useState(false);
    const navigate = useNavigate(undefined);

    useEffect(() => {
        setAutorizado(true);
    },[]);

    return autorizado ?(
        <section className="profile-page">  
            {userData.userData ? (      
                <section className="content-container">
                    <div className="user-data">
                        <div className="user-icon-box">
                            <FaUserCircle className="user-icon"/>
                            <HiOutlinePencilSquare className="pencil-icon"/>
                        </div>
                        <section className="user-info">
                            <div className="data-item">
                                <span>Endereço de e-mail</span>
                                <span>
                                    {userData.userData.email}
                                    <HiOutlinePencilSquare className="pencil-icon"/>
                                </span>
                            </div>
                            <div className="data-item">
                                <span>Senha</span>
                                <span>
                                    {userData.userData.password}
                                    <HiOutlinePencilSquare className="pencil-icon"/>
                                </span>
                            </div>
                            <div className="data-item">
                                <span>Nome</span>
                                <span>
                                    {userData.userData.name}
                                    <HiOutlinePencilSquare className="pencil-icon"/>
                                </span>
                            </div>
                        </section>
                    </div>

                    <div className="user-options">

                    </div>
                </section>
                ) : (
                <section className="noLogged-message">
                    <h1>Desculpe, você não possui uma conta</h1>
                    <h2>Navegue até a área de login</h2>
                    <SlLogin onClick={() => {navigate('/Auth')}} className="login-icon"/>
                </section>
                )
            }
                    
        </section>
    
    ) : null;
}

export default ProfilePage;