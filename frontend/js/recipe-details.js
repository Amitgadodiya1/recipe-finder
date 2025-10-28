const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "";
const recipeId = new URLSearchParams(window.location.search).get("id");

// 🍲 Fetch recipe details
async function fetchRecipeDetails() {
  try {
    const res = await fetch(`${BASE_URL}/api/recipes/${recipeId}`);
    const recipe = await res.json();

    const container = document.getElementById("recipe-details");
    container.innerHTML = `
      <div class="bg-white shadow-md rounded-xl overflow-hidden">
        <img src="${recipe.image}" alt="${recipe.name}" class="w-full h-80 object-cover" />

        <div class="p-6 text-left">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-3xl font-bold">${recipe.name}</h2>
            <button id="like-btn"
              class="px-4 py-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition">
              ❤️ ${recipe.likes || 0}
            </button>
          </div>

          <p class="text-gray-600 mb-3">${recipe.description}</p>

          <div class="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
            <span>🍽️ Cuisine: ${recipe.cuisine}</span>
            <span>📂 Category: ${recipe.category}</span>
            <span>⏱️ ${recipe.time?.total_minutes || 0} mins</span>
          </div>

          <h3 class="font-semibold text-pink-600 mb-2 text-lg">Procedure:</h3>
          <ul class="list-disc pl-6 text-gray-700 space-y-2">
            ${recipe.procedure.map(step => `<li>${step}</li>`).join("")}
          </ul>

          <div class="mt-6 flex flex-wrap gap-3">
            <button onclick="shareRecipe('${recipe.name}')"
              class="bg-[#e63946] text-white px-5 py-2 rounded-full hover:bg-[#d62839] transition">
              🔗 Share
            </button>
            <a href="./recipe.html"
              class="border border-pink-500 text-pink-600 px-5 py-2 rounded-full hover:bg-pink-50 transition">
              ← Back to Recipes
            </a>
          </div>
        </div>
      </div>
    `;

    // Add like button listener
    document.getElementById("like-btn").addEventListener("click", () => likeRecipe(recipeId));
  } catch (err) {
    console.error(err);
    document.getElementById("recipe-details").innerHTML =
      `<p class="text-center text-red-500">Failed to load recipe.</p>`;
  }
}

// ⭐ Fetch related recipes
async function fetchRelatedRecipes() {
  try {
    const res = await fetch(`${BASE_URL}/api/recipes/${recipeId}/related`);
    const related = await res.json();

    const container = document.getElementById("related-container");
    if (!related.length) {
      container.innerHTML = `<p class='col-span-full text-center text-gray-400'>No related recipes found.</p>`;
      return;
    }

    container.innerHTML = related.map(r => `
      <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.02] cursor-pointer"
        onclick="window.location.href='./recipe-details.html?id=${r._id}'">
        <img src="${r.image}" alt="${r.name}" class="w-full aspect-video object-contain rounded-t-xl" />
        <div class="p-4">
          <h4 class="font-semibold truncate">${r.name}</h4>
          <p class="text-sm text-gray-600 line-clamp-2">${r.description}</p>
        </div>
      </div>
    `).join("");
  } catch (err) {
    console.error("Error fetching related recipes:", err);
  }
}

// ❤️ Like recipe
async function likeRecipe(id) {
  let liked = JSON.parse(localStorage.getItem("liked") || "[]");
  if (liked.includes(id)) return alert("Already liked ❤️");

  const res = await fetch(`${BASE_URL}/api/recipes/${id}/like`, { method: "POST" });
  const updated = await res.json();

  liked.push(id);
  localStorage.setItem("liked", JSON.stringify(liked));

  const btn = document.getElementById("like-btn");
  btn.innerHTML = `❤️ ${updated.likes}`;
  btn.classList.add("like-anim");
  setTimeout(() => btn.classList.remove("like-anim"), 300);
}

// 🔗 Share recipe
function shareRecipe(name) {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: name, url });
  } else {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  }
}

// 🚀 Init
document.addEventListener("DOMContentLoaded", () => {
  fetchRecipeDetails();
  fetchRelatedRecipes();
});
