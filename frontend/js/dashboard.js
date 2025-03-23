import { renderAuthPage, currentUser } from "./auth.js";
import { renderBatchPage } from "./batch.js";
import { renderEggPage } from "./eggs.js";
import { renderFeedsPage } from "./feeds.js";
import { renderMedicinePage } from "./medicine.js";
import { signOut } from "./auth.js";
import { apiCall } from "./api.js";

export function renderDashboard() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div id="dashboard" class="card">
      <nav class="nav">
        <button id="nav-batch" class="nav-btn">Batch</button>
        <button id="nav-eggs" class="nav-btn">Eggs</button>
        <button id="nav-feeds" class="nav-btn">Feeds</button>
        <button id="nav-medicine" class="nav-btn">Medicine</button>
        <button id="nav-signout" class="nav-btn">Sign Out</button>
      </nav>
      <div id="dashboard-content"></div>
    </div>
  `;
  document.getElementById("nav-batch").addEventListener("click", renderBatchPage);
  document.getElementById("nav-eggs").addEventListener("click", renderEggPage);
  document.getElementById("nav-feeds").addEventListener("click", renderFeedsPage);
  document.getElementById("nav-medicine").addEventListener("click", renderMedicinePage);
  document.getElementById("nav-signout").addEventListener("click", signOut);
  // Default page
  renderBatchPage();
}

export async function initializeApp() {
  try {
    // Check for an existing session via the cookie.
    const user = await apiCall("http://localhost:3000/api/user/me", { method: "GET" });
    // Set the global user state.
    currentUser = user;
    renderDashboard();
  } catch (err) {
    // No valid session: render the authentication page.
    renderAuthPage();
  }
}
