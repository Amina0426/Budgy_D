import { navigation, scrollTrack } from "./navigation.js";
import { AbouTags } from "./tags.js";
import { home } from "./home.js";
import { addExpenses, displayExpense } from "./expenses.js";
import { addIncome, displayIncome } from "./incomes.js";
import { track } from "./charts.js";
import { viewImg } from "./images.js";
import { closeAllDropdowns } from "./utils.js";
import { monthlyLimit, openSetModal } from "./settings.js";
import { filter } from "./filter.js";

function initiaLoad() {
  const nav = document.querySelectorAll("a");
  const box = document.querySelector(".container");
  const sections = document.querySelectorAll("#h,#e,#i");

  const homeBtn = document.querySelector(".add");
  home(homeBtn);

  const tags = document.querySelectorAll(".tagel");
  const addTagBtn = document.querySelector("#tag2");
  if (tags.length && addTagBtn) {
    AbouTags(tags, addTagBtn);
  }

  if (nav.length && box && sections.length) {
    navigation(nav, box, sections);
    scrollTrack(nav, box, sections);
  }

  if (document.querySelector(".add")) {
    displayExpense();
  }
  if (document.querySelector("#income")) {
    addIncome();
    displayIncome();
  }

  if (document.querySelector(".summary-grid")) {
    track();
  }
  if (document.querySelector(".curr")) {
    filter();
  }

  viewImg();
}
function attachGlobalListeners() {
  // Close dropdowns globally
  document.addEventListener("click", closeAllDropdowns);

  // Expense menu toggle using delegation
  document.querySelector(".curr")?.addEventListener("click", (e) => {
    if (e.target.classList.contains("menu")) {
      e.stopPropagation();
      closeAllDropdowns();
      e.target.nextElementSibling.classList.toggle("hidden");
    }
  });

  // Settings modal
  document.querySelector("#set")?.addEventListener("click", openSetModal);
}
async function checkAuth() {
  try {
    const res = await fetch("/api/me/", {
      credentials: "include",
    });

    // only redirect on actual auth failure
    if (res.status === 401 || res.status === 403) {
      window.location.href = "/";
      return false;
    }

    // temporary/network/server issue
    if (!res.ok) {
      console.error("Auth check failed:", res.status);
      return true;
    }

    return true;
  } catch (err) {
    console.error("Network/auth error:", err);

    // do NOT redirect on network failure
    // allows offline/PWA usage
    return true;
  }
}
window.addEventListener("DOMContentLoaded", async () => {
  const authenticated = await checkAuth();

  if (!authenticated) return;

  initiaLoad();
  attachGlobalListeners();
  monthlyLimit();

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
});
