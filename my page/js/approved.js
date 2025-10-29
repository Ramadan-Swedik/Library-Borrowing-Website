// ===== Approved Events Page Logic (Simplified) =====

// DOM Elements
const tableBody = document.getElementById("approvedTableBody");
const searchInput = document.getElementById("searchApproved");
const sortSelect = document.getElementById("sortApproved");
const noDataMsg = document.getElementById("noDataMessage");

// Get all participants from localStorage
function getParticipants() {
  return JSON.parse(localStorage.getItem("participants")) || [];
}

// Render approved participants in the table
function renderApproved() {
  // Filter only approved ones
  let approved = getParticipants().filter(p => p.status === "Approved");

  // Sort by date
  const sortType = sortSelect.value;
  if (sortType === "newest") {
    approved.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    approved.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Search filter
  const term = searchInput.value.toLowerCase();
  approved = approved.filter(p =>
    (p.name || "").toLowerCase().includes(term) ||
    (p.phone || "").toLowerCase().includes(term) ||
    (p.event || "").toLowerCase().includes(term)
  );

  // Display data
  tableBody.innerHTML = "";

  if (approved.length === 0) {
    noDataMsg.classList.remove("d-none");
    return;
  }

  noDataMsg.classList.add("d-none");

  approved.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.phone}</td>
      <td>${p.event}</td>
      <td>${p.date}</td>
    `;
    tableBody.appendChild(row);
  });
}

// ===== Event Listeners =====
searchInput.addEventListener("input", renderApproved);
sortSelect.addEventListener("change", renderApproved);
window.addEventListener("storage", renderApproved); // sync updates from admin

// ===== Initial Load =====
renderApproved();
