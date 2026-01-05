function Menu(e) {
  const list = document.querySelector("ul");

  // Check if menu is closed
  const isClosed = e.name === "menu";

  // Toggle icon and menu
  e.name = isClosed ? "close-outline" : "menu";
  list.classList.toggle("-translate-x-full", !isClosed);
  list.classList.toggle("translate-x-0", isClosed);
  list.classList.toggle("opacity-100", isClosed);
}

// Initialize menu state on page load and resize
function initMenu() {
  const list = document.querySelector("ul");
  const icon = document.querySelector("ion-icon");

  if (window.innerWidth >= 768) {
    // Desktop: menu always visible
    list.classList.remove("-translate-x-full", "opacity-0");
    list.classList.add("translate-x-0", "opacity-100");
    icon.name = "menu"; // icon always menu on desktop
  } else {
    // Mobile: menu starts hidden
    list.classList.add("-translate-x-full", "opacity-0");
    list.classList.remove("translate-x-0", "opacity-100");
    icon.name = "menu";
  }
}

// Run on page load
window.addEventListener("DOMContentLoaded", initMenu);
// Run on window resize
window.addEventListener("resize", initMenu);

const track = document.querySelector(".ticker-track");

track.innerHTML += track.innerHTML;

function startTicker() {
  const items = [...track.children];
  let totalWidth = 0;

  items.forEach((item) => {
    totalWidth += item.offsetWidth;
  });

  gsap.set(track, { x: 0 });

  gsap.to(track, {
    x: -totalWidth,
    duration: 50,
    ease: "linear",
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
    },
  });
}

// Wait for fonts + layout
window.addEventListener("load", startTicker);

// swiper
const swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 24,
  centeredSlides: true,
  grabCursor: true,
  loop: true,
  autoplay: {
    delay: 4000,
    pauseOnMouseEnter: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },

    1024: {
      slidesPerView: 3,
    },
  },
});

// GSAP for hero
gsap.from(".hero-text > *", {
  opacity: 0,
  y: 24,
  duration: 1,
  stagger: 0.12,
  ease: "power3.out",
});

gsap.from(".hero-card", {
  opacity: 0,
  y: 40,
  duration: 1.2,
  ease: "power3.out",
  delay: 0.2,
});

gsap.from(".hero-cta", {
  opacity: 0,
  duration: 0.6,
  ease: "power2.out",
  delay: 0.6,
});

// fade in sections
gsap.utils.toArray(".fade-in").forEach((section) => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      once: true,
    },
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: "power2.out",
  });
});
