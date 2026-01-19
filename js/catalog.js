const sheetURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-u5xYfomi5OLBrgnkd3tlyNQF7EstVHIlxVjm_34DmqfPcqHVk8xuIf020k5wUfJGkCAXJU1WCB5w/pub?output=csv";

const grid = document.getElementById("catalog-grid");
const searchInput = document.getElementById("searchInput");

const CARDS_PER_PAGE = 12;
let currentPage = 1;
let allCards = [];
let filteredCards = [];

// Fetch & prepare data

async function loadCatalog() {
  try {
    const res = await fetch(sheetURL);
    const csvText = await res.text();

    const rows = csvText
      .trim()
      .split("\n")
      .map((row) => row.split(","));

    allCards = rows.slice(1).map((row) => ({
      title: row[0] || "",
      image: row[1] || "",
      price: row[2] || "",
      grade: row[3] || "",
      link: row[4] || "#",
    }));

    filteredCards = allCards;
    render();
  } catch (err) {
    console.error("Error loading catalog:", err);
  }
}

// Render cards

function render() {
  grid.innerHTML = "";

  const start = (currentPage - 1) * CARDS_PER_PAGE;
  const end = start + CARDS_PER_PAGE;
  const pageCards = filteredCards.slice(start, end);

  pageCards.forEach((card) => {
    if (!card.image) return;

    const image = card.image.replace(
      "/upload/",
      "/upload/w_400,h_550,c_fill,q_auto,f_auto/"
    );

    const div = document.createElement("div");
    div.className =
      "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col";

    div.innerHTML = `
      <img
        src="${image}"
        alt="${card.title}"
        class="w-full h-72 object-cover bg-gray-100"
      />

      <div class="p-4 flex flex-col flex-1">
        <h3 class="text-sm font-semibold mb-2 line-clamp-2">
          ${card.title}
        </h3>

        <div class="flex items-center justify-between mb-4 text-sm">
          <span class="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
            ${card.grade}
          </span>
          <span class="font-semibold text-gray-900">
            £${card.price}
          </span>
        </div>

        <a
          href="${card.link}"
          target="_blank"
          class="mt-auto block text-center bg-accent text-white py-2 rounded-md hover:bg-hover transition text-sm font-medium"
        >
          View on eBay
        </a>
      </div>
    `;

    grid.appendChild(div);
  });

  renderPagination();
}

// Pagination UI

function renderPagination() {
  let pagination = document.getElementById("pagination");

  if (!pagination) {
    pagination = document.createElement("div");
    pagination.id = "pagination";
    pagination.className = "flex justify-center gap-2 mt-10";
    grid.after(pagination);
  }

  pagination.innerHTML = "";

  const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `
      px-3 py-1 rounded text-sm
      ${
        i === currentPage
          ? "bg-accent text-white"
          : "bg-gray-200 hover:bg-gray-300"
      }
    `;

    btn.onclick = () => {
      currentPage = i;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    pagination.appendChild(btn);
  }
}

// Search

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();

  filteredCards = allCards.filter((card) =>
    card.title.toLowerCase().includes(query)
  );

  currentPage = 1;
  render();
});

loadCatalog();
