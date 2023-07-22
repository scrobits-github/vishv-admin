import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyBRDl-DC6Ch4PHBrkS8s0gTLUBCU-Yhqiw',
	authDomain: 'vishv-architect.firebaseapp.com',
	projectId: 'vishv-architect',
	storageBucket: 'vishv-architect.appspot.com',
	messagingSenderId: '381028461727',
	appId: '1:381028461727:web:d7a25759e5424068ec06aa',
	measurementId: 'G-VHQBZTJZEW',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
export { app, firestore, storage };
