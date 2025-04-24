document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".sidebar a");
  const sections = document.querySelectorAll("main section");

  // Scroll suave
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      window.scrollTo({
        top: targetSection.offsetTop - 20,
        behavior: "smooth"
      });
    });
  });

  // Destaque da seção ativa na sidebar
  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    links.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  });

  // Estilo visual para link ativo
  const style = document.createElement("style");
  style.textContent = `
    .sidebar a.active {
      color: #00ff99;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);
});
