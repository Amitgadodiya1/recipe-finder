// 🌟 Show toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}

// 🧠 Load feedback list
async function loadFeedback() {
  const container = document.getElementById("feedback-list");
  container.innerHTML =
    '<p class="text-sm text-gray-400 italic">Loading feedback...</p>';

  try {
    const res = await fetch("http://localhost:3000/api/feedback");
    const feedbacks = await res.json();

    if (!feedbacks.length) {
      container.innerHTML =
        '<p class="text-gray-400 italic text-sm">No feedback yet. Be the first to share!</p>';
      return;
    }

    container.innerHTML = feedbacks
      .map(
        (f) => `
      <div class="feedback-item">
        <p class="message text-sm">${f.message}</p>
        <small class="date text-xs text-[#8b5b5c]">
          ${new Date(f.createdAt).toLocaleString()}
        </small>
      </div>`
      )
      .join("");
  } catch (err) {
    console.error("Error loading feedback:", err);
    container.innerHTML =
      '<p class="text-red-500 text-sm">Failed to load feedback.</p>';
  }
}

// ✍️ Submit feedback
async function submitFeedback() {
  const textarea = document.getElementById("feedback-input");
  const message = textarea.value.trim();

  if (!message) {
    showToast("Please enter your feedback!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) throw new Error("Failed to submit feedback");

    textarea.value = "";
    await loadFeedback();
    showToast("🎉 Feedback submitted successfully!");
  } catch (err) {
    console.error("Error submitting feedback:", err);
    showToast("❌ Something went wrong!");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submit-btn").addEventListener("click", submitFeedback);
  loadFeedback();
});
