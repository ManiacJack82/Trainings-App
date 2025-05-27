// js/app.js
import { auth } from '../css/firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Stelle sicher, dass das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "login.html"; // Zurück zur Anmeldung
      } catch (error) {
        console.error("Logout fehlgeschlagen:", error.message);
        alert("Fehler beim Logout: " + error.message);
      }
    });
  }
});
