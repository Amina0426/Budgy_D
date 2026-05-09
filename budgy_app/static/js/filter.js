import { displayExpense } from "./expenses.js";

const filterToggle = document.getElementById("filter-toggle");
const filterDropdown = document.getElementById("filter-dropdown");
const currList = document.querySelector(".curr");

export function filter() {
  filterToggle.addEventListener("click", () => {
    filterDropdown.classList.toggle("show");
  });

  filterDropdown.onclick = (e) => {
    if (e.target.tagName !== "BUTTON") return;
    const tag = e.target.dataset.tag;
    filterDropdown.classList.remove("show");
    displayExpense(tag);
  };
}
