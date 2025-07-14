document.addEventListener("DOMContentLoaded", () => {
  const levelGrid = document.querySelector(".level-grid");
  const starsData = JSON.parse(localStorage.getItem("wardekaStars") || "{}");

  for (let i = 1; i <= 10; i++) {
    const isUnlocked = i === 1 || (starsData[i - 1] === 3);

    const levelBtn = document.createElement("div");
    levelBtn.className = "level-box";
    if (!isUnlocked) levelBtn.classList.add("locked");

    const levelNumber = document.createElement("div");
    levelNumber.className = "level-number";
    levelNumber.textContent = i;

    const starImg = document.createElement("img");
    const stars = starsData[i] ?? 0;
    starImg.src = `assets/images/star-${stars}.png`;
    starImg.className = "star-status";

    levelBtn.appendChild(levelNumber);
    levelBtn.appendChild(starImg);

    if (isUnlocked) {
      levelBtn.onclick = () => window.location.href = `game.html?level=${i}`;
    } else {
      levelBtn.onclick = () => showLockedModal();
    }

    levelGrid.appendChild(levelBtn);
  }
});

// Modal handler
function showLockedModal() {
  document.getElementById("modalLocked").style.display = "flex";
}

function closeLockedModal() {
  document.getElementById("modalLocked").style.display = "none";
}
