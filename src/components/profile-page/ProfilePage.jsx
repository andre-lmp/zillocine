import { useState, useEffect } from "react";
import './Profile.css';
import { FaUserCircle } from "react-icons/fa";
import { HiOutlinePencilSquare } from "react-icons/hi2";

function ProfilePage() {
    const [autorizado, setAutorizado] = useState(false);

    useEffect(() => {
        setAutorizado(true);
    },[]);

    return autorizado ?(
        <section className="profile-page">
        
            <section className="content-container">
                <div className="profile-data">
                    <div className="user-icon-box">
                        <FaUserCircle className="user-icon"/>
                    </div>
                    <section className="user-info">
                        <div className="data-item">
                            <h1>Nome de Usuario</h1>
                            <h2>
                                UsuarioTest
                                <HiOutlinePencilSquare className="pencil-icon"/>
                            </h2>
                        </div>
                        <div className="data-item">
                            <h1>Email</h1>
                            <h2>
                                usuariotest43@gmail.com
                                <HiOutlinePencilSquare className="pencil-icon"/>
                            </h2>
                        </div>
                        <div className="data-item">
                            <h1>Senha</h1
                            ><h2>
                                ********
                                <HiOutlinePencilSquare className="pencil-icon"/>
                            </h2>
                        </div>
                    </section>
                </div>
            </section>
                    
        </section>
    
    ) : null;
}

export default ProfilePage;