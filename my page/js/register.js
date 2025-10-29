// ===== Event Registration Logic (Simplified) =====

// Form element
const form = document.getElementById("registrationForm");

// Handle form submission
form.addEventListener("submit", e => {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const eventName = document.getElementById("event").value.trim();
  const date = document.getElementById("date").value;

  // Basic validation
  if (!name || !phone || !eventName || !date) {
    alert("Please fill in all fields.");
    return;
  }

  // Create participant object
  const newParticipant = {
    name,
    phone,
    event: eventName,
    date,
    status: "Pending"
  };

  // Save to localStorage
  const participants = JSON.parse(localStorage.getItem("participants")) || [];
  participants.push(newParticipant);
  localStorage.setItem("participants", JSON.stringify(participants));

  alert("Registration successful!");
  window.location.href = "admin.html"; // Redirect back to admin page
});
