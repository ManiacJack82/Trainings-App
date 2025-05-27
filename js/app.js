// js/app.js
import { auth } from '../css/firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Logout-Button aus dem DOM holen
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "login.html"; // zurück zur Anmeldung
    } catch (error) {
      console.error("Logout fehlgeschlagen:", error);
    }
  });
}
