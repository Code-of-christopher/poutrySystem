import { apiCall } from "./api.js";
import { renderDashboard } from "./dashboard.js";

export let currentUser = null;

export function renderAuthPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div id="auth-page" class="card">
      <h1>Poultry Management System</h1>
      <div class="auth-controls">
        <button id="show-signin" class="btn">Sign In</button>
        <button id="show-signup" class="btn">Sign Up</button>
      </div>
      <div id="auth-container"></div>
      <p id="auth-message" class="message"></p>
    </div>
  `;
  document.getElementById("show-signin").addEventListener("click", renderSigninForm);
  document.getElementById("show-signup").addEventListener("click", renderSignupForm);
  // Default to sign in form.
  renderSigninForm();
}

export function renderSigninForm() {
  const container = document.getElementById("auth-container");
  container.innerHTML = `
    <h2>Sign In</h2>
    <form id="signin-form" class="form">
      <input type="email" id="signin-email" placeholder="Email" required>
      <input type="password" id="signin-password" placeholder="Password" required>
      <button type="submit" class="btn">Sign In</button>
    </form>
  `;
  document.getElementById("signin-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent browser refresh
    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;
    try {
      const user = await apiCall("http://localhost:3000/api/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      currentUser = user;
      renderDashboard();
    } catch (err) {
      document.getElementById("auth-message").textContent = err.message || "Sign in failed.";
      console.error(err);
    }
  });
}

export function renderSignupForm() {
  const container = document.getElementById("auth-container");
  container.innerHTML = `
    <h2>Sign Up</h2>
    <form id="signup-form" class="form">
      <input type="text" id="signup-username" placeholder="Username" required>
      <input type="email" id="signup-email" placeholder="Email" required>
      <input type="password" id="signup-password" placeholder="Password" required>
      <button type="submit" class="btn">Sign Up</button>
    </form>
  `;
  document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent browser refresh
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    try {
      const data = await apiCall("http://localhost:3000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });
      document.getElementById("auth-message").textContent = data;
    } catch (err) {
      document.getElementById("auth-message").textContent = err.message || "Sign up failed.";
      console.error(err);
    }
  });
}

export async function signOut() {
  try {
    await apiCall("http://localhost:3000/api/user/signout", { method: "GET" });
    currentUser = null;
    renderAuthPage();
  } catch (err) {
    console.error("Sign out error", err);
  }
}
