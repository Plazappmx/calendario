// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDmicT-gt2eyzkH2kOh-ysMn9oje7RsM6s",
    authDomain: "calendario-d61a4.firebaseapp.com",
    projectId: "calendario-d61a4",
    storageBucket: "calendario-d61a4.appspot.com",
    messagingSenderId: "600396590028",
    appId: "1:600396590028:web:3e21639da3b34e05424b69",
    measurementId: "G-RESCCFJN1K"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
