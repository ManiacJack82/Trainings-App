import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Du bist nicht eingeloggt. Du wirst zur Startseite weitergeleitet.");
    window.location.href = "index.html";
    return;
  }

  console.log("Angemeldet als:", user.email);
  const uid = user.uid;

  // === DOM-Elemente ===
  const geraetSelect = document.getElementById("geraetSelect");
  const trainingForm = document.getElementById("trainingForm");
  const wdhInput = document.getElementById("wdh");
  const gewichtInput = document.getElementById("gewicht");
  const tabelle = document.getElementById("tabelle").querySelector("tbody");
  const hinzufuegenUebungBtn = document.getElementById("hinzufuegenUebung");
  const neueUebungInput = document.getElementById("neueUebung");
  const uebungenList = document.getElementById("uebungenList");
  const toggleUebungen = document.getElementById("toggleUebungen");
  const backButton = document.getElementById("backButton");

  // === Übungen-Array ===
  let uebungen = [];

  // === Navigation zurück zur App ===
  backButton.addEventListener("click", () => {
    window.location.href = "app.html";
  });

  // === Übungsliste ein-/ausblenden ===
  toggleUebungen.addEventListener("click", () => {
    const isVisible = uebungenList.style.display !== "none";
    uebungenList.style.display = isVisible ? "none" : "block";
  });

  // === Neue Übung hinzufügen ===
  hinzufuegenUebungBtn.addEventListener("click", async () => {
    const name = neueUebungInput.value.trim();
    if (!name) return;

    try {
      await addDoc(collection(db, "uebungen"), {
        uid,
        name
      });
      neueUebungInput.value = "";
      await ladeUebungen();
    } catch (err) {
      console.error("Fehler beim Hinzufügen der Übung:", err);
      alert("Übung konnte nicht gespeichert werden.");
    }
  });

  // === Übung löschen ===
  async function loescheUebung(id) {
    try {
      await deleteDoc(doc(db, "uebungen", id));
      await ladeUebungen();
    } catch (err) {
      console.error("Fehler beim Löschen der Übung:", err);
      alert("Übung konnte nicht gelöscht werden.");
    }
  }

  // === Übungen laden ===
  async function ladeUebungen() {
    const q = query(collection(db, "uebungen"), where("uid", "==", uid));
    const snapshot = await getDocs(q);

    uebungen = [];
    snapshot.forEach(docSnap => {
      uebungen.push({ id: docSnap.id, name: docSnap.data().name });
    });

    renderUebungen();
  }

  function renderUebungen() {
    geraetSelect.innerHTML = "";
    uebungenList.innerHTML = "";

    uebungen.forEach(({ id, name }) => {
      // Option für Select
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      geraetSelect.appendChild(option);

      // Listeintrag mit Löschbutton
      const li = document.createElement("li");
      li.textContent = name + " ";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";
      deleteBtn.addEventListener("click", () => loescheUebung(id));

      li.appendChild(deleteBtn);
      uebungenList.appendChild(li);
    });
  }

  // === Trainingssatz eintragen ===
  trainingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const geraet = geraetSelect.value;
    const wdh = wdhInput.value;
    const gewicht = gewichtInput.value;

    if (!geraet || !wdh || !gewicht) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }

    try {
      await addDoc(collection(db, "trainings"), {
        uid,
        geraet,
        wdh: Number(wdh),
        gewicht: Number(gewicht),
        datum: serverTimestamp()
      });
      wdhInput.value = "";
      gewichtInput.value = "";
      await ladeTrainings();
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      alert("Speichern fehlgeschlagen.");
    }
  });

  // === Trainingsdaten laden ===
  async function ladeTrainings() {
    const q = query(collection(db, "trainings"), where("uid", "==", uid));
    const snapshot = await getDocs(q);

    const rows = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const datum = data.datum?.toDate().toLocaleDateString() || "-";
      rows.push(`
        <tr>
          <td>${datum}</td>
          <td>${data.geraet}</td>
          <td>${data.wdh}</td>
          <td>${data.gewicht}</td>
          <td><button class="delete-btn" data-id="${docSnap.id}">🗑️</button></td>
        </tr>
      `);
    });

    tabelle.innerHTML = rows.join("");
    document.getElementById("tabelle").hidden = snapshot.empty;

    // Löschen-Events
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        await deleteDoc(doc(db, "trainings", id));
        await ladeTrainings();
      });
    });
  }

  // === Initialdaten laden ===
  await ladeUebungen();
  await ladeTrainings();
});

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /uebungen/{uebungId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }

    match /trainings/{trainingId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
  }
}
