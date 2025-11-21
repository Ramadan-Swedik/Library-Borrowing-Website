document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("catalog-container");
  const searchInput = document.getElementById("catalog-search");

  let books = [];
  try {
    const raw = localStorage.getItem("publishedBooks");
    books = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(books)) books = [];
  } catch {
    books = [];
  }

  const shortTxt = t =>
    t && t.length > 160 ? t.slice(0, 160) + "..." : t || "";

  function render() {
    container.innerHTML = "";

    books.forEach((b, i) => {
      if (b.hidden) return;

      const card = document.createElement("div");
      card.className = "book-card";
      card.dataset.index = i;

      const img = b.imageData || b.img || "Assets/Images/book-placeholder.jpg";

      card.innerHTML = `
        <div class="card-image-wrap">
          <input type="checkbox" class="card-checkbox" data-index="${i}">
          <img src="${img}" class="cover" alt="${b.title}">
        </div>

        <span class="meta">${b.author || ""}</span>
        <h3>${b.title || ""}</h3>
        <p class="desc">${shortTxt(b.description)}</p>

        ${
          b.description
            ? `<button class="btn read-btn" type="button">Read More</button>`
            : ""
        }
      `;
      container.appendChild(card);
    });
  }

  render();

  // search
  searchInput.addEventListener("keyup", () => {
    const q = searchInput.value.toLowerCase();

    document.querySelectorAll(".book-card").forEach((card) => {
      const b = books[card.dataset.index];
      if (!b || b.hidden) {
        card.style.display = "none";
        return;
      }

      const text = `${b.title} ${b.author} ${b.genre}`.toLowerCase();
      card.style.display = text.includes(q) ? "block" : "none";
    });
  });

  // Read more
  container.addEventListener("click", (e) => {
    if (!e.target.classList.contains("read-btn")) return;

    const btn = e.target;
    const card = btn.closest(".book-card");
    const index = Number(card.dataset.index);
    const b = books[index];

    const descEl = card.querySelector(".desc");
    const expanded = btn.dataset.expanded === "1";

    if (expanded) {
      descEl.textContent = shortTxt(b.description);
      btn.textContent = "Read More";
      btn.dataset.expanded = "0";
    } else {
      descEl.textContent = b.description;
      btn.textContent = "Read Less";
      btn.dataset.expanded = "1";
    }
  });

  // top borrow button (does nothing yet)
  document.getElementById("borrow-top-btn").addEventListener("click", () => {
    console.log("Borrow clicked (placeholder)");
  });
});
