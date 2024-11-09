// Hooks
import { useContext } from "react";

// Inicializador do Firebase
import { initializeApp } from "firebase/app";

// Ferramentas para interação com o Firebase Realtime Database
import { getDatabase, set, ref as getDatabaseRef, get } from "firebase/database";

import { getDownloadURL, uploadBytes, getStorage } from "firebase/storage";
import { ref as getStorageRef } from "firebase/storage";

// Ferramentas para interação com o Firebase Authentication
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, onAuthStateChanged, deleteUser, signOut, updateProfile, updateEmail, verifyBeforeUpdateEmail, User as UserInterface } from "firebase/auth";

// Contextos
import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";
import { UserDataContext } from "@/components/contexts/authenticationContext";

import { toast } from "react-toastify";

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




    const updateUserContext = ( user: UserInterface ) => {
        userData.setUserData( prev => ({
            ...prev,
            isLoggedIn: true,
            photoUrl: user.photoURL,
            email: user.email,
            uid: user.uid
        }));
    };

    const resetUserContext = () => {
        userData.setUserData(() => ({
            isLoggedIn: false,
            name: null,
            photoUrl: null,
            email: null,
            uid: null
        }));
    };

    // Extrai o primeiro e ultimo nome de usuario e atualiza o contexto
    const extractName = async ( name: string | null ) => {
        const extractedWords = name?.split(' ');

        return new Promise(( resolve, reject ) => {
            if ( extractedWords ) {
                if ( extractedWords.length < 3 ) {
                    userData.setUserData( prev => ({
                        ...prev,
                        name: name
                    }));
    
                    resolve( name );
                };
    
                const userName = [extractedWords[0], extractedWords.at(-1)].join(' ');
                userData.setUserData( prev => ({
                    ...prev,
                    name: userName
                }));

                resolve( userName );
            };
        });
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

                    toast.success('Imagem de perfil atualizada', { 
                        position: 'bottom-right',
                        autoClose: 3000,
                     });
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

    onAuthStateChanged(auth, (user) => {
        if ( user ) {
            // Atualiza o contexto com os dados do usuario
            if ( !userData.isLoggedIn ) {
                // Atualiza o contexto com os dados do usuario
                updateUserContext( user );

                extractName( user.displayName );
            };

        } else {
            if ( userData.isLoggedIn ) {
                resetUserContext();
            };
        };;
    });

    const deleteCurrrentUser = () => {
        const user = auth.currentUser;

        if ( user ) {
            deleteUser( user ).then(() => {
                toast.success('Conta excluida', { 
                    position: 'bottom-right',
                    autoClose: 3000
                 });
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
            toast.success('Conta desconectada', { 
                position: 'bottom-right',
                autoClose: 3000
             });
        }).catch( error => {
            console.error( error );
        });
    };

    const signInWithGoogle = ( modalType: string ) => {
        signInWithPopup( auth, googleProvider ).then( user => {
            // Fecha o modal que estiver aberto apos o login
            globalEvents.setModalsController( prev => ({
                ...prev,
                isLoginModalActive: modalType === 'login' ? !prev.isLoginModalActive : prev.isLoginModalActive,
                isRegisterModalActive: modalType === 'register' ? !prev.isRegisterModalActive : prev.isRegisterModalActive,
            }));

            // Mensagem de boas vindas ao usuario
            extractName( user.user.displayName ).then(( name ) => {
                toast.success(`Bem-vindo de volta ${name}!`, {
                    position: 'bottom-right',
                    autoClose: 3000
                });
            })

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
        signInWithPopup( auth, githubProvider ).then( user => {
            // Fecha o modal que estiver aberto apos o login
            globalEvents.setModalsController( prev => ({
                ...prev,
                isLoginModalActive: modalType === 'login' ? !prev.isLoginModalActive : prev.isLoginModalActive,
                isRegisterModalActive: modalType === 'register' ? !prev.isRegisterModalActive : prev.isRegisterModalActive,
            }));

            // Mensagem de boas vindas ao usuario
            extractName( user.user.displayName ).then(( name ) => {
                toast.success(`Bem-vindo de volta ${name}!`, {
                    position: 'bottom-right',
                    autoClose: 3000
                });
            })

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
        // Cria o usuario
        createUserWithEmailAndPassword( auth, email, password ).then(( createdUser ) => {
            // Depois de criado, o nome de usuario e atualizado
            updateProfile( createdUser.user, { displayName: name }).then(() => {
                // Atualiza o contexto com os dados do usuario
                if ( auth.currentUser ) {
                    updateUserContext( auth.currentUser );

                    // Mensagem de boas vindas ao usuario
                    extractName( auth.currentUser.displayName ).then(( name ) => {
                        toast.success(`Parabéns ${name}, sua conta foi criada!`, {
                            position: 'bottom-right',
                            autoClose: 3000
                        });
                    })
                }

                // Fecha o modal do formulario de registro
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    isRegisterModalActive: !prev.isRegisterModalActive
                }));
            });
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
        signInWithEmailAndPassword( auth, email, password ).then(( user ) => {
            // Fecha o modal que estiver aberto apos o login ou registro
            globalEvents.setModalsController( prev => ({
                ...prev,
                isLoginModalActive: modalType === 'login' ? !prev.isLoginModalActive : prev.isLoginModalActive,
                isRegisterModalActive: modalType === 'register' ? !prev.isRegisterModalActive : prev.isRegisterModalActive,
            }));

            // Mensagem de boas vindas ao usuario
            extractName( user.user.displayName ).then(( name ) => {
                toast.success(`Bem-vindo de volta ${name}!`, {
                    position: 'bottom-right',
                    autoClose: 3000
                });
            })
        }).catch( error => {
            console.error( error );

            // Lança uma mensagem ao modal para indicar que houve um erro com a operação
            globalEvents.setModalsController( prev => ({
                ...prev,
                loginErrorMessage: error.message
            }))
        });
    };

    const updateUserData = ( newEmail: string, newName: string ) => {
        // Verifica o novo email do usuario
        newEmail !== userData.email && verifyNewUserEmail( newEmail );

        if ( auth.currentUser ) {
            // Atualiza o nome vinculado a conta do usuario 
            newName !== auth.currentUser.displayName && updateProfile( auth.currentUser, { displayName: newName }).then(() => {
            // Atualiza o contexto do usuario com o nome editado
                auth.currentUser && extractName( auth.currentUser.displayName ).then( name => {
                    toast.success('Nome de usuário alterado', {
                        position: 'bottom-right',
                        autoClose: 3000
                    })
                });
            })
        }
    };

    const verifyNewUserEmail = ( newEmail: string ) => {
        const user = auth.currentUser;

        if ( user ) {
            verifyBeforeUpdateEmail( user, newEmail ).then(() => {
                // Aciona o componente de verificação do novo email
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    IsVerificationLinkSent: true
                }));    
            }).catch( error => {
                console.error( error.message );

                // Avisa o usuario de que e preciso se authenticar novamente
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    isLoginModalActive: !prev.isLoginModalActive,
                    isProfileModalActive: !prev.isProfileModalActive,
                    formInstructionsMessage: 'Faça login novamente para solicitar um link de atualização de email'
                }));
            })
        }
    };

    return {
        authenticateUser,
        registerUser,
        signInWithGoogle,
        signInWithGithub,
        deleteCurrrentUser,
        signOutUser,
        uploadUserImage,
        updateUserData,
    }
};