//import * as firebase from "firebase/app";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

  var firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};


firebase.initializeApp(firebaseConfig);
// firebase.firestore().settings({
//   timestampsInSnapshots: true
// })

//firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
const firestore = firebase.firestore();
const auth = firebase.auth();


// firebaseGoogleSignIn=firebase
//     .auth()
//     .signInWithPopup(new firebase.auth.GoogleAuthProvider())
//     .then(async result => {})
//     .catch(err => {});

// export const storageKey = 'KEY_FOR_LOCAL_STORAGE';

// export const isAuthenticated = () => {
//   return !!auth.currentUser || !!localStorage.getItem(storageKey);
// };


export { firebase, firestore, auth };
// export const myFirestore = firebase.firestore();
// export const myStorage = firebase.storage();