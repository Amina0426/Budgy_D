import { addExpenses } from "./expenses.js";

export function home(homeBtn) {
  if (!homeBtn) return;
  const exForm = document.querySelector("#overlay1");
  const addBtn = document.querySelector("#add");
  const closeBtn = document.querySelector(".close");
  if (!exForm || !addBtn) return;

  homeBtn.addEventListener("click", () => {
    exForm.style.display = "block";
  });
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      exForm.style.display = "none";
    });
  }
  addBtn.addEventListener("click", async () => {
    await addExpenses();
    exForm.style.display = "none";
  });
}

export function popMssg(text) {
  const mssg = document.createElement("div");
  mssg.classList.add("success-popup");
  mssg.innerText = text;
  document.body.appendChild(mssg);

  setTimeout(() => {
    mssg.remove();
  }, 2000);
}
