import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, get } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

interface UserDataOnDb {
    name: string | null,
    photoUrl: string | null,
};

export default function useFirebase() {

    const firebaseConfig = {
        apiKey: "AIzaSyD9meOKD4rYE1IOIHdn64hHsjwBSNk8hPU",
        authDomain: "zillocine.firebaseapp.com",
        databaseURL: "https://zillocine-default-rtdb.firebaseio.com",
        projectId: "zillocine",
        storageBucket: "zillocine.appspot.com",
        messagingSenderId: "140852043533",
        appId: "1:140852043533:web:a9e4b0d95a7cbd7cd69a44",
        measurementId: "G-X9CPNRWFDT"
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

                resolve( user );
            }).catch( error =>{
                console.error( error );
                reject( null );
            })
        })
    };

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