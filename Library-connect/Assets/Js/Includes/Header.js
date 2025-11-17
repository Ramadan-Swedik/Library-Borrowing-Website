// loads includes/header.html into #header
fetch("includes/header.html")
  .then(r => r.ok ? r.text() : Promise.reject("Header not found"))
  .then(html => {
    document.getElementById("header").innerHTML = html;
    // hook: make header search focus transfer to catalog page search if needed
    const hs = document.getElementById("global-search");
    if (hs) {
      hs.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          // simple behavior: go to catalog and add query param (optional)
          const q = hs.value.trim();
          if (q) location.href = `catalog.html?search=${encodeURIComponent(q)}`;
        }
      });
    }
  })
  .catch(console.error);
