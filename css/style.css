// js/auth.js
import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Referenzen zu DOM
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const message = document.getElementById("message");

// Login
loginBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "app.html"; // Weiter zur App
  } catch (error) {
    message.textContent = "Login fehlgeschlagen: " + error.message;
  }
});

// Registrierung
registerBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    message.textContent = "Registrierung erfolgreich! Bitte einloggen.";
  } catch (error) {
    message.textContent = "Registrierung fehlgeschlagen: " + error.message;
  }
});
