// Hooks
import { useContext } from "react";

// Inicializador do Firebase
import { initializeApp } from "firebase/app";

// Ferramentas para interação com o Firebase Realtime Database
import { getDatabase, set, ref as getDatabaseRef, get } from "firebase/database";

import { getDownloadURL, uploadBytes, getStorage } from "firebase/storage";
import { ref as getStorageRef } from "firebase/storage";

// Ferramentas para interação com o Firebase Authentication
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, onAuthStateChanged, deleteUser, signOut, updateProfile } from "firebase/auth";

// Contextos
import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";
import { UserDataContext } from "@/components/contexts/authenticationContext";

interface UserDataOnDb {
    name: string | null,
    photoUrl: string | null,
};

export default function useFirebase() {

    const userData = useContext( UserDataContext );
    const globalEvents = useContext( GlobalEventsContext );

    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
    };

    const app = initializeApp( firebaseConfig );
    const auth = getAuth();
    const storage = getStorage( app );
    const googleProvider = new GoogleAuthProvider()
    const githubProvider = new GithubAuthProvider();

    auth.useDeviceLanguage();



    // Extrai o primeiro e ultimo nome de usuario e atualiza o contexto
    const extractName = ( name: string | null ) => {
        const extractedWords = name?.split(' ');

        if ( extractedWords ) {
            if ( extractedWords.length < 3 ) {
                userData.setUserData( prev => ({
                    ...prev,
                    name: name
                }));

                return
            };

            const userName = [extractedWords[0], extractedWords.at(-1)].join(' ');
            userData.setUserData( prev => ({
                ...prev,
                name: userName
            }));
        };
    };

    // Busca a imagem de perfil do usuario no Firebase Storage
    const getUserImageOnStorage = ( storageRef: any ) => {

        const user = auth.currentUser;

        if ( user ) {
            getDownloadURL( storageRef ).then( url => {
                // Atualiza a url da imagem de perfil do usuario
                updateProfile( user, { photoURL: url } ).then(() => {
                    // Atualiza o contexto com a 'url' da nova imagem de perfil
                    userData.setUserData( prev => ({
                        ...prev,
                        photoUrl: url
                    }));

                    // Desativa o loading apos o sucesso da operação
                    globalEvents.setModalsController( prev => ({
                        ...prev,
                        isProfilePhotoUpdating: false
                    }));
                }).catch( error => {
                    console.error( error.message );

                    // Desativa o loading caso ocorra erros na operação
                    globalEvents.setModalsController( prev => ({
                        ...prev,
                        isProfilePhotoUpdating: false
                    }));
                });

            }).catch( error => {
                console.error( error.message );

                // Desativa o loading caso ocorra erros na operação
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    isProfilePhotoUpdating: false
                }));
            })
        }
    
    };

    // Manda a imagem de perfil do usuario para o Firebase Storage
    const uploadUserImage = ( imageFile: File ) => {
        const user = auth.currentUser;

        // Aciona um elemento de loading durante o processo de upload da nova imgem de perfil para o Firebase Storage
        globalEvents.setModalsController( prev => ({
            ...prev,
            isProfilePhotoUpdating: true
        }));

        if ( user ) {
            const storageRef = getStorageRef( storage, `users/${user.uid}/profilePhoto` );

            uploadBytes( storageRef, imageFile ).then(( snapshot ) => {
                getUserImageOnStorage( snapshot.ref );
            }).catch( error => {
                console.error( error.message );

                // Desativa o loading caso ocorra erros na operação
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    isProfilePhotoUpdating: false
                }));
            });
        };

    };

    const updateUserProfile = ( newName: string | null = null, newPhoto: string | null = null ) => {
        const user = auth.currentUser;

        if ( user ) {
            const newUserData = {
                displayName: newName ? newName : user.displayName,
                photoUrl: newPhoto ? newPhoto : user.photoURL
            };

            updateProfile( user, newUserData).then(() => {
                // Fecha o modal de registro apos a alteração do nome do usuario
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    isRegisterModalActive: !prev.isRegisterModalActive
                }));

            }).catch( error => {
                console.error( error.message );
            });            
        }
    };

    onAuthStateChanged(auth, (user) => {
        if ( user ) {
            // Atualiza o contexto com os dados do usuario
            if ( !userData.isLoggedIn ) {
                userData.setUserData( prev => ({
                    ...prev,
                    isLoggedIn: true,
                    photoUrl: user.photoURL,
                    email: user.email,
                    uid: user.uid
                }));

                extractName( user.displayName );
            };

        } else {
            if ( userData.isLoggedIn ) {
                userData.setUserData(() => ({
                    isLoggedIn: false,
                    name: null,
                    photoUrl: null,
                    email: null,
                    uid: null
                }));
            };
        };;
    });

    const deleteCurrrentUser = () => {
        const user = auth.currentUser;

        if ( user ) {
            deleteUser( user ).then(() => {
            }).catch(( error ) => {
                console.error( error );
                
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    isLoginModalActive: !prev.isLoginModalActive,
                    formInstructionsMessage: 'Faça login novamente para encerrar a conta.'
                }));
            });
        };
    };

    const signOutUser = () => {
        signOut( auth ).then(() => {
        }).catch( error => {
            console.error( error );
        });
    };

    const signInWithGoogle = ( modalType: string ) => {
        signInWithPopup( auth, googleProvider ).then(() => {
            // Fecha o modal que estiver aberto apos o login
            globalEvents.setModalsController( prev => ({
                ...prev,
                isLoginModalActive: modalType === 'login' ? !prev.isLoginModalActive : prev.isLoginModalActive,
                isRegisterModalActive: modalType === 'register' ? !prev.isRegisterModalActive : prev.isRegisterModalActive,
            }));
        }).catch( error => {
            console.error( error );

            // Lança uma mensagem de erro ao modal para indicar que houve um erro com a operação
            globalEvents.setModalsController( prev => ({
                ...prev,
                googleAuthErrorMessage: error.message
            }))
        });
    };


    const signInWithGithub = ( modalType: string ) => {
        signInWithPopup( auth, githubProvider ).then(() => {
            // Fecha o modal que estiver aberto apos o login
            globalEvents.setModalsController( prev => ({
                ...prev,
                isLoginModalActive: modalType === 'login' ? !prev.isLoginModalActive : prev.isLoginModalActive,
                isRegisterModalActive: modalType === 'register' ? !prev.isRegisterModalActive : prev.isRegisterModalActive,
            }));
        }).catch( error => {
            console.error( error );

            // Lança uma mensagem de erro ao modal para indicar que houve um erro com a operação
            globalEvents.setModalsController( prev => ({
                ...prev,
                githubAuthErrorMessage: error.message
            }))
        });
    };

    // Adiciona algumas informações extras do usuario como, nome e id no Realtime DB
    const addUserToDb = ( userName: string, userId: string ) => {
        const db = getDatabase(app);

        return new Promise( resolve  => {
            set(getDatabaseRef( db, `users/${userId}` ), {
                name: userName,
                photo: ''
            }).then(() => {
                resolve( null );
            });
        })
    };

    const registerUser = ( name: string, email: string, password: string ) => {
        createUserWithEmailAndPassword( auth, email, password ).then(() => {
            updateUserProfile( name );
        }).catch( error => {
            console.error( error.message );

            // Lança uma mensagem de erro ao modal para indicar que houve um erro com a operação
            globalEvents.setModalsController( prev => ({
                ...prev,
                registerErrorMessage: error.message
            }))
        });
    };
        

    // Busca informações do usuario no Realtime DB com base no id
    const fetchUserOnDb = async ( userId: string ): Promise<UserDataOnDb> => {
        const db = getDatabase( app );
        const userRef = getDatabaseRef( db, `users/${userId}` );

        return new Promise(( resolve, reject ) => {
            get( userRef ).then(( snapshot ) => {
                if ( snapshot.exists() ) {
                    const response = snapshot.val();
                    resolve( response );
                } else {
                    reject( null )
                }
            })
        })
    };

    const authenticateUser = async ( email: string, password: string, modalType: string ) => {
        signInWithEmailAndPassword( auth, email, password ).then(() => {
            // Fecha o modal que estiver aberto apos o login ou registro
            globalEvents.setModalsController( prev => ({
                ...prev,
                isLoginModalActive: modalType === 'login' ? !prev.isLoginModalActive : prev.isLoginModalActive,
                isRegisterModalActive: modalType === 'register' ? !prev.isRegisterModalActive : prev.isRegisterModalActive,
            }));
        }).catch( error => {
            console.error( error );

            // Lança uma mensagem ao modal para indicar que houve um erro com a operação
            globalEvents.setModalsController( prev => ({
                ...prev,
                loginErrorMessage: error.message
            }))
        });
    };

    return {
        authenticateUser,
        registerUser,
        signInWithGoogle,
        signInWithGithub,
        deleteCurrrentUser,
        signOutUser,
        uploadUserImage
    }
};