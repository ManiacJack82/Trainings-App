document.addEventListener("DOMContentLoaded", () => {
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

  let uebungen = [];
  let history = [];

  // Button Zurück zur Übersicht
  backButton.addEventListener("click", () => {
    window.location.href = "app.html";
  });

  // Übungen ein-/ausklappen
  toggleButton.addEventListener("click", () => {
    const isHidden = uebungenList.style.display === "none" || uebungenList.style.display === "";
    uebungenList.style.display = isHidden ? "block" : "none";
    toggleButton.textContent = isHidden ? "Übungsliste verbergen" : "Übungsliste anzeigen";
  });

  // Neue Übung hinzufügen
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

  // Trainingsformular absenden
  trainingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const geraet = geraetSelect.value;
    const wdh = parseInt(wdhInput.value);
    const gewicht = parseFloat(gewichtInput.value);

    if (!geraet || !wdh || isNaN(wdh) || wdh < 1 || isNaN(gewicht) || gewicht < 0) {
      alert("Bitte alle Felder korrekt ausfüllen!");
      return;
    }

    const datum = new Date().toLocaleDateString();
    const eintrag = { datum, geraet, wdh, gewicht };
    history.push(eintrag);
    updateTabelle();
    trainingForm.reset();
  });

  // Liste der Übungen aktualisieren (Anzeige)
  function updateUebungenList() {
    uebungenList.innerHTML = "";
    uebungen.forEach((uebung, index) => {
      const li = document.createElement("li");
      li.textContent = uebung;
      // Optional: Löschbutton hinzufügen
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

  // Select-Menü für Geräte/Übungen aktualisieren
  function updateGeraetSelect() {
    geraetSelect.innerHTML = "";
    uebungen.forEach((uebung) => {
      const option = document.createElement("option");
      option.value = uebung;
      option.textContent = uebung;
      geraetSelect.appendChild(option);
    });
  }

  // Tabelle mit Trainingsdaten aktualisieren und anzeigen
  function updateTabelle() {
    tabelleBody.innerHTML = "";
    if (history.length === 0) {
      tabelle.hidden = true;
      return;
    }
    tabelle.hidden = false;

    history.forEach((eintrag, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${eintrag.datum}</td>
        <td>${eintrag.geraet}</td>
        <td>${eintrag.wdh}</td>
        <td>${eintrag.gewicht}</td>
        <td><button class="delete-btn" data-index="${index}">✖</button></td>
      `;

      tabelleBody.appendChild(tr);
    });

    // Löschen Button in der Tabelle
    tabelleBody.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        history.splice(index, 1);
        updateTabelle();
      });
    });
  }

  // Initial Setup: Liste verstecken und leer
  uebungenList.style.display = "none";
  toggleButton.textContent = "Übungsliste anzeigen";
  tabelle.hidden = true;
});
