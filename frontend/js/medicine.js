// medicine.js
import { apiCall } from "./api.js";
import { toggleForm } from "./utils.js";
import { currentUser } from "./auth.js";

export function renderMedicineData(medicines) {
  if (!Array.isArray(medicines) || medicines.length === 0) {
    return "<p>No medicine records found.</p>";
  }
  const rows = medicines
    .map(
      ({ id, name, quantity, dosage, createdAt, updatedAt, userRef }) => `
    <tr data-id="${id}">
      <td>${id}</td>
      <td>${name}</td>
      <td>${quantity}</td>
      <td>${dosage}</td>
      <td>${createdAt}</td>
      <td>${updatedAt}</td>
      <td>${userRef}</td>
      <td>
        <button class="delete-medicine btn">Delete</button>
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
          <th>Quantity</th>
          <th>Dosage</th>
          <th>Created</th>
          <th>Updated</th>
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

export async function renderMedicinePage() {
  const content = document.getElementById("dashboard-content");
  content.innerHTML = `
    <h2>Medicine</h2>
    <button id="toggle-medicine-form" class="btn">Toggle Add Medicine Form</button>
    <div id="medicine-form-container" class="hidden"></div>
    <div id="medicine-data" class="data-container"></div>
  `;

  // Load medicine data automatically.
  loadMedicineData();

  document.getElementById("toggle-medicine-form").addEventListener("click", () => {
    const formContainer = document.getElementById("medicine-form-container");
    const dataContainer = document.getElementById("medicine-data");
    if (formContainer.classList.contains("hidden")) {
      dataContainer.classList.add("hidden");
      const formHTML = `
        <form id="medicine-form" class="form">
          <input type="text" id="medicine-name" placeholder="Medicine Name" required>
          <input type="text" id="medicine-quantity" placeholder="Quantity" required>
          <input type="text" id="medicine-dosage" placeholder="Dosage" required>
          <button type="submit" class="btn">Add Medicine</button>
        </form>
        <div id="medicine-response" class="message"></div>
      `;
      toggleForm("medicine-form-container", formHTML, async (e) => {
        e.preventDefault();
        const name = document.getElementById("medicine-name").value;
        const quantity = document.getElementById("medicine-quantity").value;
        const dosage = document.getElementById("medicine-dosage").value;
        try {
          const data = await apiCall("http://localhost:3000/api/medicine/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ userRef: currentUser.id, name, quantity, dosage })
          });
          document.getElementById("medicine-response").textContent =
            `Medicine added: ${data.name}`;
          // After submission, close form and reload data.
          formContainer.innerHTML = "";
          formContainer.classList.add("hidden");
          dataContainer.classList.remove("hidden");
          loadMedicineData();
        } catch (err) {
          document.getElementById("medicine-response").textContent =
            err.message || "Error adding medicine.";
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

async function loadMedicineData() {
  const dataContainer = document.getElementById("medicine-data");
  try {
    const medicines = await apiCall("http://localhost:3000/api/medicine/all", {
      method: "GET",
      credentials: "include"
    });
    dataContainer.innerHTML = renderMedicineData(medicines);
    dataContainer.addEventListener("click", handleMedicineTableActions);
  } catch (err) {
    dataContainer.textContent = err.message || "Error fetching medicine data.";
    console.error(err);
  }
}

function handleMedicineTableActions(e) {
  const row = e.target.closest("tr");
  if (!row) return;
  const medicineId = row.getAttribute("data-id");
  if (e.target.classList.contains("delete-medicine")) {
    if (confirm("Are you sure you want to delete this medicine?")) {
      apiCall(`http://localhost:3000/api/medicine/delete/${medicineId}`, {
        method: "DELETE",
        credentials: "include"
      })
        .then(() => {
          alert("Medicine deleted successfully.");
          loadMedicineData();
        })
        .catch(err => {
          alert(err.message || "Error deleting medicine.");
          console.error(err);
        });
    }
  }
}

export { handleMedicineTableActions };
