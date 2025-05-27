// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1HsJvWIYnBPCqSQS0ymOL0IEdZW8KDOY",
  authDomain: "trainings-app-24eb7.firebaseapp.com",
  projectId: "trainings-app-24eb7",
  storageBucket: "trainings-app-24eb7.appspot.com",
  messagingSenderId: "266317486009",
  appId: "1:266317486009:web:730e7f91eaae69fb584868",
  measurementId: "G-3EWQ7W9Z85"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
