// home.js - renders featured books with images and Read More toggles
document.addEventListener("DOMContentLoaded", () => {
  const featured = [
    {
      id: "b001",
      title: "The Light Between Worlds",
      author: "Laura Weymouth",
      short: "Two sisters return from a magical world — a story about surviving trauma and finding home.",
      long: "Two sisters return from a magical world — a story about surviving trauma and finding home. They soon realize that the world they left behind has changed and must relearn who they are. This novel delicately explores grief, memory, and the quiet ways people repair themselves.",
      image: "assets/images/book1.jpg",
      alt: "Cover of The Light Between Worlds"
    },
    {
      id: "b002",
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      short: "A concise history that spans biology, anthropology, and the evolution of human societies.",
      long: "A concise history that spans biology, anthropology, and the evolution of human societies. Harari traces the cognitive revolutions that allowed Homo sapiens to dominate the world and examines the future of humanity in the face of biotechnology and artificial intelligence.",
      image: "assets/images/book2.jpg",
      alt: "Cover of Sapiens"
    },
    {
      id: "b003",
      title: "Atomic Habits",
      author: "James Clear",
      short: "Practical strategies to build good habits and break bad ones with tiny changes that compound.",
      long: "Practical strategies to build good habits and break bad ones with tiny changes that compound. James Clear uses science-backed tips and clear examples to show how small daily changes can lead to remarkable results over time.",
      image: "assets/images/book3.jpg",
      alt: "Cover of Atomic Habits"
    },
    {
      id: "b004",
      title: "The Alchemist",
      author: "Paulo Coelho",
      short: "A shepherd's journey in search of treasure becomes a spiritual quest about following your dreams.",
      long: "A shepherd's journey in search of treasure becomes a spiritual quest about following your dreams. Filled with simple wisdom and memorable lines, The Alchemist is an allegory of hope, destiny, and listening to your heart.",
      image: "assets/images/book4.jpg",
      alt: "Cover of The Alchemist"
    }
  ];

  const container = document.getElementById("featured-container");
  if (!container) return;

  const preview = (text, n = 120) => (text.length <= n ? text : text.slice(0, n).trim() + "...");

  featured.forEach(book => {
    const card = document.createElement("article");
    card.className = "book-card";
    card.dataset.bookId = book.id;

    // image element with fallback
    const imgSrc = book.image || "assets/images/placeholder.jpg";
    const img = `<img src="${imgSrc}" alt="${escapeHtml(book.alt || book.title)}" class="cover" onerror="this.onerror=null;this.src='assets/images/placeholder.jpg'">`;

    card.innerHTML = `
      ${img}
      <div class="card-body">
        <div class="meta small-muted">${escapeHtml(book.author)}</div>
        <h3>${escapeHtml(book.title)}</h3>
        <p class="desc" data-full="${escapeHtml(book.long)}">${escapeHtml(preview(book.long, 120))}</p>
        <div class="btn-row">
          <button class="btn toggle-btn" aria-expanded="false">Read More</button>
          <a class="btn primary" href="catalog.html?book=${encodeURIComponent(book.id)}">View</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // delegate read more clicks
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".toggle-btn");
    if (!btn) return;
    const card = btn.closest(".book-card");
    const descEl = card.querySelector(".desc");
    const fullText = unescapeHtml(descEl.dataset.full) || "";
    const isExpanded = btn.getAttribute("aria-expanded") === "true";

    if (!isExpanded) {
      descEl.textContent = fullText;
      btn.textContent = "Read Less";
      btn.setAttribute("aria-expanded", "true");
    } else {
      descEl.textContent = preview(fullText, 120);
      btn.textContent = "Read More";
      btn.setAttribute("aria-expanded", "false");
    }
  });

  // helpers
  function escapeHtml(str){
    return String(str)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#39;");
  }
  function unescapeHtml(str){
    return String(str)
      .replace(/&amp;/g,"&")
      .replace(/&lt;/g,"<")
      .replace(/&gt;/g,">")
      .replace(/&quot;/g,'"')
      .replace(/&#39;/g,"'");
  }
});
