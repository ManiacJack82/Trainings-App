import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// DOM-Elemente
const backButton = document.getElementById("backButton");
const toggleUebungen = document.getElementById("toggleUebungen");
const hinzufuegenUebung = document.getElementById("hinzufuegenUebung");
const neueUebung = document.getElementById("neueUebung");
const uebungenContainer = document.getElementById("uebungenContainer");
const uebungenList = document.getElementById("uebungenList");
const geraetSelect = document.getElementById("geraetSelect");
const trainingForm = document.getElementById("trainingForm");
const tabelle = document.getElementById("tabelle");
const tabelleBody = tabelle.querySelector("tbody");

let currentUser = null;

// Auth-Prüfung
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    ladeUebungen();
    ladeEintraege();
  } else {
    window.location.href = "APP.html";
  }
});

// Zurück-Button
backButton.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

// Übungen hinzufügen
hinzufuegenUebung.addEventListener("click", async () => {
  const name = neueUebung.value.trim();
  if (!name) return;

  await addDoc(collection(db, "exercises"), {
    name,
    uid: currentUser.uid
  });

  neueUebung.value = "";
  ladeUebungen();
});

// Übungsliste ein-/ausklappen
toggleUebungen.addEventListener("click", () => {
  uebungenContainer.style.display =
    uebungenContainer.style.display === "none" ? "block" : "none";
});

// Trainingsformular senden
trainingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = geraetSelect.value;
  const wdh = trainingForm["wdh"].value;
  const gewicht = trainingForm["gewicht"].value;

  if (!name || !wdh || !gewicht) {
    alert("Bitte alle Felder ausfüllen.");
    return;
  }

  await addDoc(collection(db, "training"), {
    name,
    wdh: parseInt(wdh),
    gewicht: parseFloat(gewicht),
    uid: currentUser.uid,
    timestamp: Timestamp.now()
  });

  trainingForm.reset();
  ladeEintraege();
});

// Übungen laden
async function ladeUebungen() {
  const q = query(
    collection(db, "exercises"),
    where("uid", "==", currentUser.uid)
  );
  const snapshot = await getDocs(q);

  uebungenList.innerHTML = "";
  geraetSelect.innerHTML = "";

  snapshot.forEach((doc) => {
    const { name } = doc.data();

    // Liste
    const li = document.createElement("li");
    li.textContent = name;
    uebungenList.appendChild(li);

    // Select
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    geraetSelect.appendChild(option);
  });
}

// Trainingseinträge laden
async function ladeEintraege() {
  const q = query(
    collection(db, "training"),
    where("uid", "==", currentUser.uid)
  );
  const snapshot = await getDocs(q);

  tabelle.hidden = snapshot.empty;
  tabelleBody.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const { name, wdh, gewicht, timestamp } = docSnap.data();
    const datum = timestamp.toDate().toLocaleDateString();

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${datum}</td>
      <td>${name}</td>
      <td>${wdh}</td>
      <td>${gewicht}</td>
      <td><button class="delete-btn" data-id="${docSnap.id}">🗑️</button></td>
    `;
    tabelleBody.appendChild(tr);
  });

  // Delete Buttons aktivieren
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await deleteDoc(doc(db, "training", id));
      ladeEintraege();
    });
  });
}

