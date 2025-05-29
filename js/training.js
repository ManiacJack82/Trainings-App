// js/training.js
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Warte bis ein Benutzer eingeloggt ist
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
  const uebungenContainer = document.getElementById("uebungenContainer");
  const backButton = document.getElementById("backButton");

  // === Initiale Daten ===
  let uebungen = [];

  // === Navigation zurück zur App ===
  backButton.addEventListener("click", () => {
    window.location.href = "app.html";
  });

  // === Übungsliste ein-/ausklappen ===
  toggleUebungen.addEventListener("click", () => {
    uebungenContainer.style.display = (uebungenContainer.style.display === "none") ? "block" : "none";
  });

  // === Neue Übung hinzufügen ===
  hinzufuegenUebungBtn.addEventListener("click", () => {
    const name = neueUebungInput.value.trim();
    if (name && !uebungen.includes(name)) {
      uebungen.push(name);
      renderUebungen();
      neueUebungInput.value = "";
    }
  });

  function renderUebungen() {
    geraetSelect.innerHTML = "";
    uebungenList.innerHTML = "";
    uebungen.forEach(name => {
      const option = document.createElement("option");
      option.textContent = name;
      geraetSelect.appendChild(option);

      const li = document.createElement("li");
      li.textContent = name;
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

    // Löschen-Events binden
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        await deleteDoc(doc(db, "trainings", id));
        await ladeTrainings();
      });
    });
  }

  // Initiales Laden der Trainingsdaten
  ladeTrainings();
});


