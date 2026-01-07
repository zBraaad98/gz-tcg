function Menu(e) {
  const list = document.querySelector("ul");
  const isClosed = e.name === "menu";
  e.name = isClosed ? "close-outline" : "menu";
  list.classList.toggle("-translate-x-full", !isClosed);
  list.classList.toggle("translate-x-0", isClosed);
  list.classList.toggle("opacity-100", isClosed);
}

function initMenu() {
  const list = document.querySelector("ul");
  const icon = document.querySelector("ion-icon");

  if (window.innerWidth >= 768) {
    list.classList.remove("-translate-x-full", "opacity-0");
    list.classList.add("translate-x-0", "opacity-100");
    icon.name = "menu";
  } else {
    list.classList.add("-translate-x-full", "opacity-0");
    list.classList.remove("translate-x-0", "opacity-100");
    icon.name = "menu";
  }
}

window.addEventListener("DOMContentLoaded", initMenu);
window.addEventListener("resize", initMenu);

/* TICKER */
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

window.addEventListener("load", startTicker);

/* GSAP HERO & Fade-ins */
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
gsap.utils.toArray(".fade-in").forEach((section) => {
  gsap.from(section, {
    scrollTrigger: { trigger: section, start: "top 80%", once: true },
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: "power2.out",
  });
});

const sheetURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-u5xYfomi5OLBrgnkd3tlyNQF7EstVHIlxVjm_34DmqfPcqHVk8xuIf020k5wUfJGkCAXJU1WCB5w/pub?output=csv";
const swiperWrapper = document.getElementById("cards-wrapper");

async function loadCardsFromSheet() {
  try {
    const res = await fetch(sheetURL);
    const csvText = await res.text();

    // CSV into an array
    const rows = csvText
      .trim()
      .split("\n")
      .map((row) => row.split(","));

    // starting from the second row (index 1)
    rows.slice(1).forEach((row) => {
      const title = row[0] || ""; // Card title

      // Get the image URL directly from Cloudinary and apply resizing (w_600,h_800)
      let image = row[1] || ""; // Cloudinary image URL
      if (!image) {
        console.warn(`No image URL found for: ${title}`);
        return;
      }

      // Modify the Cloudinary URL to resize images dynamically
      image = image.replace(
        "/upload/",
        "/upload/w_600,h_800,c_fill,q_auto,f_auto/"
      );

      const price = row[2] || ""; // Price
      const grade = row[3] || ""; // Grade
      const link = row[4] || "#"; // Link to eBay or other platform

      // Create the slide element
      const slide = document.createElement("div");
      slide.className =
        "swiper-slide relative flex items-center justify-center h-64 rounded-xl overflow-hidden shadow-lg";

      // Create image element using the modified Cloudinary URL
      const imgElement = document.createElement("img");
      imgElement.setAttribute("src", image);
      imgElement.setAttribute("alt", title);
      imgElement.classList.add(
        "h-full",
        "w-full",
        "object-cover",
        "transition-transform",
        "duration-300"
      );

      slide.appendChild(imgElement);

      // Add the overlay content
      slide.innerHTML += `
        <div class="card-overlay absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300">
          <div class="p-4 w-full text-white">
            <h3 class="text-lg font-semibold">${title}</h3>
            <div class="flex justify-between text-sm mt-1">
              <span class="bg-white/20 px-2 py-0.5 rounded">${grade}</span>
              <span class="font-bold">£${price}</span>
            </div>
            <a href="${link}" target="_blank" class="mt-3 block text-center bg-hover hover:bg-[#354c64] rounded py-2 text-sm">
              View on eBay
            </a>
          </div>
        </div>
      `;

      swiperWrapper.appendChild(slide);
    });

    // Reinitialize swiper after slides are added
    new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      centeredSlides: true,
      grabCursor: true,
      loop: true,
      autoplay: { delay: 4000, pauseOnMouseEnter: true },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
    });
  } catch (error) {
    console.error("Error loading cards:", error);
  }
}

// Start loading cards
loadCardsFromSheet();
