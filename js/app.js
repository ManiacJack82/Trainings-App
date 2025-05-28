import { auth } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Logout-Button
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "login.html"; // Zurück zum Login
    } catch (error) {
      console.error("Logout fehlgeschlagen:", error);
    }
  });
}
