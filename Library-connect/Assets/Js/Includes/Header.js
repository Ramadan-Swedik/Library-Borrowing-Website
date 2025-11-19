// loads includes/header.html into #header
fetch("includes/header.html")
  .then(r => r.ok ? r.text() : Promise.reject("Header not found"))
  .then(html => {
    document.getElementById("header").innerHTML = html;

    // Theme toggle logic
    const toggle = document.getElementById("theme-toggle");
    const icon = document.getElementById("theme-icon");
    
    if (toggle && icon) {
      // Check if dark mode was already saved or active
      if (document.body.classList.contains("dark")) {
         icon.src = "assets/images/Sun.png";
      }

      toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        
        // Swap the image source based on mode
        if (document.body.classList.contains("dark")) {
            icon.src = "/Library-connect/Assets/Images/Icons/Sun.png";
        } else {
            icon.src = "/Library-connect/Assets/Images/Icons/Moon.png";
        }
      });
    }
  })
  .catch(console.error);