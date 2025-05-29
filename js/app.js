import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const welcomeMessage = document.getElementById("welcomeMessage");
const logoutButton = document.getElementById("logoutButton");

// Auth-Status prüfen und Namen anzeigen
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Benutzer ist eingeloggt
    // Nutzername aus E-Mail vor @ extrahieren (z.B. "max.mustermann" aus "max.mustermann@mail.com")
    const displayName = user.email ? user.email.split('@')[0] : "User";
    welcomeMessage.textContent = `Willkommen, ${displayName}`;
  } else {
    // Nicht eingeloggt -> zurück zum Login
    window.location.href = "index.html";
  }
});

// Logout-Button Funktion
logoutButton.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
