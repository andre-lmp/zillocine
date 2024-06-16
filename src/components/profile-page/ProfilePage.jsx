import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css';
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
                    <div className="profile-data">
                        <div className="user-icon-box">
                            <FaUserCircle className="user-icon"/>
                            <HiOutlinePencilSquare className="pencil-icon"/>
                        </div>
                        <section className="user-info">
                            <div className="data-item">
                                <h1>Nome de Usuario</h1>
                                <h2>
                                    {userData.userData.name}
                                    <HiOutlinePencilSquare className="pencil-icon"/>
                                </h2>
                            </div>
                            <div className="data-item">
                                <h1>Email</h1>
                                <h2>
                                    {userData.userData.email}
                                    <HiOutlinePencilSquare className="pencil-icon"/>
                                </h2>
                            </div>
                            <div className="data-item">
                                <h1>Senha</h1
                                ><h2>
                                    {userData.userData.password}
                                    <HiOutlinePencilSquare className="pencil-icon"/>
                                </h2>
                            </div>
                        </section>
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