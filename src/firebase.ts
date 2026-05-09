import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVcDZrMQmp7DFPb5_6ysL5Mj3yNSFbPcA",
  authDomain: "analyzer-cb6a2.firebaseapp.com",
  projectId: "analyzer-cb6a2",
  storageBucket: "analyzer-cb6a2.firebasestorage.app",
  messagingSenderId: "505987118949",
  appId: "1:505987118949:web:831112cacc49557e7f938c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
