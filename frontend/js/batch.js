// batch.js
import { apiCall } from "./api.js";
import { toggleForm } from "./utils.js";
import { currentUser } from "./auth.js";

export function renderBatchData(batches) {
  if (!Array.isArray(batches) || batches.length === 0) {
    return "<p>No batches found.</p>";
  }
  const rows = batches
    .map(
      ({ id, name, population, deceased, weight, date, userRef }) => `
    <tr data-id="${id}">
      <td>${id}</td>
      <td>${name}</td>
      <td>${population}</td>
      <td>${deceased.join(", ")}</td>
      <td>${weight.join(", ")}</td>
      <td>${date}</td>
      <td>${userRef}</td>
      <td>
        <button class="update-batch btn">Update</button>
        <button class="delete-batch btn">Delete</button>
      </td>
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
          <th>Population</th>
          <th>Deceased</th>
          <th>Weight</th>
          <th>Date</th>
          <th>UserRef</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

export async function renderBatchPage() {
  const content = document.getElementById("dashboard-content");
  content.innerHTML = `
    <h2>Batches</h2>
    <button id="toggle-batch-form" class="btn">Toggle Create Batch Form</button>
    <div id="batch-form-container" class="hidden"></div>
    <div id="batch-data" class="data-container"></div>
  `;
  
  // Automatically load batch data on page render.
  loadBatchData();

  document.getElementById("toggle-batch-form").addEventListener("click", () => {
    const formContainer = document.getElementById("batch-form-container");
    const dataContainer = document.getElementById("batch-data");
    if (formContainer.classList.contains("hidden")) {
      // When opening the form, hide the fetched data.
      dataContainer.classList.add("hidden");
      const formHTML = `
        <form id="batch-form" class="form">
          <input type="text" id="batch-name" placeholder="Batch Name" required>
          <input type="number" id="batch-population" placeholder="Population" required>
          <input type="text" id="batch-deceased" placeholder="Deceased (comma-separated)" required>
          <input type="text" id="batch-weight" placeholder="Weight (comma-separated)" required>
          <button type="submit" class="btn">Create Batch</button>
        </form>
        <div id="batch-response" class="message"></div>
      `;
      toggleForm("batch-form-container", formHTML, async (e) => {
        e.preventDefault();
        const name = document.getElementById("batch-name").value;
        const population = parseInt(document.getElementById("batch-population").value);
        const deceased = document.getElementById("batch-deceased").value.split(",").map(s => s.trim());
        const weight = document.getElementById("batch-weight").value.split(",").map(s => s.trim());
        try {
          const data = await apiCall("http://localhost:3000/api/batch/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, population, deceased, weight, userRef: currentUser.id })
          });
          document.getElementById("batch-response").textContent = `Batch created: ${data.name}`;
          // After creation, hide the form and reload data.
          formContainer.innerHTML = "";
          formContainer.classList.add("hidden");
          dataContainer.classList.remove("hidden");
          loadBatchData();
        } catch (err) {
          document.getElementById("batch-response").textContent = err.message || "Error creating batch.";
          console.error(err);
        }
      });
      formContainer.classList.remove("hidden");
    } else {
      // If form is already open, close it and show the data.
      formContainer.innerHTML = "";
      formContainer.classList.add("hidden");
      dataContainer.classList.remove("hidden");
    }
  });
}

async function loadBatchData() {
  const dataContainer = document.getElementById("batch-data");
  try {
    const batches = await apiCall("http://localhost:3000/api/batch/all", {
      method: "GET",
      credentials: "include"
    });
    dataContainer.innerHTML = renderBatchData(batches);
    // Attach event listener for update and delete actions.
    dataContainer.addEventListener("click", handleBatchTableActions);
  } catch (err) {
    dataContainer.textContent = err.message || "Error fetching batch data.";
    console.error(err);
  }
}

function handleBatchTableActions(e) {
  const row = e.target.closest("tr");
  if (!row) return;
  const batchId = row.getAttribute("data-id");
  if (e.target.classList.contains("update-batch")) {
    const cells = row.querySelectorAll("td");
    const [id, name, population, deceased, weight] = [
      cells[0].textContent,
      cells[1].textContent,
      cells[2].textContent,
      cells[3].textContent,
      cells[4].textContent
    ];
    const updateFormHTML = `
      <form id="update-batch-form" class="form">
        <input type="text" id="update-batch-name" placeholder="Batch Name" value="${name}" required>
        <input type="number" id="update-batch-population" placeholder="Population" value="${population}" required>
        <input type="text" id="update-batch-deceased" placeholder="Deceased (comma-separated)" value="${deceased}" required>
        <input type="text" id="update-batch-weight" placeholder="Weight (comma-separated)" value="${weight}" required>
        <button type="submit" class="btn">Update Batch</button>
        <button type="button" id="cancel-update" class="btn">Cancel</button>
      </form>
      <div id="update-batch-response" class="message"></div>
    `;
    row.insertAdjacentHTML("afterend", updateFormHTML);
    document.getElementById("update-batch-form").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const newName = document.getElementById("update-batch-name").value;
      const newPopulation = parseInt(document.getElementById("update-batch-population").value);
      const newDeceased = document.getElementById("update-batch-deceased").value.split(",").map(s => s.trim());
      const newWeight = document.getElementById("update-batch-weight").value.split(",").map(s => s.trim());
      try {
        const data = await apiCall(`http://localhost:3000/api/batch/update/${batchId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: newName, population: newPopulation, deceased: newDeceased, weight: newWeight })
        });
        document.getElementById("update-batch-response").textContent = `Batch updated: ${data.name}`;
        setTimeout(() => {
          loadBatchData();
        }, 1000);
      } catch (err) {
        document.getElementById("update-batch-response").textContent = err.message || "Error updating batch.";
        console.error(err);
      }
    });
    document.getElementById("cancel-update").addEventListener("click", () => {
      e.target.closest("tr").nextElementSibling.remove();
    });
  }
  if (e.target.classList.contains("delete-batch")) {
    if (confirm("Are you sure you want to delete this batch?")) {
      apiCall(`http://localhost:3000/api/batch/delete/${batchId}`, {
        method: "DELETE",
        credentials: "include"
      })
        .then(() => {
          alert("Batch deleted successfully.");
          loadBatchData();
        })
        .catch(err => {
          alert(err.message || "Error deleting batch.");
          console.error(err);
        });
    }
  }
}
