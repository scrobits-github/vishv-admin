// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJk1cfSUNl4pWOzVz_Ua3TLQNHBHfPVAk",
    authDomain: "mpminfotech-47152.firebaseapp.com",
    projectId: "mpminfotech-47152",
    storageBucket: "mpminfotech-47152.appspot.com",
    messagingSenderId: "460002857607",
    appId: "1:460002857607:web:9214fec919ed80a306de22"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

