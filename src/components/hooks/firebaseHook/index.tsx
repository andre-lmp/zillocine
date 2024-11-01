// Inicializador do Firebase
import { initializeApp } from "firebase/app";

// Ferramentas para interação com o Realtime DB
import { getDatabase, set, ref, get } from "firebase/database";

// Authenticação com Firebase
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

interface UserDataOnDb {
    name: string | null,
    photoUrl: string | null,
};

export default function useFirebase() {

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
    const googleProvider = new GoogleAuthProvider()
    const githubProvider = new GithubAuthProvider();

    const signInWithGoogle = async (): Promise<UserDataOnDb> => {
        return new Promise(( resolve, reject ) => {
            signInWithPopup( auth, googleProvider ).then( result => {
                const user = {
                    name: result.user.displayName,
                    photoUrl: result.user.photoURL
                };

                resolve( user );
            }).catch( error =>{
                console.error( error );
                reject( null );
            })
        })
    };

    const signInWithGithub = async (): Promise<UserDataOnDb> => {
        return new Promise(( resolve, reject ) => {
            signInWithPopup( auth, githubProvider ).then( result => {
                const user = {
                    name: result.user.displayName,
                    photoUrl: result.user.photoURL
                };
                
                console.log(result.user);
                resolve( user );
            }).catch( error =>{
                console.error( error );
                reject( null );
            })
        })
    };

    // Adiciona algumas informações extras do usuario como, nome e id no Realtime DB
    const addUserToDb = async ( userName: string, userId: string ) => {
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

    const registerUser = async ( name: string, email: string, password: string ) => {
        try {
            const response = await createUserWithEmailAndPassword( auth, email, password );
            if ( response.user ) {
                await addUserToDb( name, response.user.uid );
                return {
                    uid: response.user.uid,
                };
            }
          } catch ( error ) {
              console.error( error );
              return null;
          };
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

    const authenticateUser = async ( email: string, password: string ) => {
        try {
            const signInResponse = await signInWithEmailAndPassword( auth, email, password );
            if ( signInResponse.user ) {
                const fetchResponse = await fetchUserOnDb( signInResponse.user.uid );
                return {
                    uid: signInResponse.user.uid,
                    name: fetchResponse.name,
                    photoUrl: fetchResponse.photoUrl
                };
            };
        } catch ( error ) {
            console.error( error );
            return null
        };
    };

    return {
        authenticateUser,
        registerUser,
        signInWithGoogle,
        signInWithGithub
    }
};