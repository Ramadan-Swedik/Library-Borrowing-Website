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
    setTimeout(() => {
      message.style.display = "none";
    }, 2000);
  }

  function loadSchedule() {
    try {
      const raw = localStorage.getItem("scheduledBooks");
      scheduledBooks = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(scheduledBooks)) scheduledBooks = [];
    } catch {
      scheduledBooks = [];
    }
  }

  function saveSchedule() {
    localStorage.setItem("scheduledBooks", JSON.stringify(scheduledBooks));
  }

  function addToLocalStorage(book) {
    let arr;
    try {
      const raw = localStorage.getItem("publishedBooks");
      arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) arr = [];
    } catch {
      arr = [];
    }

    arr.push(book);
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

  function renderSchedule() {
    scheduleList.innerHTML = "";

    if (!scheduledBooks.length) {
      scheduleList.innerHTML = `<p style="font-size:13px;color:#6e5950;">No books scheduled.</p>`;
      return;
    }

    scheduledBooks.forEach((b, i) => {
      const item = document.createElement("div");
      item.className = "schedule-item";
      item.dataset.index = i;

      const imgSrc = b.imageData || "Assets/Images/book-placeholder.jpg";

      item.innerHTML = `
        <img src="${imgSrc}" class="schedule-thumb">

        <div class="schedule-main">
          <h3>${b.title}</h3>
          <p class="meta">${b.author} • ${b.genre}</p>
          <p class="desc">${b.description}</p>
          <p class="date">${b.date}</p>
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

    const title = titleInput.value.trim();
    if (!title) return msg("Title is required.");

    const book = {
      title,
      author: authorInput.value.trim(),
      genre: genreInput.value.trim(),
      date: dateInput.value,
      description: descInput.value.trim(),
      imageData: currentImage
    };

    if (editingIndex === null) {
      scheduledBooks.push(book);
    } else {
      scheduledBooks[editingIndex] = book;
      editingIndex = null;
      addBtn.textContent = "Add to Schedule";
    }

    saveSchedule();
    clearForm(false);
    msg("Book saved to schedule.");
    renderSchedule();
  });

  clearBtn.addEventListener("click", () => clearForm(true));

  scheduleList.addEventListener("click", e => {
    const btn = e.target;
    const item = btn.closest(".schedule-item");
    if (!item) return;

    const index = Number(item.dataset.index);
    const book = scheduledBooks[index];

    if (btn.classList.contains("btn-publish")) {
      const publishBook = { ...book, hidden: false };
      addToLocalStorage(publishBook);
      msg("Published to catalog.");
    }

    else if (btn.classList.contains("btn-edit")) {
      editingIndex = index;
      titleInput.value = book.title;
      authorInput.value = book.author;
      genreInput.value = book.genre;
      dateInput.value = book.date;
      descInput.value = book.description;
      currentImage = book.imageData;

      if (currentImage) {
        preview.src = currentImage;
        preview.style.display = "block";
      }

      addBtn.textContent = "Update Book";
      form.scrollIntoView({ behavior: "smooth" });
    }

    else if (btn.classList.contains("btn-delete")) {
      scheduledBooks.splice(index, 1);
      saveSchedule();
      renderSchedule();
      msg("Deleted from schedule.");
    }

    else if (btn.classList.contains("btn-hide")) {
      let published = JSON.parse(localStorage.getItem("publishedBooks") || "[]");

      published = published.map(p => {
        if (p.title === book.title) return { ...p, hidden: true };
        return p;
      });

      localStorage.setItem("publishedBooks", JSON.stringify(published));
      msg("Hidden from catalog.");
    }
  });

  loadSchedule();
  renderSchedule();
});
