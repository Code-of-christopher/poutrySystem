// eggs.js
import { apiCall } from "./api.js";
import { toggleForm } from "./utils.js";

export function renderEggData(eggs) {
  if (!Array.isArray(eggs) || eggs.length === 0) {
    return "<p>No egg records found.</p>";
  }
  const rows = eggs
    .map(
      ({ id, batchId, batchName, total, weight, userRef, createdAt, updatedAt }) => `
    <tr>
      <td>${id}</td>
      <td>${batchId}</td>
      <td>${batchName}</td>
      <td>${total}</td>
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
          <th>Batch ID</th>
          <th>Batch Name</th>
          <th>Total</th>
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

export async function renderEggPage() {
  const content = document.getElementById("dashboard-content");
  content.innerHTML = `
    <h2>Egg Production</h2>
    <button id="toggle-egg-form" class="btn">Toggle Record Egg Production Form</button>
    <div id="egg-form-container" class="hidden"></div>
    <div id="egg-data" class="data-container"></div>
  `;

  // Load egg data automatically.
  loadEggData();

  document.getElementById("toggle-egg-form").addEventListener("click", async () => {
    const formContainer = document.getElementById("egg-form-container");
    const dataContainer = document.getElementById("egg-data");
    if (formContainer.classList.contains("hidden")) {
      // Hide data when opening the form.
      dataContainer.classList.add("hidden");
      let batches;
      try {
        batches = await apiCall("http://localhost:3000/api/batch/all", {
          method: "GET",
          credentials: "include"
        });
      } catch (err) {
        alert("Error fetching batches.");
        console.error(err);
        return;
      }
      const formHTML = `
        <form id="egg-form" class="form">
          <select id="egg-batchId" required>
            <option value="">Select Batch</option>
            ${batches.map(b => `<option value="${b.id}">${b.name}</option>`).join("")}
          </select>
          <input type="number" id="egg-total" placeholder="Total Eggs" required>
          <input type="number" id="egg-weight" placeholder="Total Weight" step="0.01" required>
          <button type="submit" class="btn">Record Eggs</button>
        </form>
        <div id="egg-response" class="message"></div>
      `;
      toggleForm("egg-form-container", formHTML, async (e) => {
        e.preventDefault();
        const batchId = document.getElementById("egg-batchId").value;
        const total = parseInt(document.getElementById("egg-total").value);
        const weight = parseFloat(document.getElementById("egg-weight").value);
        try {
          const data = await apiCall(`http://localhost:3000/api/eggs/record/${batchId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ total, weight })
          });
          document.getElementById("egg-response").textContent =
            `Egg record added: ${data.batch.name} (${data.total} eggs)`;
          // After submission, close form and reload data.
          formContainer.innerHTML = "";
          formContainer.classList.add("hidden");
          dataContainer.classList.remove("hidden");
          loadEggData();
        } catch (err) {
          document.getElementById("egg-response").textContent =
            err.message || "Error recording eggs.";
          console.error(err);
        }
      });
      formContainer.classList.remove("hidden");
    } else {
      // Close form and show data.
      formContainer.innerHTML = "";
      formContainer.classList.add("hidden");
      dataContainer.classList.remove("hidden");
    }
  });
}

async function loadEggData() {
  const dataContainer = document.getElementById("egg-data");
  try {
    const eggs = await apiCall("http://localhost:3000/api/eggs/all", {
      method: "GET",
      credentials: "include"
    });
    dataContainer.innerHTML = renderEggData(eggs);
  } catch (err) {
    dataContainer.textContent = err.message || "Error fetching egg data.";
    console.error(err);
  }
}
