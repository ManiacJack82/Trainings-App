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

  // Umschalten der Sichtbarkeit der Übungsliste
  toggleButton.addEventListener("click", () => {
    const isHidden = exerciseList.style.display === "none";
    exerciseList.style.display = isHidden ? "block" : "none";
    toggleButton.textContent = isHidden ? "Übungen verbergen" : "Übungen anzeigen";
  });

  // Hinzufügen einer neuen Übung
  addBtn.addEventListener("click", () => {
    const name = exerciseSelect.value;
    const weight = weightInput.value;
    const reps = repsInput.value;

    if (!name || !weight || !reps) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }

    const entry = { name, weight, reps };
    exercises.push(entry);
    history[name] = { weight, reps };

    updateList();
    updateLastValues(name);

    // Felder zurücksetzen
    exerciseSelect.value = "";
    weightInput.value = "";
    repsInput.value = "";
  });

  // Aktualisiert die Liste der Übungen
  function updateList() {
    exerciseList.innerHTML = "";
    exercises.forEach((ex, index) => {
      const item = document.createElement("div");
      item.className = "exercise-item";
      item.innerHTML = `
        <span>${ex.name}: ${ex.weight} kg x ${ex.reps}</span>
        <button class="delete-btn" data-index="${index}">🗑️</button>
      `;
      exerciseList.appendChild(item);
    });

    // Event Listener für alle löschen-Buttons
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        exercises.splice(index, 1);
        updateList();
      });
    });
  }

  // Zeigt die letzten Werte einer Übung an
  function updateLastValues(name) {
    if (history[name]) {
      lastValues.textContent = `Letztes Mal: ${history[name].weight} kg x ${history[name].reps}`;
    } else {
      lastValues.textContent = "";
    }
  }
});
