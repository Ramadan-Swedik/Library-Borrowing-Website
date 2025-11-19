// Assets/Js/Register.js
document.addEventListener("DOMContentLoaded", () => {

  let scheduledBooks = [];
  let editingIndex = null;
  let currentImage = "";

  const scheduleList = document.getElementById("schedule-list");
  const form = document.getElementById("book-form");

  const titleInput = document.getElementById("book-title");
  const authorInput = document.getElementById("book-author");
  const genreInput = document.getElementById("book-genre");
  const dateInput = document.getElementById("book-date");
  const descInput = document.getElementById("book-description");

  const dropArea = document.getElementById("drop-area");
  const fileInput = document.getElementById("file-input");
  const preview = document.getElementById("preview");

  const addBtn = document.getElementById("add-update-btn");
  const clearBtn = document.getElementById("clear-btn");
  const message = document.getElementById("message");

  function msg(t) {
    message.textContent = t;
    message.style.display = "block";
    setTimeout(() => message.style.display = "none", 2000);
  }

  function renderSchedule() {
    scheduleList.innerHTML = "";

    if (scheduledBooks.length === 0) {
      scheduleList.innerHTML = `<p style="font-size:13px;color:#6e5950;">No books scheduled.</p>`;
      return;
    }

    scheduledBooks.forEach((b, i) => {
      if (b.hiddenSchedule) return;

      const item = document.createElement("div");
      item.className = "schedule-item";
      item.dataset.index = i;

      const img = b.imageData || "Assets/Images/book-placeholder.jpg";

      item.innerHTML = `
        <img src="${img}" class="schedule-thumb">

        <div class="schedule-main">
          <h3>${b.title}</h3>
          <p class="meta">${b.author || ""} • ${b.genre || ""}</p>
          <p class="desc">${b.description || ""}</p>
          <p class="date">${b.date || ""}</p>
        </div>

        <div class="schedule-actions">
          <button class="btn-xs btn-publish">Publish</button>
          <button class="btn-xs btn-edit">Edit</button>
          <button class="btn-xs btn-hide">Hide</button>
          <button class="btn-xs btn-delete">Delete</button>
        </div>
      `;

      scheduleList.appendChild(item);
    });
  }

  function addToLocalStorage(book) {
    let arr = JSON.parse(localStorage.getItem("publishedBooks") || "[]");
    arr.push(book); // duplicates allowed
    localStorage.setItem("publishedBooks", JSON.stringify(arr));
  }

  function loadImage(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      currentImage = reader.result;
      preview.src = currentImage;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }

  dropArea.addEventListener("click", () => fileInput.click());
  dropArea.addEventListener("dragover", e => { e.preventDefault(); dropArea.classList.add("dragover"); });
  dropArea.addEventListener("dragleave", () => dropArea.classList.remove("dragover"));
  dropArea.addEventListener("drop", e => {
    e.preventDefault();
    dropArea.classList.remove("dragover");
    loadImage(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener("change", e => loadImage(e.target.files[0]));

  form.addEventListener("submit", e => {
    e.preventDefault();

    if (!titleInput.value.trim()) return msg("Title is required.");

    const book = {
      title: titleInput.value.trim(),
      author: authorInput.value.trim(),
      genre: genreInput.value.trim(),
      date: dateInput.value,
      description: descInput.value.trim(),
      imageData: currentImage,
      hidden: false // default visible in catalog
    };

    if (editingIndex === null) {
      scheduledBooks.push(book);
      msg("Added to schedule.");
    } else {
      scheduledBooks[editingIndex] = book;
      editingIndex = null;
      addBtn.textContent = "Add to Schedule";
      msg("Book updated.");
    }

    clearForm(false);
    renderSchedule();
  });

  function clearForm(reset = true) {
    titleInput.value = "";
    authorInput.value = "";
    genreInput.value = "";
    dateInput.value = "";
    descInput.value = "";
    currentImage = "";
    preview.style.display = "none";
    fileInput.value = "";
    if (reset) {
      editingIndex = null;
      addBtn.textContent = "Add to Schedule";
    }
  }

  clearBtn.addEventListener("click", () => clearForm());

  scheduleList.addEventListener("click", e => {
    const btn = e.target;
    const item = btn.closest(".schedule-item");
    if (!item) return;

    const index = Number(item.dataset.index);
    const book = scheduledBooks[index];

    // PUBLISH
    if (btn.classList.contains("btn-publish")) {
      const publishBook = { ...book, hidden: false };
      addToLocalStorage(publishBook);
      msg("Published to catalog.");
      renderSchedule();
    }

    // EDIT
    else if (btn.classList.contains("btn-edit")) {
      editingIndex = index;
      titleInput.value = book.title;
      authorInput.value = book.author;
      genreInput.value = book.genre;
      dateInput.value = book.date;
      descInput.value = book.description;

      currentImage = book.imageData || "";
      if (currentImage) {
        preview.src = currentImage;
        preview.style.display = "block";
      }

      addBtn.textContent = "Update Book";
      form.scrollIntoView({ behavior: "smooth" });
    }

    // DELETE
    else if (btn.classList.contains("btn-delete")) {
      scheduledBooks.splice(index, 1);
      msg("Deleted.");
      renderSchedule();
    }

    // HIDE (hide from catalog)
    else if (btn.classList.contains("btn-hide")) {
      let published = JSON.parse(localStorage.getItem("publishedBooks") || "[]");

      published = published.map(p => {
        if (p.title === book.title) p.hidden = true;
        return p;
      });

      localStorage.setItem("publishedBooks", JSON.stringify(published));

      msg("Hidden from catalog.");
    }
  });

  // DELETE ALL PUBLISHED
  document.getElementById("delete-all-published").addEventListener("click", () => {
    if (confirm("Delete ALL published books?")) {
      localStorage.removeItem("publishedBooks");
      msg("All published books deleted.");
    }
  });

  renderSchedule();
});
