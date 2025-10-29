// ===== Admin Dashboard Script (Simplified Version) =====

// Load participants from localStorage
let participants = JSON.parse(localStorage.getItem("participants")) || [];

// Save data to localStorage
function saveData() {
  localStorage.setItem("participants", JSON.stringify(participants));
}

// Update top cards (Total / Approved / Pending / Rejected)
function updateCounts() {
  const total = participants.length;
  const approved = participants.filter(p => p.status === "Approved").length;
  const pending = participants.filter(p => !p.status || p.status === "Pending").length;
  const rejected = participants.filter(p => p.status === "Rejected").length;

  document.getElementById("totalCount").textContent = total;
  document.getElementById("approvedCount").textContent = approved;
  document.getElementById("pendingCount").textContent = pending;
  document.getElementById("rejectedCount").textContent = rejected;
}

// Render table rows
function renderTable(list = participants) {
  const tbody = document.querySelector(".participants-table tbody");
  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#888;">No participants found</td></tr>`;
    updateCounts();
    return;
  }

  list.forEach((p, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${p.name || ""}</td>
        <td>${p.phone || ""}</td>
        <td>${p.event || ""}</td>
        <td>${p.date || ""}</td>
        <td>${p.status || "Pending"}</td>
        <td>
          <button class="btn-approve" data-index="${i}">Approve</button>
          <button class="btn-reject" data-index="${i}">Reject</button>
        </td>
        <td><button class="btn-delete" data-index="${i}">Delete</button></td>
      </tr>
    `;
  });

  updateCounts();
}

// ===== Button Actions =====
function changeStatus(index, status) {
  participants[index].status = status;
  saveData();
  renderTable();
}

function deleteParticipant(index) {
  if (confirm("Delete this participant?")) {
    participants.splice(index, 1);
    saveData();
    renderTable();
  }
}

// ===== Event Listeners =====

// Approve / Reject / Delete buttons (using delegation)
document.addEventListener("click", e => {
  const btn = e.target;
  const i = btn.dataset.index;
  if (btn.classList.contains("btn-approve")) changeStatus(i, "Approved");
  if (btn.classList.contains("btn-reject")) changeStatus(i, "Rejected");
  if (btn.classList.contains("btn-delete")) deleteParticipant(i);
});

// Search participants
document.getElementById("searchInput")?.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = participants.filter(p =>
    (p.name || "").toLowerCase().includes(term) ||
    (p.phone || "").toLowerCase().includes(term) ||
    (p.event || "").toLowerCase().includes(term)
  );
  renderTable(filtered);
});

// Sort by date (Newest / Oldest)
document.getElementById("dateFilter")?.addEventListener("change", e => {
  const sorted = [...participants];
  if (e.target.value === "newest") sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (e.target.value === "oldest") sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
  renderTable(sorted);
});

// Add new participant button → Go to register page
document.querySelector(".add-btn")?.addEventListener("click", () => {
  window.location.href = "register.html";
});

// Listen for changes from other tabs
window.addEventListener("storage", () => renderTable());

// ===== Initial Load =====
renderTable();
updateCounts();
