// 📱 Mobile menu toggle
const mobileMenu = document.getElementById("mobile-menu");
document.getElementById("menu-btn").addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

let allRecipes = [];
let page = 1;

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "";

// 🍳 Fetch recipes with pagination
async function fetchRecipes(loadMore = false) {
  const res = await fetch(`${BASE_URL}/api/recipes?page=${page}&limit=8`);
  const data = await res.json();
  const recipesArray = Array.isArray(data) ? data : data.data || [];

  allRecipes = loadMore ? [...allRecipes, ...recipesArray] : recipesArray;
  renderRecipes(groupByCuisine(allRecipes));
}

// 📊 Group recipes by cuisine
function groupByCuisine(recipes) {
  return recipes.reduce((acc, r) => {
    (acc[r.cuisine] = acc[r.cuisine] || []).push(r);
    return acc;
  }, {});
}

// 🖼️ Render grouped recipes
function renderRecipes(grouped) {
  const container = document.getElementById("recipes-container");
  container.innerHTML = "";

  const cuisines = Object.keys(grouped);
  if (!cuisines.length) {
    container.innerHTML = `<p class="col-span-full text-center text-gray-500 py-8">No recipes found 😔</p>`;
    return;
  }

  cuisines.forEach(cuisine => {
    const section = document.createElement("section");
    section.className = "mb-10";
    section.innerHTML = `
      <h3 class="text-xl font-bold mb-3 border-l-4 border-pink-400 pl-2">${cuisine}</h3>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
        ${grouped[cuisine].map(recipe => recipeCard(recipe)).join("")}
      </div>
    `;
    container.appendChild(section);
  });
}

// 🍔 Single recipe card
function recipeCard(recipe) {
  return `
    <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.02] cursor-pointer group"
         onclick='openModal(${JSON.stringify(recipe).replace(/"/g, "&quot;")})'>
      <div class="w-full aspect-video overflow-hidden rounded-t-xl">
        <img src="${recipe.image}" alt="${recipe.name}"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div class="p-4 flex flex-col justify-between h-[160px]">
        <div>
          <h4 class="font-semibold text-[#1b0e0e] truncate">${recipe.name}</h4>
          <p class="text-sm text-gray-600 mt-1 line-clamp-2">${recipe.description}</p>
        </div>
        <div class="flex justify-between items-center mt-3">
          <span class="text-xs text-gray-400">${recipe.category}</span>
          <span class="text-xs text-gray-400">⏱️ ${recipe.time?.total_minutes || 0} mins</span>
        </div>
        <div class="flex justify-between items-center mt-3">
          <button onclick="event.stopPropagation(); likeRecipe('${recipe._id}', this)"
                  class="text-sm px-3 py-1 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 flex items-center gap-1 transition">
            ❤️ <span>${recipe.likes || 0}</span>
          </button>
        </div>
      </div>
    </div>`;
}

// ❤️ Like recipe
async function likeRecipe(id, btn) {
  let liked = JSON.parse(localStorage.getItem("liked") || "[]");
  if (liked.includes(id)) return alert("Already liked ❤️");

  btn.classList.add("like-anim");
  const res = await fetch(`${BASE_URL}/api/recipes/${id}/like`, { method: "POST" });
  const updated = await res.json();

  liked.push(id);
  localStorage.setItem("liked", JSON.stringify(liked));

  btn.querySelector("span").textContent = updated.likes;
  setTimeout(() => btn.classList.remove("like-anim"), 300);
}

// 🍰 Modal open/close
function openModal(recipe) {
  document.getElementById("modal-image").src = recipe.image;
  document.getElementById("modal-name").textContent = recipe.name;
  document.getElementById("modal-category").textContent = recipe.category || recipe.cuisine;

  const list = document.getElementById("modal-procedure");
  list.innerHTML = recipe.procedure.map(step => `<li>${step}</li>`).join("");

  document.getElementById("view-recipe-btn").onclick = () => {
    window.location.href = `./recipe-details?id=${recipe._id}`;
  };

  document.getElementById("recipe-modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("recipe-modal").classList.add("hidden");
  document.body.style.overflow = "";
}

// 🔎 Search and Filters
let searchTimeout;
document.getElementById("searchInput").addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const term = e.target.value.toLowerCase();
    const filtered = allRecipes.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.cuisine.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term)
    );
    renderRecipes(groupByCuisine(filtered));
  }, 300);
});

document.getElementById("filter-cuisine").addEventListener("change", e => {
  const cuisine = e.target.value;
  const filtered = allRecipes.filter(r => !cuisine || r.cuisine === cuisine);
  renderRecipes(groupByCuisine(filtered));
});

document.getElementById("filter-category").addEventListener("change", e => {
  const category = e.target.value;
  const filtered = allRecipes.filter(r => !category || r.category === category);
  renderRecipes(groupByCuisine(filtered));
});

document.getElementById("load-more").addEventListener("click", () => {
  page++;
  fetchRecipes(true);
});

// 🚀 Init
document.addEventListener("DOMContentLoaded", async () => {
  const cuisine = new URLSearchParams(window.location.search).get("cuisine");
  await fetchRecipes();

  if (cuisine) {
    const filtered = allRecipes.filter((r) => r.cuisine === cuisine);
    renderRecipes(groupByCuisine(filtered));
  }
});
