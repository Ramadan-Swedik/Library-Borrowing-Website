// ===== Reports & Analytics (Simplified) =====

// --- Helpers ---
const getParticipants = () => JSON.parse(localStorage.getItem("participants")) || [];
const countBy = (list, key) => list.reduce((acc, obj) => {
  acc[obj[key] || "Unknown"] = (acc[obj[key] || "Unknown"] || 0) + 1;
  return acc;
}, {});
const formatNum = n => new Intl.NumberFormat().format(n);

// --- KPIs ---
function renderKPIs(list) {
  const total = list.length;
  const approved = list.filter(p => p.status === "Approved").length;
  const pending = list.filter(p => !p.status || p.status === "Pending").length;
  const rejected = list.filter(p => p.status === "Rejected").length;

  document.getElementById("kpis").innerHTML = `
    ${makeKpiCard("Total", total)}
    ${makeKpiCard("Approved", approved, "text-success")}
    ${makeKpiCard("Pending", pending, "text-warning")}
    ${makeKpiCard("Rejected", rejected, "text-danger")}
  `;
}

function makeKpiCard(label, value, color = "") {
  return `
    <div class="col-12 col-md-3">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="text-muted">${label}</div>
          <div class="kpi ${color}">${formatNum(value)}</div>
        </div>
      </div>
    </div>
  `;
}

// --- Charts ---
let statusChart, eventChart, timeChart;

function renderCharts(list) {
  // Destroy previous charts (avoid duplicates)
  statusChart?.destroy();
  eventChart?.destroy();
  timeChart?.destroy();

  // Status Distribution
  const statusMap = countBy(list.map(p => ({ status: p.status || "Pending" })), "status");
  statusChart = createChart("statusChart", "doughnut", statusMap, { legend: "bottom" });

  // Registrations per Event
  const eventMap = countBy(list, "event");
  eventChart = createChart("eventChart", "bar", eventMap, { legend: false });

  // Registrations Over Time
  const timeMap = list.reduce((acc, p) => {
    if (p.date) acc[p.date] = (acc[p.date] || 0) + 1;
    return acc;
  }, {});
  const sortedDates = Object.keys(timeMap).sort();
  timeChart = new Chart(document.getElementById("timeChart"), {
    type: "line",
    data: {
      labels: sortedDates,
      datasets: [{ data: sortedDates.map(d => timeMap[d]), tension: 0.25, borderWidth: 2 }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function createChart(id, type, dataMap, opts = {}) {
  const labels = Object.keys(dataMap);
  const values = Object.values(dataMap);

  return new Chart(document.getElementById(id), {
    type,
    data: { labels, datasets: [{ data: values }] },
    options: {
      plugins: {
        legend: { display: opts.legend !== false, position: opts.legend || "top" }
      },
      scales: { y: { beginAtZero: true, precision: 0 } }
    }
  });
}

// --- Init ---
function initReports() {
  const data = getParticipants();
  renderKPIs(data);
  renderCharts(data);
}

// Refresh & live update
document.getElementById("refresh").addEventListener("click", initReports);
window.addEventListener("storage", initReports);

// Initial load
initReports();