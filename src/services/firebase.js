import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCpJ2PMmB1cpPWrrYeg6qjhwkKSIf5YfaI",
  authDomain: "app-lista-compra-2cc34.firebaseapp.com",
  projectId: "app-lista-compra-2cc34",
  storageBucket: "app-lista-compra-2cc34.firebasestorage.app",
  messagingSenderId: "327635280268",
  appId: "1:327635280268:web:d4d1835668c446219db6a9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;