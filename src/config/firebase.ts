// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhp4-6DI1eV27vhqonk_ej_jZf6jOPL9o",
  authDomain: "react-social-media-17524.firebaseapp.com",
  projectId: "react-social-media-17524",
  storageBucket: "react-social-media-17524.appspot.com",
  messagingSenderId: "412802637114",
  appId: "1:412802637114:web:7bc6f0c6ebc53db2920403",
  measurementId: "G-PGJZTWZMSE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const dataBase = getFirestore(app)