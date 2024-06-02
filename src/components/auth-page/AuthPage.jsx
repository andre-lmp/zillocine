import './Auth.css';
import { BsFillKeyFill } from "react-icons/bs";
import { FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { IoEyeSharp } from "react-icons/io5";
import { useRef, useState } from 'react';
import {Swiper, SwiperSlide } from '../app/shared-components/Swiper';

function Auth(){
    const navigate = useNavigate(undefined);
    const passwordinputRef = useRef([]);
    const [isVisible, setIsVisible] = useState('invisible');
    const [swiperRef, setSwiperRef] = useState(undefined);

    const handleUserAuthenticated = () => {
        navigate(`/`);
    };

    const handleVisibleEye = (e) => {
        if (e.target.value){
            setIsVisible('eye-visible');
        }else{
            setIsVisible('eye-invisible');
        }
    }

    const breakpoints = {
        0: {
          slidesPerView: 1
        },
    };

    const handleSwiperControl = () => {
        if (swiperRef){
            swiperRef.slideNext();
        }
    };

    const handleVisiblePassword = (index) => {
       if (passwordinputRef.current[index]){
        if (passwordinputRef.current[index].type === 'password'){
            passwordinputRef.current[index].type = 'text';
        }else{
            passwordinputRef.current[index].type = 'password';
        }
       }
    };

    return(
        <section className="auth-page">            
            <section className='auth-container'>
                <Swiper breakpoints={breakpoints} allowTouchMove={false} loop={true} className='forms-swiper' swiperRef={setSwiperRef}>
                    <SwiperSlide>
                        <section className='slide-container'>
                            <div className='form-container'>
                                <h1>ZilloCine</h1>
                                <form onSubmit={() => {handleUserAuthenticated()}}>
                                    <div className='input-container'>
                                        <label htmlFor="name">Nome</label>
                                        <div className='input-icons-box'>
                                            <FaUser className='input-icons'/>
                                            <input type="text" id="name"  placeholder='Criar nome de usuario' required/>
                                        </div>
                                    </div>
                                    <div className='input-container'>
                                        <label htmlFor="sign-up-email">Email</label>
                                        <div className='input-icons-box'>
                                            <MdEmail className='input-icons'/>
                                            <input type="email"  id="sign-up-email" placeholder='Email de login' required/>
                                        </div>
                                    </div>
                                    <div className='input-container'>
                                        <label htmlFor="sign-up-password">Senha</label>
                                        <div className='input-icons-box'>
                                            <BsFillKeyFill className='input-icons'/>
                                            <input ref={(e) => {passwordinputRef.current[0] = e}} type="password" id="sign-up-password" placeholder='Criar senha' onChange={(e) => {handleVisibleEye(e)}} required/>
                                            <IoEyeSharp className={`eye-icon ${isVisible}`} onClick={() => {handleVisiblePassword(0)}}/>
                                        </div>
                                    </div>
                                    <div className='input-container checkbox-container'>
                                        <div className='check-box'>
                                            <label htmlFor="check">Concordar com os <span>Termos e Serviços</span></label>
                                            <input type="checkbox" name="check" id="check" required/>
                                        </div>
                                    </div>
                            
                                    <button type='submit'>Cadastrar</button>
                                    <div className='account-exist'>
                                            <h2 onClick={() => {handleSwiperControl()}}>Já tem uma conta? <span>Entrar</span></h2>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </SwiperSlide>

                    <SwiperSlide>
                        <section className='slide-container'>
                            <div className='form-container'>
                                <h1>ZilloCine</h1>
                                <form onSubmit={() => {handleUserAuthenticated()}}>
                                    
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
                                            <input ref={(e) => {passwordinputRef.current[1] = e}} type="password" id="password" placeholder='Senha de acesso' onChange={(e) => {handleVisibleEye(e)}} required/>
                                            <IoEyeSharp className={`eye-icon ${isVisible}`} onClick={() => {handleVisiblePassword(1)}}/>
                                        </div>
                                    </div>

                                    <div className='input-container forgot-password'>
                                        <h2>Esqueceu a senha? <span>Recuperar</span></h2>
                                    </div>
                            
                                    <button type='submit'>Entrar</button>
                                    <div className='account-exist'>
                                            <h2 onClick={() => {handleSwiperControl()}}>Ainda não tem conta? <span>Criar</span></h2>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </SwiperSlide>
                </Swiper>
            </section>
        </section>
    );
};

export default Auth;