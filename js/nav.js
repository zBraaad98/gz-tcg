function Menu(e) {
  const list = e.closest("nav").querySelector("ul");
  const isClosed = e.name === "menu";
  e.name = isClosed ? "close-outline" : "menu";
  list.classList.toggle("-translate-x-full", !isClosed);
  list.classList.toggle("translate-x-0", isClosed);
  list.classList.toggle("opacity-100", isClosed);
}

function initMenu() {
  document.querySelectorAll("nav").forEach((nav) => {
    const list = nav.querySelector("ul");
    const icon = nav.querySelector("ion-icon");
    if (!list || !icon) return;

    if (window.innerWidth >= 768) {
      list.classList.remove("-translate-x-full", "opacity-0");
      list.classList.add("translate-x-0", "opacity-100");
      icon.name = "menu";
    } else {
      list.classList.add("-translate-x-full", "opacity-0");
      list.classList.remove("translate-x-0", "opacity-100");
      icon.name = "menu";
    }
  });
}

window.addEventListener("DOMContentLoaded", initMenu);
window.addEventListener("resize", initMenu);
