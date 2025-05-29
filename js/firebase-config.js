// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"; // NEU

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
export const auth = getAuth(app);
export const db = getFirestore(app); // NEU
