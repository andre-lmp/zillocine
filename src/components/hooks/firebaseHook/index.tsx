// Hooks
import { useContext, useEffect } from "react";

// Inicializador do Firebase
import { initializeApp, FirebaseError } from "firebase/app";

// Ferramentas para interação com o Firebase Realtime cloud functions;
import { getFunctions, httpsCallable } from "firebase/functions";

// Ferramentas para interação com o Firebase Realtime Database
import { getDatabase, set, ref as getDatabaseRef, get, remove, update, onValue } from "firebase/database";

import { getDownloadURL, uploadBytes, getStorage, ref as getStorageRef, deleteObject } from "firebase/storage";

// Ferramentas para interação com o Firebase Authentication
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, deleteUser, signOut, updateProfile, User as UserInterface, fetchSignInMethodsForEmail } from "firebase/auth";

// Contextos
import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";
import { UserDataContext } from "@/components/contexts/authenticationContext";

import { toast } from "react-toastify";
import { CommentProps, ReplyProps } from "@/components/pages/playerPage/main/commentsSection";

interface UserDataOnDb {
    name: string | null,
    photoUrl: string | null,
};

type RequestData = {
    path: string;
}; 

type ResponseData = {
    sucess: boolean;
    updatedData?: CommentProps;
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
    "auth/requires-recent-login": "Faça login novamente para encerrar sua conta.",
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
    const functions = getFunctions( app );
    const auth = getAuth();
    const storage = getStorage( app );
    const googleProvider = new GoogleAuthProvider()
    const githubProvider = new GithubAuthProvider();
    const interactAndNotify = httpsCallable<RequestData, Response>( functions, 'interactAndNotify' );
    auth.useDeviceLanguage();

    const getCurrentUser = async () => {
        try {
            await auth.authStateReady();
            
            if ( auth.currentUser ) {
                if ( !userData.isLoggedIn || auth.currentUser.uid !== userData.uid ) {
                    updateUserContext( auth.currentUser );
                    getUserFavoritesOnDb();
                };
            };
        } catch (error) {
            console.error( error );   
        };
    };

    // Observa mudanças no estado de authenticação do usuario
    useEffect(() => {
        getCurrentUser();
    }, [])

    const updateUserContext = async ( user: UserInterface ) => {
        try {
            const name = await extractName( user.displayName );
            userData.setUserData( prev => ({
                ...prev,
                isLoggedIn: true,
                name: name,
                photoUrl: user.photoURL,
                email: user.email,
                uid: user.uid
            }));

        } catch (error) {
            console.error( 'Erro ao atualizar o contexto com os dados do usuario' + error );
        }
    };

    const resetUserContext = () => {
        userData.setUserData( prev => ({
            ...prev,
            isLoggedIn: false,
            name: null,
            photoUrl: null,
            email: null,
            uid: null
        }));
    };

    // Extrai o primeiro e último nome do usuário e atualiza o contexto
    const extractName = async ( name: string | null ): Promise<string | null> => {
        if ( !name ) return null;

        const extractedWords = name.split(' ');
        let userName;

        if ( extractedWords.length < 3 ) {
            userName = name;
        } else {
            userName = `${extractedWords[0]} ${extractedWords.at(-1)}`;
        };

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

    const deleteCurrentUser = async () => {
        const user = auth.currentUser;
    
        if ( user ) {
            try {
                await deleteCurrentUserOnDb( user.uid );
                await deleteCurrentUserOnStorage( user.uid );
                await deleteUser( user );

                resetUserContext();

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
                        formInstructionsMessage: firebaseErrorMessages[ error.code as keyof typeof firebaseErrorMessages ] || 'Faça login novamente para encerrar sua conta.'
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

            resetUserContext();

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

                // Atualiza o contexto com os dados do usuário
                updateUserContext( user.user );
                
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

                // Atualiza o contexto com os dados do usuário
                updateUserContext( user.user );
                
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
        const db = getDatabase( app );
        const userRef = getDatabaseRef( db, `users/${userId}` );
        const snapshot = await get( userRef );

        try {
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

                // Atualiza o contexto com os dados do usuário
                updateUserContext( auth.currentUser );

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
    
            // Verifica se o usuario atual esta authenticado
            if ( auth.currentUser ) {
                // Atualiza o nome vinculado à conta do usuário
                if ( newName && newName !== auth.currentUser.displayName ) {
                    await updateProfile( auth.currentUser, { displayName: newName });
                    
                    // Atualiza o contexto do usuário com o nome editado
                    if ( auth.currentUser.displayName ) {
                        const extractedName = await extractName( auth.currentUser.displayName );

                        userData.setUserData( prev => ({
                            ...prev, 
                            name: extractedName
                        }));

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

    const getUserFavoritesOnDb = async () => {
        const db = getDatabase( app );
        const user = auth.currentUser;
        const userRef = getDatabaseRef( db, `users/${user?.uid}` );

        try {
            const snapshot = await get( userRef );
            const userDataOnDb = snapshot.val();

            if ( userDataOnDb ) {
                 userData.setUserData( prev => ({
                    ...prev,
                    favoriteMovies: userDataOnDb.favoriteMovies ?? null
                }));

                userData.setUserData( prev => ({
                    ...prev,
                    favoriteSeries: userDataOnDb.favoriteSeries ?? null
                }));

            };

        } catch (error) {
            console.error( 'Erro ao buscar os favoritos do usuario' + error );
        }
    };

    // Adiciona os filmes/series favoritos do usuario ao banco de dados
    const addUserFavoritesToDb = async ( contentId: string, contentType: string ): Promise<void> => {
        const db = getDatabase( app );
        const user = auth.currentUser;
        const userRef = getDatabaseRef( db, `users/${user?.uid}` );

        try {
            const snapshot = await get( userRef );
            const userDataOnDb = await snapshot.val()

            if ( userDataOnDb ) {
                if ( contentType === 'movie' ) {
                    const updatedData = userDataOnDb.favoriteMovies ? [
                        contentId,
                        ...userDataOnDb.favoriteMovies
                    ] : [contentId]

                    await update( userRef, {
                        favoriteMovies: updatedData
                    });
                };   
    
                if ( contentType === 'serie' ) {
                    const updatedData = userDataOnDb.favoriteSeries ? [
                        contentId, 
                        ...userDataOnDb.favoriteSeries
                    ] : [contentId]

                    await update( userRef, {
                        favoriteSeries: updatedData
                    });
                };

            }; 

            getUserFavoritesOnDb();

        } catch (error) {
            throw new Error( 'Erro ao adicionar item aos favoritos do usuario' + error );
        }
    };

    const deleteUserFavoritesOnDb = async ( contentId: string, contentType: string ): Promise<void> => {
        const db = getDatabase( app );
        const user = auth.currentUser;
        const userRef = getDatabaseRef( db, `users/${user?.uid}` );

        try {
            const snapshot = await get( userRef );
            const userDataOnDb = snapshot.val()

            if ( userDataOnDb ) {
                if ( contentType === 'movie' && userDataOnDb.favoriteMovies ) {
                    const updatedData = userDataOnDb.favoriteMovies.filter(( id: string ) => id !== contentId )
                    await update( userRef, { favoriteMovies: updatedData });
                };   
    
                if ( contentType === 'serie' && userDataOnDb.favoriteSeries ) {
                    const updatedData = userDataOnDb.favoriteSeries.filter(( id: string ) => id !== contentId );
                    await update( userRef, { favoriteSeries: updatedData });
                };   
            };

            getUserFavoritesOnDb();

        } catch (error) {
            throw new Error( 'Erro ao deletar item dos favoritos do usuario' + error );
        }
    };

    const addUserCommentsToDb = async ( commentData: CommentProps, contentId: string ) => {
        const db = getDatabase( app );
        const commentRef = getDatabaseRef( db, `comments/${commentData.id}` );
        const commentIdsListRef = getDatabaseRef( db, `commentIdsList/${contentId}` );

        try {
            await update( commentRef, { comment: commentData });
            const snapshot = await get( commentIdsListRef );
            
            if (snapshot.exists()) {
                const list = snapshot.val();
                await update( commentIdsListRef, { idsList: [...list.idsList, commentData.id]});
            } else {
                await update ( commentIdsListRef, { idsList: [commentData.id] });
            };

            const commentsList = await getCommentsOnDb( contentId );
            return commentsList;

        } catch (error) {
            throw new Error( 'Erro ao adicionar comentario ao banco de dados' + error );
        };
    };

    const getCommentsOnDb = async ( contentId: string ): Promise<any> => {
        const db = getDatabase( app );
        const commentIdsListRef = getDatabaseRef( db, `commentIdsList/${contentId}` );

        try {
            const snapshot = await get( commentIdsListRef );
            if (snapshot.exists()) {
                const list = snapshot.val();
                
                return new Promise(( resolve, reject ) => {
                    try {
                        Promise.all( list.idsList.map( async ( commentId: string ) => {
                            const commentRef = getDatabaseRef( db, `comments/${commentId}` );
                            const commentData = await get( commentRef );
                            return commentData.val().comment;
                        })).then( result => {
                            resolve( result );
                        });
                    } catch (error) {
                        reject( error );
                    };
                });
            } else {
                return;
            };

        } catch (error) {
            console.error( 'Erro ao buscar comentario no banco de dados' + error );
        };
    };

    const getUserReactionOnDb = async ( ...commentsIds: string[] ): Promise<Record<string, any>[]> => {
        const db = getDatabase( app );
        const user = auth.currentUser;
        
        return new Promise(( resolve, reject ) => {
            try {
                Promise.all(commentsIds.map(async ( id ) => {
                    const reactionRef = getDatabaseRef( db, `reactions/${id}/${user?.uid}` );
                    const userReaction = await get( reactionRef );
                    return { 
                        id: id,
                        userReaction: userReaction.exists() ? userReaction.val().reaction : null
                    };
                })).then(( reaction ) => {
                    resolve( reaction );
                });

            } catch (error) {
                reject( error );
            };
        });
    };

    const updateUserReactionOnDb = async ( commentId: string, reaction: string ) => {
        const user = auth.currentUser;
        const db = getDatabase( app );
        const reactionRef = getDatabaseRef( db, `reactions/${commentId}/${user?.uid}` );

        try {
            const snapshot = await get( reactionRef );
            const prevUserReaction = snapshot.val();

            if ( prevUserReaction && prevUserReaction.reaction === reaction ) {
                await update( reactionRef, { reaction: null });
            };

            if (( prevUserReaction && prevUserReaction.reaction !== reaction ) || !prevUserReaction ) {
                await update( reactionRef, { reaction });
            };

            const updatedReaction = (await get( reactionRef )).val();
            const response = await fetch('https://updatereactionscount-6lpci3axsq-uc.a.run.app', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({  commentId, userId: auth.currentUser?.uid })
            });

            if ( response.ok ) {
                const { updatedComment } = await response.json();
                if ( !updatedReaction ) {
                    return [updatedComment, updatedReaction];
                };

                return [updatedComment, updatedReaction.reaction];
            };

        } catch (error) {
            throw new Error( 'Erro ao adicionar reação do usuario ao banco de dados' + error );
        }
    };

    const addUserReplyToDb = async ( replyData: ReplyProps ) => {
        const db = getDatabase( app );
        const commentRef = getDatabaseRef( db, `replies/${replyData.replyingId}/${replyData.id}` );

        try {
            await update( commentRef, { reply: replyData });
            const response = await fetch('https://updaterepliescount-6lpci3axsq-uc.a.run.app', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({  commentId: replyData.replyingId, userId: auth.currentUser?.uid })
            });

            if ( response.ok ) {
                const { updatedComment } = await response.json();
                console.log(updatedComment);
                return updatedComment;
            };

        } catch (error) {
            throw new Error( 'Erro ao adicionar comentario ao banco de dados' + error );
        };
    };

    const getRepliesOnDb = async ( commentId: string ) => {
        const db = getDatabase( app );
        const repliesRef = getDatabaseRef( db, `replies/${commentId}` );

        try {
            const snapshot = await get( repliesRef );
            const repliesList = snapshot.val();
            return repliesList;

        } catch (error) {
            console.error( 'Erro ao buscar respostas no banco de dados' + error );
        }
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
        addUserFavoritesToDb,
        deleteUserFavoritesOnDb,
        addUserCommentsToDb,
        getCommentsOnDb,
        updateUserReactionOnDb,
        getUserReactionOnDb,
        addUserReplyToDb,
        getRepliesOnDb
    }
};