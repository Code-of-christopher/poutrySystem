// feeds.js
import { apiCall } from "./api.js";
import { toggleForm } from "./utils.js";
import { currentUser } from "./auth.js";

export function renderFeedData(feeds) {
  if (!Array.isArray(feeds) || feeds.length === 0) {
    return "<p>No feed records found.</p>";
  }
  const rows = feeds
    .map(
      ({ id, name, quantity, weight, createdAt, updatedAt, userRef }) => `
    <tr>
      <td>${id}</td>
      <td>${name}</td>
      <td>${quantity}</td>
      <td>${weight}</td>
      <td>${createdAt}</td>
      <td>${updatedAt}</td>
      <td>${userRef}</td>
    </tr>
  `
    )
    .join("");
  return `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Weight</th>
          <th>Created</th>
          <th>Updated</th>
          <th>UserRef</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

export async function renderFeedsPage() {
  const content = document.getElementById("dashboard-content");
  content.innerHTML = `
    <h2>Feeds</h2>
    <button id="toggle-feeds-form" class="btn">Toggle Create/Update Feed Form</button>
    <div id="feeds-form-container" class="hidden"></div>
    <div id="feeds-data" class="data-container"></div>
  `;

  // Load feed data automatically.
  loadFeedData();

  document.getElementById("toggle-feeds-form").addEventListener("click", () => {
    const formContainer = document.getElementById("feeds-form-container");
    const dataContainer = document.getElementById("feeds-data");
    if (formContainer.classList.contains("hidden")) {
      dataContainer.classList.add("hidden");
      const formHTML = `
        <form id="feeds-form" class="form">
          <input type="text" id="feed-name" placeholder="Feed Name" required>
          <input type="number" id="feed-quantity" placeholder="Quantity" required>
          <input type="number" id="feed-weight" placeholder="Weight" step="0.01" required>
          <button type="submit" class="btn">Submit Feed</button>
        </form>
        <div id="feeds-response" class="message"></div>
      `;
      toggleForm("feeds-form-container", formHTML, async (e) => {
        e.preventDefault();
        const name = document.getElementById("feed-name").value;
        const quantity = parseFloat(document.getElementById("feed-quantity").value);
        const weight = parseFloat(document.getElementById("feed-weight").value);
        try {
          const data = await apiCall("http://localhost:3000/api/feeds/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ userRef: currentUser.id, name, quantity, weight })
          });
          document.getElementById("feeds-response").textContent =
            `Feed updated/created: ${data.name}`;
          // After submission, close form and reload data.
          formContainer.innerHTML = "";
          formContainer.classList.add("hidden");
          dataContainer.classList.remove("hidden");
          loadFeedData();
        } catch (err) {
          document.getElementById("feeds-response").textContent =
            err.message || "Error processing feed.";
          console.error(err);
        }
      });
      formContainer.classList.remove("hidden");
    } else {
      formContainer.innerHTML = "";
      formContainer.classList.add("hidden");
      dataContainer.classList.remove("hidden");
    }
  });
}

async function loadFeedData() {
  const dataContainer = document.getElementById("feeds-data");
  try {
    const feeds = await apiCall("http://localhost:3000/api/feeds/all", {
      method: "GET",
      credentials: "include"
    });
    dataContainer.innerHTML = renderFeedData(feeds);
  } catch (err) {
    dataContainer.textContent = err.message || "Error fetching feed data.";
    console.error(err);
  }
}
