import { popMssg } from "./home.js";
import { closeAllDropdowns } from "./utils.js";
import { selectedTag } from "./tags.js";
import { edit } from "./edit.js";
import { track } from "./charts.js";

const API_BASE = "/api/expenses/";

// -------------------- Fetch Expenses --------------------
export async function getExpenses() {
  try {
    const res = await fetch(API_BASE, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch expenses");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// -------------------- Display Expenses --------------------
export async function displayExpense(tag = "all") {
  const currList = document.querySelector(".curr");
  const past = document.querySelector(".past");
  if (!currList || !past) return;

  // attach menu toggle listener once
  currList.onclick = (e) => {
    if (e.target.classList.contains("menu")) {
      e.stopPropagation();
      closeAllDropdowns();
      const dropdown = e.target.nextElementSibling;
      dropdown.classList.toggle("hidden");
    }
  };

  const expenses = await getExpenses();
  if (expenses.length === 0) {
    currList.innerHTML = `<div class="empty-placeholder">Start adding your expenses to view here.</div>`;
    past.innerHTML = "";
    return;
  }

  const currMonth = new Date().getMonth();
  const pastExpByMonth = {};
  const currExpenses = [];

  const filtered =
    tag === "all"
      ? expenses
      : expenses.filter((e) => e.tag?.toLowerCase() === tag.toLowerCase());

  filtered.forEach((exp) => {
    const date = new Date(exp.date);
    const month = date.getMonth();
    const monthKey = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (month === currMonth) {
      currExpenses.push(exp);
    } else {
      if (!pastExpByMonth[monthKey]) pastExpByMonth[monthKey] = [];
      pastExpByMonth[monthKey].push(exp);
    }
  });

  // --- Render current month expenses ---
  currList.innerHTML = "";
  currExpenses.forEach((exp) => {
    const li = document.createElement("div");
    li.classList.add("exDiv");
    li.innerHTML = `
      <p> Rs.${exp.amount}</p> 
      <p id="date">${formatDate(exp.date)}</p>
      <span id="t">${exp.tag}</span>
      ${
        exp.images && exp.images.length > 0
          ? `
          <div class="bill-images-wrapper">
      <div class="bill-images">
        ${exp.images
          .map(
            (imgObj, index) => `
              <img
                src="${imgObj.image}"
                class="bill-img"
                data-expense-id="${exp.id}"
                data-image-id="${imgObj.id}"
                data-image-index="${index}"
            data-images='${JSON.stringify(exp.images)}'
              >
            `,
          )
          .join("")}
      </div>
      <span class="img-count-badge">
    ${exp.images.length}
  </span>
  </div>
    `
          : ""
      }
      <button class="menu">&#x22EE;</button>
      <div class="dd hidden">
        <button onclick="editExpense(${exp.id})">Edit</button>
        <button onclick="deleteExpense(${exp.id})">Delete</button>
        <button onclick="addPic(${exp.id})">Add Bill</button>
      </div>`;
    currList.appendChild(li);
  });

  // --- Render past months ---
  past.innerHTML = "";
  Object.keys(pastExpByMonth)
    .sort((a, b) => new Date(b) - new Date(a))
    .forEach((month) => {
      const monthDiv = document.createElement("div");
      monthDiv.classList.add("pastDiv");

      const total = pastExpByMonth[month].reduce(
        (sum, e) => sum + parseFloat(e.amount),
        0,
      );

      const liHeader = document.createElement("div");
      liHeader.classList.add("pDiv-header");
      liHeader.textContent = `${month} Total: Rs.${total.toFixed(2)}`;
      monthDiv.appendChild(liHeader);

      const monthContent = document.createElement("div");
      monthContent.classList.add("pDiv-content", "hidden");
      monthDiv.appendChild(monthContent);

      liHeader.addEventListener("click", () => {
        document.querySelectorAll(".pDiv-content").forEach((div) => {
          if (div !== monthContent) div.classList.add("hidden");
        });
        monthContent.classList.toggle("hidden");

        if (!monthContent.dataset.loaded) {
          pastExpByMonth[month].forEach((exp) => {
            const li = document.createElement("div");
            li.classList.add("exDiv");
            li.innerHTML = `
  <p> Rs.${exp.amount}</p> 
  <p id="date">${formatDate(exp.date)}</p>
  <span id="t">${exp.tag}</span>
  ${
    exp.images && exp.images.length > 0
      ? `
      <div class="bill-images-wrapper">
      <div class="bill-images">
        ${exp.images
          .map(
            (imgObj) => `
              <img
                src="${imgObj.image}"
                class="bill-img"
                data-expense-id="${exp.id}"
                data-image-id="${imgObj.id}"
                data-image-index="${index}"
            data-images='${JSON.stringify(exp.images)}'
              >
            `,
          )
          .join("")}
      </div>
      <span class="img-count-badge">
    ${exp.images.length}
  </span>
  </div>
    `
      : ""
  }
  <button class="menu">&#x22EE;</button>
  <div class="dd hidden">
    <button onclick="editExpense(${exp.id})">Edit</button>
    <button onclick="deleteExpense(${exp.id})">Delete</button>
    <button onclick="addPic(${exp.id})">Add Bill</button>
  </div>`;

            monthContent.appendChild(li);
          });
          monthContent.dataset.loaded = "true";
        }
      });
      past.appendChild(monthDiv);
    });
}

// -------------------- Add Expense --------------------
export async function addExpenses() {
  const input = document.querySelector("#in");
  const tags = document.querySelectorAll(".tagel");

  const amount = parseFloat(input.value);
  const tagInput = document.querySelector("#tagInput");

  if (tagInput.style.visibility === "visible" && tagInput.value.trim() !== "") {
    selectedTag.value = tagInput.value.trim();
    tagInput.style.visibility = "hidden";
    tagInput.value = "";
  }

  if (amount <= 0 || !selectedTag.value) {
    popMssg("Enter a valid amount and select a tag!");
    return;
  }

  const expense = {
    amount,
    tag: selectedTag.value,
    date: new Date().toISOString(),
  };

  try {
    await fetch(API_BASE, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRF(),
      },
      body: JSON.stringify(expense),
    });
    input.value = "";
    tags.forEach((tag) => tag.classList.remove("selected"));
    await displayExpense();
    track();
    popMssg(`Rs.${expense.amount} - ${expense.tag} added!`);
  } catch (err) {
    console.error(err);
    popMssg("Failed to add expense. Check Internet.");
  }
}

// -------------------- Delete Expense --------------------
export async function deleteExpense(id) {
  try {
    await fetch(`${API_BASE}${id}/`, {
      method: "DELETE",
      credentials: "include",
      headers: { "X-CSRFToken": getCSRF() },
    });
    await displayExpense();
    track();
  } catch (err) {
    console.error(err);
    popMssg("Failed to delete expense.");
  }
}

// -------------------- Edit Expense --------------------
export async function editExpense(id) {
  edit("expenses", id);
}

// -------------------- Add Bill Image --------------------
export function addPic(id) {
  const input = document.createElement("input");

  input.type = "file";

  input.accept = "image/*";

  input.multiple = true;

  input.onchange = async () => {
    const files = input.files;

    if (!files.length) return;

    const formData = new FormData();

    for (const file of files) {
      formData.append("images", file);
    }

    try {
      await fetch(`/api/expenses/${id}/images/`, {
        method: "POST",

        credentials: "include",

        headers: {
          "X-CSRFToken": getCSRF(),
        },

        body: formData,
      });

      await displayExpense();
    } catch (err) {
      console.error(err);

      popMssg("Failed to upload image.");
    }
  };

  input.click();
}
// -------------------- Helpers --------------------
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

function getCSRF() {
  const name = "csrftoken";
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const c = cookie.trim();
    if (c.startsWith(name + "="))
      return decodeURIComponent(c.substring(name.length + 1));
  }
  return "";
}
export function togglePast() {
  let past = document.querySelector("#past-section");
  const arrow = document.querySelector(".arrow-caret");
  let header = document.querySelector(".p-header");
  header.classList.toggle("raised");
  past.classList.toggle("open");
  arrow.classList.toggle("rotated");

  if (!past.classList.contains("open")) {
    const allMonths = past.querySelectorAll(".pDiv-content");
    allMonths.forEach((div) => div.classList.add("hidden"));
  }
}
window.togglePast = togglePast;

// -------------------- Expose globally --------------------
window.deleteExpense = deleteExpense;
window.addPic = addPic;
window.editExpense = editExpense;
