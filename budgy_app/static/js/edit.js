import { displayExpense } from "./expenses.js";
import { displayIncome } from "./incomes.js";
import { track } from "./charts.js";

const API_EXPENSES = "/api/expenses/";
const API_INCOMES = "/api/incomes/";

export function edit(type, id) {
  console.log("editing.. clicked", type, id);

  const overlay = document.getElementById("editModalOverlay");
  const amountInput = document.getElementById("editAmountInput");
  const tagInput = document.getElementById("editTagInput");
  const saveBtn = document.getElementById("editSaveBtn");
  const cancelBtn = document.getElementById("editCancelBtn");

  // Show modal
  overlay.classList.add("show");

  async function onSave() {
    const amt = amountInput.value.trim();
    if (amt === "" || isNaN(Number(amt))) return alert("Invalid amount");

    const payload = { amount: Number(amt) };

    if (type === "expenses") {
      const tag = tagInput.value.trim();
      if (tag === "") return alert("Tag cannot be empty");
      payload.tag = tag;
    }

    const API_BASE = type === "expenses" ? API_EXPENSES : API_INCOMES;

    try {
      const res = await fetch(`${API_BASE}${id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRF(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update");

      // Refresh display + totals
      if (type === "expenses") {
        await displayExpense();
      } else {
        await displayIncome();
      }
      await track();

      overlay.classList.remove("show");
    } catch (err) {
      console.error(err);
      alert("Failed to update item.");
    }
  }

  function onCancel() {
    overlay.classList.remove("show");
  }

  saveBtn.addEventListener("click", onSave, { once: true });
  cancelBtn.addEventListener("click", onCancel, { once: true });

  // Show tag input only for expenses
  tagInput.style.display = type === "expenses" ? "block" : "none";
}

// Helper to get CSRF token
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

window.edit = edit;
