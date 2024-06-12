import { useState, useEffect } from "react";
import './Profile.css';
import { FaUserCircle } from "react-icons/fa";
import { HiOutlinePencilSquare } from "react-icons/hi2";

function ProfilePage({userData}) {
    const [autorizado, setAutorizado] = useState(false);

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
                </section>
                )
            }
                    
        </section>
    
    ) : null;
}

export default ProfilePage;