// js/app.js
import { auth } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Logout-Button aus dem DOM holen
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      // Nach dem Logout zur Login-Seite weiterleiten
      window.location.href = "login.html";
    } catch (error) {
      console.error("Fehler beim Logout:", error);
    }
  });
}
