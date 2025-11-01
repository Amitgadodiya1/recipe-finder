// const API = "http://localhost:3001/api/doubts";
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://recipe-finder-2d56.onrender.com";

// 🔍 Detect if recipeId exists in URL
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("recipeId");

// 🧠 Adjust API endpoint dynamically
const fetchUrl = recipeId
  ? `${BASE_URL}/api/doubts/${recipeId}`
  : `${BASE_URL}/api/doubts`;

// ✅ Add this back (used for POST, reply, vote)
const API = `${BASE_URL}/api/doubts`;

// 🧭 Mode label
const modeLabel = recipeId ? "Recipe-specific" : "Global";

async function loadRecipes() {
  try {
    const res = await fetch("http://localhost:3001/api/recipes");
    const result = await res.json();

    // check if API returns paginated structure
    const recipes = Array.isArray(result) ? result : result.data || [];

    console.log("📦 Recipes loaded:", recipes);

    const select = document.getElementById("recipeSelect");
    select.innerHTML = `<option value="">🧂 Select a recipe (optional)</option>`; // reset first

    recipes.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r._id;
      opt.textContent = r.name;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Error loading recipes:", err);
  }
}

loadRecipes();

// Load doubts
async function loadDoubts() {
  const list = document.getElementById("doubtList");
  list.innerHTML = `<p class="text-gray-400 text-center animate-pulse">Loading ${modeLabel} doubts...</p>`;

  try {
    const res = await fetch(fetchUrl);
    const doubts = await res.json();

    if (!doubts.length) {
      list.innerHTML = `<p class="text-gray-500 text-center">No doubts yet. ${
        recipeId
          ? "Be the first to ask about this recipe!"
          : "Be the first to post a question!"
      }</p>`;
      return;
    }

    // Render
    list.innerHTML = doubts
      .map(
        (d) => `
      <div class="doubt-card">
        <h3 class="font-bold text-lg mb-1">${d.title}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-3">${d.description}</p>
        ${
          d.recipeId
            ? `<p class="text-sm text-pink-500 mb-2">🍽 Linked Recipe: <b>${d.recipeId}</b></p>`
            : ""
        }
        <p class="text-sm text-gray-500 mb-3">By: <b>${
          d.name || "Anonymous"
        }</b></p>

        <div class="flex gap-3 mb-4">
          <button onclick="vote('${d._id}', 'doubt', 'upvote')" class="vote-btn">👍 ${
          d.upvotes
        }</button>
          <button onclick="vote('${d._id}', 'doubt', 'downvote')" class="vote-btn">👎 ${
          d.downvotes
        }</button>
        </div>

        <div class="reply-block space-y-2">
          ${(d.replies || [])
            .map(
              (r) => `
              <p class="text-sm">${r.replyText} – <b>${r.name || "Anonymous"}</b>
                <button onclick="vote('${r._id}', 'reply', 'upvote')" class="vote-btn text-xs ml-2">👍 ${
                  r.upvotes
                }</button>
                <button onclick="vote('${r._id}', 'reply', 'downvote')" class="vote-btn text-xs">👎 ${
                  r.downvotes
                }</button>
              </p>
            `
            )
            .join("")}
        </div>

        <form onsubmit="addReply(event, '${d._id}')" class="mt-3 flex gap-2 flex-col sm:flex-row">
          <input name="name" placeholder="Your name (optional)" class="flex-1 border rounded-full px-4 py-1 dark:bg-[#2a2a2a]" />
          <input name="replyText" placeholder="Write a reply..." required class="flex-1 border rounded-full px-4 py-1 dark:bg-[#2a2a2a]" />
          <button type="submit" class="bg-[#e63946] text-white rounded-full px-4 py-1 text-sm hover:bg-[#d62839] transition">Reply</button>
        </form>
      </div>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    list.innerHTML = `<p class="text-red-500 text-center">Error loading doubts ❌</p>`;
  }
}

// 📝 Post doubt
document.getElementById("doubtForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  data.recipeId = recipeId; // ✅ Add only if exists

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  e.target.reset();
  loadDoubts();
});



// Add reply (no login)
async function addReply(e, doubtId) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  await fetch(`${API}/${doubtId}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  e.target.reset();
  loadDoubts();
}

// Voting
async function vote(targetId, targetType, voteType) {
  await fetch(`${API}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetType, targetId, voteType }),
  });
  loadDoubts();
}
// Load recipe list for dropdown

loadDoubts();
