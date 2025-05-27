// Authentifizierung absichern
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";
  });
});

// Tabs
function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.classList.remove("active");
  });
  document.getElementById(tabId).classList.add("active");

  if (tabId === "statsTab") {
    renderCharts();
  }
}

// Datenhaltung
const geraetSelect = document.getElementById("geraetSelect");
const wdhInput = document.getElementById("wdh");
const gewichtInput = document.getElementById("gewicht");
const tbody = document.querySelector("#tabelle tbody");
const tabelle = document.getElementById("tabelle");

let eintraege = JSON.parse(localStorage.getItem("eintraege")) || [];

let geraete = [...new Set(eintraege.map(e => e.geraet))];
updateUebungen();

function updateUebungen() {
  geraetSelect.innerHTML = "";
  geraete.forEach(uebung => {
    const opt = document.createElement("option");
    opt.textContent = uebung;
    opt.value = uebung;
    geraetSelect.appendChild(opt);
  });
}

geraetSelect.onchange = () => {
  const name = geraetSelect.value;
  const letzter = eintraege.find(e => e.geraet === name);
  if (letzter) {
    wdhInput.value = letzter.wdh;
    gewichtInput.value = letzter.gewicht;
  } else {
    wdhInput.value = "";
    gewichtInput.value = "";
  }
};

// Formularverarbeitung
document.getElementById("trainingForm").addEventListener("submit", e => {
  e.preventDefault();

  const datum = new Date().toLocaleString("de-DE");
  const geraet = geraetSelect.value;
  const wdh = Number(wdhInput.value);
  const gewicht = Number(gewichtInput.value);

  if (!geraet || wdh <= 0 || gewicht <= 0) return;

  eintraege.unshift({ datum, geraet, wdh, gewicht });
  localStorage.setItem("eintraege", JSON.stringify(eintraege));

  if (!geraete.includes(geraet)) {
    geraete.push(geraet);
    updateUebungen();
  }

  renderTable();
  geraetSelect.selectedIndex = -1;
  wdhInput.value = "";
  gewichtInput.value = "";
});

// Tabelle
function renderTable() {
  tbody.innerHTML = "";
  if (eintraege.length > 0) tabelle.hidden = false;

  eintraege.forEach(entry => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.datum}</td>
      <td>${entry.geraet}</td>
      <td>${entry.wdh}</td>
      <td>${entry.gewicht} kg</td>
      <td><button onclick="loescheEintrag('${entry.datum}')">🗑️</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function loescheEintrag(datum) {
  eintraege = eintraege.filter(e => e.datum !== datum);
  localStorage.setItem("eintraege", JSON.stringify(eintraege));
  renderTable();
  updateUebungen();
}

// Charts
let geraetChart, wochenChart;

function renderCharts() {
  const chart1 = document.getElementById("geraetChart").getContext("2d");
  const chart2 = document.getElementById("wochenChart").getContext("2d");

  const sumByGeraet = {};
  eintraege.forEach(e => {
    if (!sumByGeraet[e.geraet]) sumByGeraet[e.geraet] = 0;
    sumByGeraet[e.geraet] += e.wdh * e.gewicht;
  });

  if (geraetChart) geraetChart.destroy();
  geraetChart = new Chart(chart1, {
    type: "bar",
    data: {
      labels: Object.keys(sumByGeraet),
      datasets: [{
        label: "Trainingsvolumen",
        data: Object.values(sumByGeraet),
        backgroundColor: "rgba(0, 200, 150, 0.7)"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // Letzte 7 Tage
  const now = new Date();
  const dailyVolume = Array(7).fill(0);

  eintraege.forEach(e => {
    const date = new Date(e.datum.split(" ")[0].split(".").reverse().join("-"));
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff < 7) {
      dailyVolume[6 - diff] += e.wdh * e.gewicht;
    }
  });

  if (wochenChart) wochenChart.destroy();
  wochenChart = new Chart(chart2, {
    type: "line",
    data: {
      labels: ["6 Tage", "5", "4", "3", "2", "Gestern", "Heute"],
      datasets: [{
        label: "Volumen (7 Tage)",
        data: dailyVolume,
        borderColor: "rgba(0,200,150,0.9)",
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Initialisierung
renderTable();

