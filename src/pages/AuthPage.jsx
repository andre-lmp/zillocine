import '/src/styles/Auth.css';
import { BsFillKeyFill } from "react-icons/bs";
import { FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { IoEyeSharp } from "react-icons/io5";
import { useRef, useState } from 'react';
import posterImg from '/src/images/poster.png';

function Auth(){
    const navigate = useNavigate(undefined);
    const passwordinputRef = useRef(undefined);
    const [isVisible, setIsVisible] = useState('invisible');

    const handleUserAuthenticated = () => {
        navigate(`/`);
    };

    const handleVisiblePassword = () => {
        if (passwordinputRef.current){
            if (passwordinputRef.current.type === 'password'){
                passwordinputRef.current.type = 'text';
            }else{
                passwordinputRef.current.type = 'password';
            }
        }
    };

    const handleVisibleEye = (e) => {
        if (e.target.value){
            setIsVisible('eye-visible');
        }else{
            setIsVisible('eye-invisible');
        }
    }

    return(
        <section className="auth-page">
            <div className='auth-bg-img'><img src={posterImg} alt="" /></div>
            
            <section className='auth-container'>
                <div className='form-container'>
                    <h1>MovieZilla</h1>
                    <form onSubmit={() => {handleUserAuthenticated()}}>
                        <div className='input-container'>
                            <label htmlFor="name">Nome</label>
                            <div className='input-icons-box'>
                                <FaUser className='input-icons'/>
                                <input type="text" id="name"  placeholder='Nome de usuario' required/>
                            </div>
                        </div>
                        <div className='input-container'>
                            <label htmlFor="email">Email</label>
                            <div className='input-icons-box'>
                                <MdEmail className='input-icons'/>
                                <input type="email"  id="email" placeholder='Email de login' required/>
                            </div>
                        </div>
                        <div className='input-container'>
                            <label htmlFor="password">Senha</label>
                            <div className='input-icons-box'>
                                <BsFillKeyFill className='input-icons'/>
                                <input ref={passwordinputRef} type="password" id="password" placeholder='Senha de acesso' onChange={(e) => {handleVisibleEye(e)}} required/>
                                <IoEyeSharp className={`eye-icon ${isVisible}`} onClick={() => {handleVisiblePassword()}}/>
                            </div>
                        </div>
                        <div className='input-container checkbox-container'>
                            <label htmlFor="check">Concordar com os <span>Termos e Serviços</span></label>
                            <input type="checkbox" name="check" id="check" required/>
                        </div>
                        <button type='submit'>Cadastrar</button>
                    </form>
                </div>
            </section>
        </section>
    );
};

export default Auth;