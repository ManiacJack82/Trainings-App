import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const exerciseList = document.getElementById("exercise-list");
  const toggleButton = document.getElementById("toggle-list");
  const addBtn = document.getElementById("add-exercise");
  const exerciseSelect = document.getElementById("exercise-select");
  const weightInput = document.getElementById("weight-input");
  const repsInput = document.getElementById("reps-input");
  const lastValues = document.getElementById("last-values");

  let history = {};
  let exercises = [];
  let userId = null;

  // Prüfe Login-Status
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId = user.uid;
      console.log("Eingeloggt als:", user.email);
      loadHistory();
    } else {
      alert("Bitte zuerst einloggen!");
      window.location.href = "login.html";
    }
  });

  toggleButton.addEventListener("click", () => {
    const isHidden = exerciseList.style.display === "none";
    exerciseList.style.display = isHidden ? "block" : "none";
    toggleButton.textContent = isHidden ? "Übungen verbergen" : "Übungen anzeigen";
  });

  addBtn.addEventListener("click", async () => {
    const name = exerciseSelect.value;
    const weight = weightInput.value;
    const reps = repsInput.value;

    if (!name || !weight || !reps) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }

    const entry = { name, weight, reps, userId, timestamp: new Date() };

    try {
      await addDoc(collection(db, "exercises"), entry);
      history[name] = { weight, reps };
      updateLastValues(name);
      loadHistory();
    } catch (e) {
      console.error("Fehler beim Speichern:", e);
    }

    exerciseSelect.value = "";
    weightInput.value = "";
    repsInput.value = "";
  });

  function updateList() {
    exerciseList.innerHTML = "";
    exercises.forEach((ex) => {
      const item = document.createElement("div");
      item.className = "exercise-item";
      item.innerHTML = `
        <span>${ex.name}: ${ex.weight} kg x ${ex.reps}</span>
        <button class="delete-btn" data-id="${ex.id}">🗑️</button>
      `;
      exerciseList.appendChild(item);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        try {
          await deleteDoc(doc(db, "exercises", id));
          loadHistory();
        } catch (e) {
          console.error("Fehler beim Löschen:", e);
        }
      });
    });
  }

  async function loadHistory() {
    if (!userId) return;
    const q = query(collection(db, "exercises"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    exercises = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      exercises.push({ id: docSnap.id, ...data });
      history[data.name] = { weight: data.weight, reps: data.reps };
    });
    updateList();
  }

  function updateLastValues(name) {
    if (history[name]) {
      lastValues.textContent = `Letztes Mal: ${history[name].weight} kg x ${history[name].reps}`;
    } else {
      lastValues.textContent = "";
    }
  }
});
