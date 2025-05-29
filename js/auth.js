import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const message = document.getElementById("message");

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("Bitte E-Mail und Passwort eingeben");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "training.html";
  } catch (error) {
    showMessage("Login fehlgeschlagen: " + error.message);
  }
});

registerBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("Bitte E-Mail und Passwort eingeben");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    showMessage("Registrierung erfolgreich. Du kannst dich jetzt einloggen.");
  } catch (error) {
    showMessage("Registrierung fehlgeschlagen: " + error.message);
  }
});

function showMessage(msg) {
  message.textContent = msg;
}

