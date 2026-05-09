import { popMssg } from "./home.js";
import { track } from "./charts.js";
export function openSetModal() {
  document.getElementById("set-modal").style.display = "block";
  document.getElementById("mode").checked =
    document.body.classList.contains("dark");
}
export function closeModal() {
  document.getElementById("set-modal").style.display = "none";
}
export function toggleMode() {
  document.body.classList.toggle("dark");
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
}
const API_BUDGET = "/api/budgets/";

export async function monthlyLimit() {
  const budgetInput = document.getElementById("monthlyBudget");
  if (!budgetInput) return;
  try {
    const res = await fetch(API_BUDGET, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch budget");
    const budgets = await res.json();
    if (budgets.length > 0) {
      budgetInput.value = budgets[0].amount;
      budgetInput.dataset.budgetId = budgets[0].id;
    }
  } catch (err) {
    console.error(err);
  }

  // Save/update on change
  budgetInput.addEventListener("change", async () => {
    const amount = parseFloat(budgetInput.value);
    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid budget amount");
      return;
    }

    const budgetId = budgetInput.dataset.budgetId;
    const method = budgetId ? "PATCH" : "POST";
    const url = budgetId ? `${API_BUDGET}${budgetId}/` : API_BUDGET;

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRF(),
        },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error("Failed to save budget");
      const data = await res.json();
      budgetInput.dataset.budgetId = data.id;
      popMssg("Budget saved successfully!");
      track();
    } catch (err) {
      console.error(err);
      alert("Failed to save budget");
    }
  });
}

const API_EXPENSES = "/api/expenses/";

// Download all expenses as JSON
export async function downloadData() {
  try {
    const res = await fetch(API_EXPENSES, {
      method,
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch expenses");
    const expenses = await res.json();

    const sanitizedExpenses = expenses.map((e) => ({
      amount: e.amount,
      tag: e.tag,
      date: e.date,
      ...(e.img ? { img: "[image omitted]" } : {}),
    }));

    const data = {
      budget: "Not set",
      expenses: sanitizedExpenses,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "finance-data.json";
    link.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed to download data:", err);
  }
}

// Reset app by deleting all expenses
export async function resetApp() {
  const confirmReset = confirm(
    "Are you sure you want to reset all data? This cannot be undone."
  );
  if (!confirmReset) return;

  try {
    const res = await fetch("/api/reset/", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRFToken": getCSRF(),
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("Reset failed:", errData);
      alert("Failed to reset data. Check server logs.");
      return;
    }

    alert("All data deleted successfully!");
    location.reload();
  } catch (err) {
    console.error("Error during reset:", err);
    alert("Error while contacting server.");
  }
}
// CSRF helper
function getCSRF() {
  const name = "csrftoken";
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const c = cookie.trim();
    if (c.startsWith(name + "=")) {
      return decodeURIComponent(c.substring(name.length + 1));
    }
  }
  return "";
}

window.openSetModal = openSetModal;
window.closeModal = closeModal;
window.toggleMode = toggleMode;
window.monthlyLimit = monthlyLimit;
window.downloadData = downloadData;
window.resetApp = resetApp;
