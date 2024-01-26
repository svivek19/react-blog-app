import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAO9fhH53M4vqUS_3Qx7rbF9KxyVfMfbAw",
  authDomain: "blog-vivek.firebaseapp.com",
  projectId: "blog-vivek",
  storageBucket: "blog-vivek.appspot.com",
  messagingSenderId: "205635926284",
  appId: "1:205635926284:web:3c6cab4a297244c8c93129"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();


