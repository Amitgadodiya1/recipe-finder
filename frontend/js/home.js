// 🌟 1. Load Recipe of the Day


const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "";
async function loadRecipeOfTheDay() {
  const res = await fetch(`${BASE_URL}/api/recipes/random`);
  const recipe = await res.json();

  const section = document.getElementById("recipe-of-day");
  section.innerHTML = `
    <div class="relative w-full h-full">
      <img src="${recipe.image}" alt="${recipe.name}" class="w-full h-full object-contain opacity-90"/>
      <div class="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white">
        <h2 class="text-2xl font-bold mb-1">${recipe.name}</h2>
        <p class="text-sm mb-3">${recipe.description}</p>
        <button onclick="openQuickView(${JSON.stringify(recipe).replace(/"/g, "&quot;")})"
          class="self-start bg-[#e63946] text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-[#d62839] transition">
          View Recipe →
        </button>
      </div>
    </div>`;
}

// ⭐ 2. Load Popular Recipes
async function loadPopularRecipes(searchTerm = "", cuisine = "", maxTime = "") {
  const res = await fetch(`${BASE_URL}/api/recipes/popular`);
  let recipes = await res.json();

  recipes = recipes.filter(r =>
    (!searchTerm || r.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!cuisine || r.cuisine === cuisine) &&
    (!maxTime || r.time.total_minutes <= parseInt(maxTime))
  );

  const container = document.getElementById("popular-container");
  container.innerHTML = recipes.map(r => `
    <div class="bg-white rounded-xl shadow-md hover:shadow-lg p-4 transition-all cursor-pointer"
      onclick='openQuickView(${JSON.stringify(r).replace(/"/g, "&quot;")})'>
      <img src="${r.image}" class="w-full aspect-video rounded-lg object-cover mb-2"/>
      <p class="font-semibold">${r.name}</p>
      <p class="text-sm text-gray-600 line-clamp-2">${r.description}</p>
      <div class="flex justify-between mt-2 text-xs text-gray-500">
        <span>❤️ ${r.likes || 0}</span>
        <span>⭐ ${r.averageRating || 4.5}</span>
      </div>
    </div>`).join("");
}

// 🍳 3. Quick View Modal
function openQuickView(recipe) {
  document.getElementById("modal-img").src = recipe.image;
  document.getElementById("modal-name").textContent = recipe.name;
  document.getElementById("modal-desc").textContent = recipe.description;
  document.getElementById("modal-time").textContent = `⏱️ Total Time: ${recipe.time?.total_minutes || 0} mins`;
  document.getElementById("view-btn").onclick = () => {
    window.location.href = `./recipe-details?id=${recipe._id}`;
  };
  document.getElementById("quick-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("quick-modal").classList.add("hidden");
}

// 🔍 Filters & Initialization
document.addEventListener("DOMContentLoaded", () => {
  loadRecipeOfTheDay();
  loadPopularRecipes();

  document.getElementById("searchInput").addEventListener("input", e => {
    loadPopularRecipes(e.target.value,
      document.getElementById("filter-cuisine").value,
      document.getElementById("filter-time")?.value);
  });

  document.getElementById("filter-cuisine").addEventListener("change", () => {
    loadPopularRecipes(document.getElementById("searchInput").value,
      document.getElementById("filter-cuisine").value,
      document.getElementById("filter-time")?.value);
  });
});
