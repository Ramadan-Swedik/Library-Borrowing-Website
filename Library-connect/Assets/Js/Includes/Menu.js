// loads includes/menu.html into #menu
fetch("includes/menu.html")
  .then(r => r.ok ? r.text() : Promise.reject("Menu not found"))
  .then(html => {
    document.getElementById("menu").innerHTML = html;
    // optional: small tooltip or aria update can be added here
  })
  .catch(console.error);
