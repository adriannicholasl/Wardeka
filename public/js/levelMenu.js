function showLockedModal() {
  document.getElementById("modalLocked").style.display = "flex";
}

function closeLockedModal() {
  document.getElementById("modalLocked").style.display = "none";
}

function createLevelBox(i, stars, isUnlocked) {
  const levelBtn = document.createElement("div");
  levelBtn.className = "level-box";
  if (!isUnlocked) levelBtn.classList.add("locked");

  const levelNumber = document.createElement("div");
  levelNumber.className = "level-number";
  levelNumber.textContent = i;

  const starImg = document.createElement("img");
  starImg.src = `assets/images/star-${stars}.png`;
  starImg.className = "star-status";

  levelBtn.appendChild(levelNumber);
  levelBtn.appendChild(starImg);

  levelBtn.onclick = () => {
    if (isUnlocked) {
      window.location.href = `game.html?level=${i}`;
    } else {
      showLockedModal();
    }
  };

  return levelBtn;
}

firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    alert("Silakan login terlebih dahulu.");
    window.location.href = "index.html";
    return;
  }

  const userRef = window.db.collection("users").doc(user.uid);
  const userSnap = await userRef.get();

  let starsData = {};
  if (userSnap.exists) {
    starsData = userSnap.data().stars || {};
  }

  const levelGrid = document.querySelector(".level-grid");
  for (let i = 1; i <= 10; i++) {
    const levelKey = `level${i}`;
    const prevKey = `level${i - 1}`;
    const stars = starsData[levelKey] || 0;
    const isUnlocked = i === 1 || starsData[prevKey] === 3;

    const levelBtn = createLevelBox(i, stars, isUnlocked);
    levelGrid.appendChild(levelBtn);
  }
});
