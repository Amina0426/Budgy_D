import { popMssg } from "./home.js";
import { track } from "./charts.js";
import { closeAllDropdowns } from "./utils.js";
import { edit } from "./edit.js";

const API_BASE = "/api/incomes/";

export async function getIncomes() {
  try {
    const res = await fetch(API_BASE, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch incomes");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Display incomes
export async function displayIncome() {
  const incList = document.querySelector(".incList");

  incList.addEventListener("click", (e) => {
    if (e.target.classList.contains("menu")) {
      e.stopPropagation();
      closeAllDropdowns();
      const dropdown = e.target.nextElementSibling;
      dropdown.classList.toggle("hidden");
    }
  });

  const incomes = await getIncomes();

  if (incomes.length === 0) {
    incList.innerHTML = `<div class="empty-placeholder">No incomes added yet.</div>`;
    return;
  }

  incList.innerHTML = "";

  incomes.forEach((income) => {
    const li = document.createElement("div");
    li.classList.add("inDiv");
    li.innerHTML = `
      <p>Rs. ${income.amount}</p>
      <p id="date">${formatDate(income.date)}</p>
      <button class="menu">&#x22EE;</button>
      <div class="dd hidden">
        <button onclick="editIncome(${income.id})">Edit</button>
        <button onclick="deleteIncome(${income.id})">Delete</button>
      </div>`;
    incList.appendChild(li);
  });
}

// Add new income
export function addIncome() {
  const incIn = document.querySelector("#income");
  const incAdd = document.querySelector("#inBtn");

  incAdd.addEventListener("click", async () => {
    const amt = parseFloat(incIn.value);
    if (amt <= 0) {
      popMssg("Enter a valid income amount!");
      return;
    }

    const income = { amount: amt, date: new Date().toISOString() };

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRF(),
        },
        body: JSON.stringify(income),
      });

      if (!res.ok) throw new Error("Failed to add income");

      incIn.value = "";
      await displayIncome();
      track();
      popMssg(`Rs.${income.amount} added to incomes!`);
    } catch (err) {
      console.error(err);
      popMssg("Failed to add income. Check Internet.");
    }
  });
}

// Delete income
export async function deleteIncome(id) {
  try {
    const res = await fetch(`${API_BASE}${id}/`, {
      method: "DELETE",
      credentials: "include",
      headers: { "X-CSRFToken": getCSRF() },
    });
    if (!res.ok) throw new Error("Failed to delete income");
    await displayIncome();
    track();
  } catch (err) {
    console.error(err);
    popMssg("Failed to delete income.");
  }
}

// Edit income placeholder
export function editIncome(id) {
  edit("incomes", id);
}

// Helpers
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

function getCSRF() {
  const name = "csrftoken";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const c = cookie.trim();
    if (c.startsWith(name + "=")) {
      return decodeURIComponent(c.substring(name.length + 1));
    }
  }
  return "";
}

window.deleteIncome = deleteIncome;
window.editIncome = editIncome;
