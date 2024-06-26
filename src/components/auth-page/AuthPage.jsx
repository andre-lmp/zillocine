import './Auth.css';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, orderByChild, query, equalTo } from 'firebase/database';
import { BsFillKeyFill } from "react-icons/bs";
import { FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { IoEyeSharp } from "react-icons/io5";
import { useRef, useState } from 'react';
import {Swiper, SwiperSlide } from '../app/shared-components/Swiper';

function Auth({isAlertActive, alertMessage, onUserData}){
    const navigate = useNavigate(undefined);
    const [isVisible, setIsVisible] = useState('invisible');
    const [swiperRef, setSwiperRef] = useState(undefined);
    const signUpInputsRef = useRef([]);
    const signInInputsRef = useRef([]);
    const firebaseConfig = {
        apiKey: "AIzaSyD9meOKD4rYE1IOIHdn64hHsjwBSNk8hPU",
        authDomain: "zillocine.firebaseapp.com",
        projectId: "zillocine",
        databaseURL: "https://zillocine-default-rtdb.firebaseio.com",
        storageBucket: "zillocine.appspot.com",
        messagingSenderId: "140852043533",
        appId: "1:140852043533:web:a9e4b0d95a7cbd7cd69a44",
        measurementId: "G-X9CPNRWFDT"
    };
    const app = initializeApp(firebaseConfig);

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

    const handleVisiblePassword = (formType) => {
       if (formType === 'sign-in'){
            if (signInInputsRef.current){
                if (signInInputsRef.current[1].type === 'password'){
                    signInInputsRef.current[1].type = 'text';
                }
                else{
                    signInInputsRef.current[1].type = 'password';
                }
            }
       }

       else{
            if (formType === 'sign-up'){
                if (signUpInputsRef.current){
                    if (signUpInputsRef.current[2].type === 'password'){
                        signUpInputsRef.current[2].type = 'text';
                    }
                    else{
                        signUpInputsRef.current[2].type = 'password';
                    }
                }
            }
       }
    };

    const checkExistUser = async (inputsValue) => {
        const userCredentials = {
            email: inputsValue[0].value.toLowerCase(),
            password: inputsValue[1].value
        };
           
        try{
            const response = await findAccountByemail(userCredentials.email);
            if (response){
                const userData = Object.values(response);
                if (userCredentials.email === userData[0].email && userCredentials.password === userData[0].password){
                    navigate('/');
                    onUserData(userData[0]);
                }else{
                    alertMessage('Email ou senha incorretos');
                    isAlertActive(true);
                }
            }else{
                alertMessage('Email não cadastrado !');
                isAlertActive(true);
            }
        }catch (error){
            undefined
        }
    };

    const findAccountByemail = async (userEmail) => {
        let response = false;
        const db = getDatabase(app);
        const userRef = ref(db, 'users');
        const queryDB = query(userRef, orderByChild('email'), equalTo(userEmail));
        await new Promise((resolve, reject) => {
            onValue(queryDB, (snapshot) => {
                if (snapshot.val()){
                    response = snapshot.val();
                }
                resolve();
            }, (error) => {
                console.error(error);
                reject(error);
            });
        });

        return response;
    };

    const addToDatabase = async (inputsValue) => {
        const db = getDatabase(app);
        const userRef = ref(db, 'users');
        const userID = push(userRef).key;

        const userCredentials = {
            name: inputsValue[0]?.value || '',
            email: inputsValue[1]?.value?.toLowerCase() || '',
            password: inputsValue[2]?.value || ''
        }

        try{
            const response = await findAccountByemail(userCredentials.email);
            if (!response){
                set(ref(db, `users/${userID}`) , userCredentials).then(() => {
                    onUserData(userCredentials);
                    navigate('/');
                });
            }else{
                alertMessage('Email ja cadastrado !');
                isAlertActive(true);
            }
        }catch (error){
            undefined
        }
    };

    return(
        <section className="auth-page">            
            <section className='auth-container'>
                <Swiper breakpoints={breakpoints} allowTouchMove={false} loop={true} className='forms-swiper' swiperRef={setSwiperRef}>
                    <SwiperSlide>
                        <section className='slide-container'>
                            <div className='form-container'>
                                <h1>Cadastro</h1>
                                <form onSubmit={(e) => {e.preventDefault() ; addToDatabase(signUpInputsRef.current)}}>
                                    <div className='input-container'>
                                        <label htmlFor="name">Nome</label>
                                        <div className='input-icons-box'>
                                            <FaUser className='input-icons'/>
                                            <input ref={(e) => {signUpInputsRef.current[0] = e}} type="text" id="name"  placeholder='Criar nome de usuario' required/>
                                        </div>
                                    </div>
                                    <div className='input-container'>
                                        <label htmlFor="sign-up-email">Email</label>
                                        <div className='input-icons-box'>
                                            <MdEmail className='input-icons'/>
                                            <input ref={(e) => {signUpInputsRef.current[1] = e}} type="email"  id="sign-up-email" placeholder='Email de login' required/>
                                        </div>
                                    </div>
                                    <div className='input-container'>
                                        <label htmlFor="sign-up-password">Senha</label>
                                        <div className='input-icons-box'>
                                            <BsFillKeyFill className='input-icons'/>
                                            <input ref={(e) => {signUpInputsRef.current[2] = e}} type="password" id="sign-up-password" placeholder='Criar senha' onChange={(e) => {handleVisibleEye(e)}} required/>
                                            <IoEyeSharp className={`eye-icon ${isVisible}`} onClick={() => {handleVisiblePassword('sign-up')}}/>
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
                                <h1>Entrar</h1>
                                <form onSubmit={(e) => {e.preventDefault() ; checkExistUser(signInInputsRef.current)}}>
                                    
                                    <div className='input-container'>
                                        <label htmlFor="email">Email</label>
                                        <div className='input-icons-box'>
                                            <MdEmail className='input-icons'/>
                                            <input ref={(e) => {signInInputsRef.current[0] = e}} type="email"  id="email" placeholder='Email de login' required/>
                                        </div>
                                    </div>

                                    <div className='input-container'>
                                        <label htmlFor="password">Senha</label>
                                        <div className='input-icons-box'>
                                            <BsFillKeyFill className='input-icons'/>
                                            <input ref={(e) => {signInInputsRef.current[1] = e}} type="password" id="password" placeholder='Senha de acesso' onChange={(e) => {handleVisibleEye(e)}} required/>
                                            <IoEyeSharp className={`eye-icon ${isVisible}`} onClick={() => {handleVisiblePassword('sign-in')}}/>
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