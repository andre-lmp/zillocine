// Hooks
import { useContext } from "react";

// Inicializador do Firebase
import { initializeApp } from "firebase/app";

// Ferramentas para interação com o Realtime DB
import { getDatabase, set, ref, get } from "firebase/database";

// Authenticação com Firebase
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
    auth.useDeviceLanguage();
    const googleProvider = new GoogleAuthProvider()
    const githubProvider = new GithubAuthProvider();



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

    const updateUserProfile = ( newName: string ) => {
        const user = auth.currentUser;

        if ( user ) {
            updateProfile( user, { displayName: newName }).then(() => {
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
            if ( !userData.isLoogedIn || !userData.name ) {
                userData.setUserData(() => ({
                    isLoogedIn: true,
                    name: null,
                    photoUrl: user.photoURL ?? null,
                    email: user.email ?? null,
                    uid: user.uid
                }));

                extractName( user.displayName );
            };

        } else {
            if ( userData.isLoogedIn ) {
                userData.setUserData(() => ({
                    isLoogedIn: false,
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
            set(ref( db, `users/${userId}` ), {
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
        const userRef = ref( db, `users/${userId}` );

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
        signOutUser
    }
};