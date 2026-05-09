import { displayExpense } from "./expenses.js";
import { popMssg } from "./home.js";
let currentImages = [];
let currentIndex = 0;
let touchStartX = 0;
let imageViewerInitialized = false;
export function viewImg() {
  if (imageViewerInitialized) return;

  imageViewerInitialized = true;
  const fullImageView = document.getElementById("fullImageView");
  const fullImg = document.getElementById("fullImg");

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("bill-img")) {
      currentImages = JSON.parse(e.target.dataset.images);

      currentIndex = parseInt(e.target.dataset.imageIndex);

      updateFullscreenImage();

      fullImg.dataset.imageId = currentImages[currentIndex].id;

      fullImageView.style.display = "flex";

      history.pushState({ imgOpen: true }, "");
    }
  });

  fullImageView.addEventListener("click", (e) => {
    if (e.target.id === "fullImageView") {
      fullImageView.style.display = "none";

      history.back();
    }
  });

  window.addEventListener("popstate", () => {
    fullImageView.style.display = "none";
  });
  document.getElementById("nextImgBtn").addEventListener("click", (e) => {
    e.stopPropagation();

    currentIndex = (currentIndex + 1) % currentImages.length;

    updateFullscreenImage();
  });

  document.getElementById("prevImgBtn").addEventListener("click", (e) => {
    e.stopPropagation();

    currentIndex =
      (currentIndex - 1 + currentImages.length) % currentImages.length;

    updateFullscreenImage();
  });
  fullImageView.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  fullImageView.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].screenX;

    if (touchEndX - touchStartX > 50) {
      currentIndex =
        (currentIndex - 1 + currentImages.length) % currentImages.length;

      updateFullscreenImage();
    } else if (touchStartX - touchEndX > 50) {
      currentIndex = (currentIndex + 1) % currentImages.length;

      updateFullscreenImage();
    }
  });
}
function updateFullscreenImage() {
  const fullImg = document.getElementById("fullImg");

  const imgCounter = document.getElementById("imgCounter");

  fullImg.src = currentImages[currentIndex].image;

  fullImg.dataset.imageId = currentImages[currentIndex].id;

  imgCounter.textContent = `${currentIndex + 1}/${currentImages.length}`;
}

// Delete image from expense
// export async function delImg() {
//   const fullImageView = document.getElementById("fullImageView");
//   const fullImg = document.getElementById("fullImg");
//   const id = fullImg.dataset.expenseId;
//   if (!id) {
//     return;
//   }

//   try {
//     const formData = new FormData();
//     formData.append("img", "");
//     const res = await fetch(`/api/expenses/${id}/`, {
//       method: "PATCH",
//       credentials: "include",
//       headers: {
//         "X-CSRFToken": getCSRF(),
//       },
//       body: formData,
//     });
//     if (!res.ok) throw new Error("PATCH failed");
//     await displayExpense();
//     fullImageView.style.display = "none";
//   } catch (err) {
//     console.error("Error:", err);
//     popMssg("Failed to delete image.");
//   }
// }

export async function delImg() {
  const fullImageView = document.getElementById("fullImageView");

  const fullImg = document.getElementById("fullImg");

  const imageId = fullImg.dataset.imageId;

  if (!imageId) return;

  try {
    const res = await fetch(
      `/api/expense-images/${imageId}/`,

      {
        method: "DELETE",

        credentials: "include",

        headers: {
          "X-CSRFToken": getCSRF(),
        },
      },
    );

    if (!res.ok) {
      throw new Error("DELETE failed");
    }

    // remove current image locally
    currentImages.splice(currentIndex, 1);

    // rerender expense cards
    await displayExpense();

    // if no images left close modal
    if (currentImages.length === 0) {
      fullImageView.style.display = "none";

      return;
    }

    // prevent index overflow
    if (currentIndex >= currentImages.length) {
      currentIndex = currentImages.length - 1;
    }

    // show next available image
    updateFullscreenImage();
  } catch (err) {
    console.error(err);

    popMssg("Failed to delete image.");
  }
}

// CSRF helper
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

window.delImg = delImg;
