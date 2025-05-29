import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  // Elemente
  const uebungenList = document.getElementById("uebungenList");
  const toggleButton = document.getElementById("toggleUebungen");
  const addUebungBtn = document.getElementById("hinzufuegenUebung");
  const geraetSelect = document.getElementById("geraetSelect");
  const gewichtInput = document.getElementById("gewicht");
  const wdhInput = document.getElementById("wdh");
  const neueUebungInput = document.getElementById("neueUebung");
  const trainingForm = document.getElementById("trainingForm");
  const tabelle = document.getElementById("tabelle");
  const tabelleBody = tabelle.querySelector("tbody");
  const backButton = document.getElementById("backButton");

  const auth = window.auth;  // aus firebase-config.js exportiert
  const db = window.db;      // aus firebase-config.js exportiert

  let uebungen = [];
  let userId = null;
  let history = [];

  backButton.addEventListener("click", () => {
    window.location.href = "app.html";
  });

  toggleButton.addEventListener("click", () => {
    const isHidden = uebungenList.style.display === "none" || uebungenList.style.display === "";
    uebungenList.style.display = isHidden ? "block" : "none";
    toggleButton.textContent = isHidden ? "Übungsliste verbergen" : "Übungsliste anzeigen";
  });

  addUebungBtn.addEventListener("click", () => {
    const neueUebung = neueUebungInput.value.trim();
    if (!neueUebung) {
      alert("Bitte gib einen Übungsnamen ein!");
      return;
    }
    if (!uebungen.includes(neueUebung)) {
      uebungen.push(neueUebung);
      updateUebungenList();
      updateGeraetSelect();
      neueUebungInput.value = "";
    } else {
      alert("Diese Übung gibt es bereits!");
    }
  });

  trainingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const geraet = geraetSelect.value;
    const wdh = parseInt(wdhInput.value);
    const gewicht = parseFloat(gewichtInput.value);

    if (!geraet || !wdh || isNaN(wdh) || wdh < 1 || isNaN(gewicht) || gewicht < 0) {
      alert("Bitte alle Felder korrekt ausfüllen!");
      return;
    }
    if (!userId) {
      alert("Nicht eingeloggt!");
      return;
    }

    const datum = new Date().toISOString();

    // Trainingsdaten in Firestore speichern
    try {
      await addDoc(collection(db, "trainings"), {
        userId,
        datum,
        geraet,
        wdh,
        gewicht,
      });
      alert("Training gespeichert!");
      loadHistory();  // Neu laden
      trainingForm.reset();
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern");
    }
  });

  // Übungenliste updaten
  function updateUebungenList() {
    uebungenList.innerHTML = "";
    uebungen.forEach((uebung, index) => {
      const li = document.createElement("li");
      li.textContent = uebung;
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "✖";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", () => {
        uebungen.splice(index, 1);
        updateUebungenList();
        updateGeraetSelect();
      });
      li.appendChild(deleteBtn);
      uebungenList.appendChild(li);
    });
  }

  // Select-Menü updaten
  function updateGeraetSelect() {
    geraetSelect.innerHTML = "";
    uebungen.forEach((uebung) => {
      const option = document.createElement("option");
      option.value = uebung;
      option.textContent = uebung;
      geraetSelect.appendChild(option);
    });
  }

  // Tabelle updaten mit Firestore Daten
  async function loadHistory() {
    if (!userId) return;

    const q = query(collection(db, "trainings"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    history = [];
    querySnapshot.forEach((docSnap) => {
      history.push({ id: docSnap.id, ...docSnap.data() });
    });

    updateTabelle();
  }

  function updateTabelle() {
    tabelleBody.innerHTML = "";
    if (history.length === 0) {
      tabelle.hidden = true;
      return;
    }
    tabelle.hidden = false;

    history.forEach((eintrag, index) => {
      const tr = document.createElement("tr");

      const datum = new Date(eintrag.datum).toLocaleDateString();

      tr.innerHTML = `
        <td>${datum}</td>
        <td>${eintrag.geraet}</td>
        <td>${eintrag.wdh}</td>
        <td>${eintrag.gewicht}</td>
        <td><button class="delete-btn" data-id="${eintrag.id}">✖</button></td>
      `;

      tabelleBody.appendChild(tr);
    });

    tabelleBody.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const docId = btn.getAttribute("data-id");
        try {
          await deleteDoc(doc(db, "trainings", docId));
          loadHistory();
        } catch (error) {
          console.error("Fehler beim Löschen:", error);
          alert("Fehler beim Löschen");
        }
      });
    });
  }

  // Auth-Status prüfen und initial Daten laden
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId = user.uid;
      loadHistory();
    } else {
      alert("Bitte einloggen");
      window.location.href = "login.html"; // oder wo dein Login ist
    }
  });

  // Anfangszustand
  uebungenList.style.display = "none";
  toggleButton.textContent = "Übungsliste anzeigen";
  tabelle.hidden = true;
});
