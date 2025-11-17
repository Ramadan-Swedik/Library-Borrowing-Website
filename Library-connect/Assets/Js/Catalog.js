document.addEventListener("DOMContentLoaded", () => {

  const books = [
    { 
      title: "The Light Between Worlds", 
      author: "Laura Weymouth", 
      genre: "Fantasy",
      img: "Assets/Images/book1.jpg"
    },
    { 
      title: "Sapiens", 
      author: "Yuval Noah Harari", 
      genre: "History",
      img: "Assets/Images/book2.jpg"
    },
    { 
      title: "Atomic Habits", 
      author: "James Clear", 
      genre: "Self-help",
      img: "Assets/Images/book3.jpg"
    },
    { 
      title: "The Alchemist", 
      author: "Paulo Coelho", 
      genre: "Fiction",
      img: "Assets/Images/book4.jpg"
    }
  ];

  const container = document.getElementById("catalog-container");

  // render cards
  books.forEach((book, index) => {
    const card = document.createElement("div");
    card.className = "catalog-card";
    card.dataset.index = index;

    card.innerHTML = `
      <img src="${book.img}" class="cover" alt="${book.title}">
      <h3>${book.title}</h3>
      <p class="author">${book.author}</p>
      <p class="genre">${book.genre}</p>
    `;

    container.appendChild(card);
  });

  // live search
  const searchInput = document.getElementById("catalog-search");

  searchInput.addEventListener("keyup", () => {
    const query = searchInput.value.toLowerCase();

    document.querySelectorAll(".catalog-card").forEach(card => {
      const index = card.dataset.index;
      const b = books[index];

      const match =
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.genre.toLowerCase().includes(query);

      card.style.display = match ? "block" : "none";
    });
  });

});
