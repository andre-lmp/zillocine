// Hooks
import { useContext } from "react";

// Inicializador do Firebase
import { initializeApp, FirebaseError } from "firebase/app";

// Ferramentas para interação com o Firebase Realtime Database
import { getDatabase, set, ref as getDatabaseRef, get, remove } from "firebase/database";

import { getDownloadURL, uploadBytes, getStorage, ref as getStorageRef, deleteObject, getMetadata } from "firebase/storage";

// Ferramentas para interação com o Firebase Authentication
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, onAuthStateChanged, deleteUser, signOut, updateProfile, verifyBeforeUpdateEmail, User as UserInterface, fetchSignInMethodsForEmail } from "firebase/auth";

// Contextos
import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";
import { UserDataContext } from "@/components/contexts/authenticationContext";

import { toast } from "react-toastify";

interface UserDataOnDb {
    name: string | null,
    photoUrl: string | null,
};

const firebaseErrorMessages = {
    "auth/invalid-email": "O endereço de e-mail fornecido é inválido.",
    "auth/weak-password": "A senha é muito fraca. Por favor, escolha uma senha mais forte.",
    "auth/email-already-in-use": "O endereço de e-mail já está em uso por outra conta.",
    "auth/invalid-password": "A senha fornecida está incorreta.",
    "auth/user-disabled": "Esta conta foi desativada.",
    "auth/user-not-found": "Nenhuma conta foi encontrada com este endereço de e-mail.",
    "auth/wrong-password": "A senha fornecida está incorreta.",
    "auth/too-many-requests": "Muitas solicitações foram feitas. Por favor, tente novamente mais tarde.",
    "auth/operation-not-allowed": "Esta operação não é permitida.",
    "auth/requires-recent-login": "É necessário fazer login recentemente para realizar esta ação.",
    "auth/invalid-credential": "As credenciais fornecidas são inválidas.",
    "auth/user-token-expired": "O token do usuário expirou. Por favor, faça login novamente.",
    "auth/network-request-failed": "Falha na solicitação de rede.",
    "auth/popup-blocked": "A janela pop-up foi bloqueada.",
    "auth/cancelled-popup-request": "A solicitação de pop-up foi cancelada.",
    "auth/credential-already-in-use": "As credenciais fornecidas já estão em uso.",
    "auth/invalid-phone-number": "O número de telefone fornecido é inválido.",
    "auth/phone-number-already-exists": "O número de telefone fornecido já está em uso por outra conta.",
    "auth/quota-exceeded": "O limite de cota foi excedido.",
    "auth/invalid-persistence-type": "O tipo de persistência fornecido é inválido.",
    "auth/invalid-dynamic-link-domain": "O domínio do link dinâmico é inválido.",
    "auth/too-many-attempts-try-later": "Muitas tentativas. Por favor, tente novamente mais tarde.",
    "auth/unexpected-response": "Resposta inesperada do servidor.",
    "auth/email-already-exists": "O endereço de e-mail já existe.",
    "auth/reset-password-exceed-limit": "O limite de redefinição de senha foi excedido.",
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

    // Extrai o primeiro e último nome do usuário e atualiza o contexto
    const extractName = async ( name: string | null ): Promise<string | undefined> => {
        if ( !name ) return;

        const extractedWords = name.split(' ');
        let userName;

        if ( extractedWords.length < 3 ) {
            userName = name;
        } else {
            userName = `${extractedWords[0]} ${extractedWords.at(-1)}`;
        };

        // Atualiza o contexto com o nome formatado
        userData.setUserData( prev => ({
            ...prev,
            name: userName
        }));

        return userName;
    };


   // Busca a imagem de perfil do usuário no Firebase Storage
    const getUserImageOnStorage = async ( storageRef: any ): Promise<void> => {
        const user = auth.currentUser;

        if ( user ) {
            try {
                // Obtém a URL de download da imagem de perfil no Storage
                const url = await getDownloadURL( storageRef );

                // Atualiza o perfil do usuário com a nova URL da imagem
                await updateProfile( user, { photoURL: url });

                // Atualiza o contexto com a nova URL da imagem de perfil
                userData.setUserData( prev => ({
                    ...prev,
                    photoUrl: url
                }));

                // Desativa o loading após a operação bem-sucedida
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    isProfilePhotoUpdating: false
                }));

                // Exibe mensagem de sucesso
                toast.success( 'Imagem de perfil atualizada', { 
                    position: 'bottom-right',
                    autoClose: 3000,
                });

            } catch ( error ) {
                throw new Error("Erro ao buscar ou atualizar a imagem de perfil" + error);
            };
        };
    };


    // Manda a imagem de perfil do usuário para o Firebase Storage
    const uploadUserImage = async ( imageFile: File ): Promise<void> => {
        const user = auth.currentUser;

        // Aciona um elemento de loading durante o processo de upload da nova imagem de perfil para o Firebase Storage
        globalEvents.setModalsController( prev => ({
            ...prev,
            isProfilePhotoUpdating: true
        }));

        if (user) {
            const storageRef = getStorageRef( storage, `users/${user.uid}/profilePhoto` );

            try {
                // Faz o upload da imagem para o Firebase Storage
                const snapshot = await uploadBytes( storageRef, imageFile );

                // Busca e atualiza a imagem de perfil no armazenamento
                await getUserImageOnStorage( snapshot.ref );

            } catch ( error ) {
                console.error("Erro ao fazer upload da imagem:", error);

                // Desativa o loading caso ocorra um erro na operação
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    isProfilePhotoUpdating: false
                }));
            };
        };
    };


    onAuthStateChanged(auth, (user) => {
        if ( user ) {
            user.reload().then(() => {
                if ( !userData.isLoggedIn ) {
                    // Atualiza o contexto com os dados do usuario
                    updateUserContext( user );
                    extractName( user.displayName );
                };
            })

        } else {
            if ( userData.isLoggedIn ) {
                resetUserContext();
            };
        };;
    });

    const deleteCurrentUser = async () => {
        const user = auth.currentUser;
    
        if ( user ) {
            try {
                await deleteCurrentUserOnDb( user.uid );
                await deleteCurrentUserOnStorage( user.uid );
                await deleteUser( user );

                toast.success('Conta excluída', {
                    position: 'bottom-right',
                    autoClose: 3000
                });  

            } catch ( error ) {
                console.error( error );

                if ( error instanceof FirebaseError ) {    
                    globalEvents.setModalsController(prev => ({
                        ...prev,
                        isLoginModalActive: !prev.isLoginModalActive,
                        formInstructionsMessage: firebaseErrorMessages[ error.code as keyof typeof firebaseErrorMessages ] || 'Faça login novamente para encerrar a conta.'
                    }));
                } else {
                    toast.error('Não foi possível encerrar sua conta, tente novamente', {
                        position: 'bottom-right',
                        autoClose: 3000
                    });
                };

            };
        };
    };

    const deleteCurrentUserOnDb = async ( userId: string ) => {
        const db = getDatabase( app );
        const userRef = getDatabaseRef( db, `users/${userId}` )

        try {
            await remove( userRef );
        } catch ( error ) {
            console.error('Erro ao deletar dados do usuário no firebase realtime database' + error);
            return false;
        };
    };

    const deleteCurrentUserOnStorage = async ( userId: string ) => {
        const storageRef = getStorageRef( storage, `users/${userId}/profilePhoto` );

        try {
            await deleteObject( storageRef );  
        } catch ( error ) {
            console.error( 'Erro ao deletar dados do usuário no firebase storage' + error );
        } 
    };
    

    const signOutUser = async () => {
        try {
            await signOut( auth );

            toast.success('Conta desconectada', { 
                position: 'bottom-right',
                autoClose: 3000
            });
        } catch ( error ) {
            if ( error instanceof FirebaseError ) {
                console.error( error.message );

                const customErrorMessage = firebaseErrorMessages[ error.code as keyof typeof firebaseErrorMessages ] || 'Não foi possível desconectar sua conta, tente novamente';

                toast.success(`${customErrorMessage}`, { 
                    position: 'bottom-right',
                    autoClose: 3000
                });
            };
        };
    };

    const signInWithGoogle = async ( modalType: string ) => {
        try {
            const user = await signInWithPopup( auth, googleProvider );
            
            if ( user.user ) {
                // Verifica se o usuário já existe no banco de dados
                const userExists = await fetchUserOnDb( user.user.uid );
                
                if ( !userExists ) {
                    // Adiciona o usuário ao banco de dados
                    await addUserToDb( '', user.user.uid );
                }
                
                // Fecha o modal que estiver aberto após o login
                globalEvents.setModalsController(prev => ({
                    ...prev,
                    isLoginModalActive: modalType === 'login' ? !prev.isLoginModalActive : prev.isLoginModalActive,
                    isRegisterModalActive: modalType === 'register' ? !prev.isRegisterModalActive : prev.isRegisterModalActive,
                }));
                
                // Exibe mensagem de boas-vindas ao usuário
                const userName = await extractName( user.user.displayName );
                toast.success(`Bem-vindo ${userName}!`, {
                    position: 'bottom-right',
                    autoClose: 3000
                });
            };
            
        } catch ( error ) {
            if ( error instanceof FirebaseError ) {
                console.error( error.message );
                
                // Atualiza o modal com a mensagem de erro
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    githubAuthErrorMessage: error.message
                }));
            };
        };
    };
   
    const signInWithGithub = async ( modalType: string ) => {
        try {
            const user = await signInWithPopup( auth, githubProvider );
            
            if ( user.user ) {
                // Verifica se o usuário já existe no banco de dados
                const userExists = await fetchUserOnDb( user.user.uid );
                
                if ( !userExists ) {
                    // Adiciona o usuário ao banco de dados
                    await addUserToDb( '', user.user.uid );
                }
                
                // Fecha o modal que estiver aberto após o login
                globalEvents.setModalsController(prev => ({
                    ...prev,
                    isLoginModalActive: modalType === 'login' ? !prev.isLoginModalActive : prev.isLoginModalActive,
                    isRegisterModalActive: modalType === 'register' ? !prev.isRegisterModalActive : prev.isRegisterModalActive,
                }));
                
                // Exibe mensagem de boas-vindas ao usuário
                const userName = await extractName( user.user.displayName );
                toast.success(`Bem-vindo ${userName}!`, {
                    position: 'bottom-right',
                    autoClose: 3000
                });
            };
            
        } catch ( error ) {
            if ( error instanceof FirebaseError ) {
                console.error( error.message );
                
                // Atualiza o modal com a mensagem de erro
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    githubAuthErrorMessage: error.message
                }));
            };
        };
    };
    

    // Adiciona algumas informações extras do usuário como, nome e id no Realtime DB
    const addUserToDb = async ( userEmail: string, userId: string ): Promise<void> => {
        const db = getDatabase( app );
        const userRef = getDatabaseRef( db, `users/${userId}` );

        try {
            // Adiciona os dados do usuário ao Realtime DB
            await set( userRef, {
                email: userEmail
            });

        } catch ( error ) {
            throw new Error("Erro ao adicionar usuário ao banco de dados" + error);
        };
    };


    const registerUser = async ( name: string, email: string, password: string ) => {
        // Controla uma animação de carregamento
        globalEvents.setModalsController( prev => ({
            ...prev,
            isUserCreatingAnAccount: true
        }));

        try {
            // Cria o usuário
            const response = await createUserWithEmailAndPassword( auth, email, password );
            
            if ( response && auth.currentUser ) {
                // Atualiza o nome de usuário
                await updateProfile( auth.currentUser, { displayName: name });

                // Verifica se o usuário já existe no banco de dados
                const userExists = await fetchUserOnDb( auth.currentUser.uid );
                
                if ( !userExists ) {
                    // Adiciona o usuário ao banco de dados
                    await addUserToDb( email, auth.currentUser.uid );
                };
        
                // Atualiza o contexto com os dados do usuário
                updateUserContext( auth.currentUser );
                
                // Exibe mensagem de boas-vindas
                const userName = await extractName( auth.currentUser?.displayName ?? name );
                toast.success( `Parabéns ${userName}, sua conta foi criada!`, {
                    position: 'bottom-right',
                    autoClose: 3000
                });
                
                // Fecha o modal do formulário de registro
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    isRegisterModalActive: !prev.isRegisterModalActive
                }));

                // Controla uma animação de carregamento
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    isUserCreatingAnAccount: false
                }));

            } else {
                // Atualiza o modal com a mensagem de erro
                globalEvents.setModalsController(prev => ({
                    ...prev,
                    registerErrorMessage: 'Não foi possível criar sua conta, tente novamente'
                }));

                // Controla uma animação de carregamento
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    isUserCreatingAnAccount: false
                }));
            };
        
        } catch ( error ) {
            if ( error instanceof FirebaseError ) {

                if ( error.code !== "auth/network-request-failed" ) {        
                    // Atualiza o modal com a mensagem de erro
                    globalEvents.setModalsController(prev => ({
                        ...prev,
                        registerErrorMessage: firebaseErrorMessages[error.code as keyof typeof firebaseErrorMessages] || 'Não foi possível criar sua conta, tente novamente'
                    }));
                }
            };

            // Controla uma animação de carregamento
            globalEvents.setModalsController( prev => ({
                ...prev,
                isUserCreatingAnAccount: false
            }));
        };
    };

    // Busca informações do usuario no Realtime DB com base no id
    const fetchUserOnDb = async ( userId: string ) => {
        try {
            const db = getDatabase( app );
            const userRef = getDatabaseRef( db, `users/${userId}` );
            const snapshot = await get( userRef );

            if ( snapshot.exists() ) {
                return snapshot.val() as UserDataOnDb;
            }

            return null;
        
        } catch ( error ) {
            throw new Error('Erro ao buscar os dados do usuário' + error );
        };
    };

    const authenticateUser = async ( email: string, password: string, modalType: string ): Promise<void> => {
        // Controla uma animação de carregamento
        globalEvents.setModalsController( prev => ({
            ...prev,
            isUserLoggingIntoAccount: true
        }));

        try {
            // Autentica o usuário com email e senha
            const response = await signInWithEmailAndPassword( auth, email, password );

            if ( response && auth.currentUser ) {
                // Verifica se o usuário já existe no banco de dados
                const userExists = await fetchUserOnDb( auth.currentUser.uid );
                
                if ( !userExists ) {
                    // Adiciona o usuário ao banco de dados
                    await addUserToDb( email, auth.currentUser.uid );
                };

                // Fecha o modal de login ou registro com base no tipo
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    isLoginModalActive: modalType === 'login' ? !prev.isLoginModalActive : prev.isLoginModalActive,
                    isRegisterModalActive: modalType === 'register' ? !prev.isRegisterModalActive : prev.isRegisterModalActive,
                }));
        
                // Exibe mensagem de boas-vindas ao usuário
                const name = await extractName( auth.currentUser.displayName );
                toast.success( `Bem-vindo de volta ${name}!`, {
                    position: 'bottom-right',
                    autoClose: 3000
                });

                // Controla uma animação de carregamento
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    isUserLoggingIntoAccount: false
                }));

            } else {
                // Atualiza o modal com a mensagem de erro
                globalEvents.setModalsController(prev => ({
                    ...prev,
                    loginErrorMessage: 'Não foi possível acessar sua conta, tente novamente'
                }));

                // Controla uma animação de carregamento
                globalEvents.setModalsController( prev => ({
                    ...prev,
                    isUserLoggingIntoAccount: false
                }));
            };;
            
        } catch ( error ) {
            if ( error instanceof FirebaseError ) {
                console.error(error);
    
                if ( error.code !== "auth/network-request-failed" ) {
                    // Lança uma mensagem ao modal para indicar erro na operação
                    globalEvents.setModalsController(prev => ({
                        ...prev,
                        loginErrorMessage: firebaseErrorMessages[error.code as keyof typeof firebaseErrorMessages] || 'Não foi possível acessar sua conta, tente novamente' 
                    }));
                };
            };

            // Controla uma animação de carregamento
            globalEvents.setModalsController( prev => ({
                ...prev,
                isUserLoggingIntoAccount: false
            }));
        };
    };    

    const updateUserData = async ( newEmail: string | null, newName: string | null ): Promise<void> => {
        try {
            // Verifica o novo email do usuário
            if ( newEmail && newEmail !== userData.email ) {
                const results = await fetchSignInMethodsForEmail( auth, newEmail );
                
                if ( results.length > 0 ) {
                    globalEvents.setModalsController( prev => ({
                        ...prev,
                        verificationErrorMessage: 'Já existe uma conta vinculada a este email'
                    }));
                } else {
                    await verifyNewUserEmail( newEmail );
                }
            };
    
            // Verifica o usuário atual para atualização de perfil
            if ( auth.currentUser ) {
                // Atualiza o nome vinculado à conta do usuário
                if ( newName && newName !== auth.currentUser.displayName ) {
                    await updateProfile( auth.currentUser, { displayName: newName });
                    
                    // Atualiza o contexto do usuário com o nome editado
                    if ( auth.currentUser.displayName ) {
                        await extractName( auth.currentUser.displayName );
                        toast.success( 'Nome de usuário alterado', {
                            position: 'bottom-right',
                            autoClose: 3000
                        });
                    };
                };
            };
        } catch ( error ) {
            if ( error instanceof FirebaseError ) {
                console.error( error.message );
            };
        };
    };    

    const verifyNewUserEmail = async ( newEmail: string ) => {
        // const user = auth.currentUser;
    
        // if ( user ) {
        //     try {      
        //         await verifyBeforeUpdateEmail( user, newEmail );
                
        //         // Notifica o usuário sobre o envio do link de verificação
        //         toast.success(`Link de verificação enviado para ${newEmail}`, {
        //             position: 'bottom-right',
        //             autoClose: 3000
        //         });

        //     } catch ( error ) {
        //         if ( error instanceof FirebaseError ) {
        //             console.error(error.message);
    
        //             // Avisa o usuário de que é preciso se autenticar novamente
        //             globalEvents.setModalsController(prev => ({
        //                 ...prev,
        //                 isLoginModalActive: !prev.isLoginModalActive,
        //                 isProfileModalActive: !prev.isProfileModalActive,
        //                 formInstructionsMessage: 'Faça login novamente para solicitar um link de atualização de email'
        //             }));
        //         };
        //     };
        // };
    };

    return {
        authenticateUser,
        registerUser,
        signInWithGoogle,
        signInWithGithub,
        deleteCurrentUser,
        signOutUser,
        uploadUserImage,
        updateUserData,
    }
};