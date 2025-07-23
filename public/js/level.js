let currentUser = window.currentUser || null;
let userStars = window.userStars || {};

const levelSettings = {
  1: { pairs: 3, maxTime: 30, grid: [3, 2] },
  2: { pairs: 4, maxTime: 65, grid: [4, 2] },
  3: { pairs: 6, maxTime: 75, grid: [4, 3] },
  4: { pairs: 8, maxTime: 150, grid: [4, 4] },
  5: { pairs: 9, maxTime: 100, grid: [5, 3] },
  6: { pairs: 10, maxTime: 110, grid: [5, 4] },
  7: { pairs: 12, maxTime: 120, grid: [5, 4] },
  8: { pairs: 14, maxTime: 135, grid: [6, 4] },
  9: { pairs: 16, maxTime: 150, grid: [6, 4] },
  10: { pairs: 18, maxTime: 180, grid: [6, 6] },
};

const levelParam = new URLSearchParams(window.location.search).get("level");
const currentLevel = parseInt(levelParam) || 1;
const settings = levelSettings[currentLevel];

const totalPairs = settings.pairs;
const maxTime = settings.maxTime;
const gridLayout = settings.grid;

const gameBoard = document.getElementById("gameBoard");
const timerDisplay = document.getElementById("timer");
const matchedDisplay = document.getElementById("matched");
const winScreen = document.getElementById("winScreen");
const winTitle = document.getElementById("winTitle");
const starImage = document.getElementById("starImage");
const levelLabel = document.getElementById("winLevelNumber");
const finalTime = document.getElementById("finalTime");
const nextButton = document.getElementById("nextLevelBtn");

let firstCard = null;
let secondCard = null;
let matched = 0;
let startTime, timerInterval;
let lockBoard = false;
let pausedTime = 0;

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function generateCards() {
  const uniqueCards = shuffleArray([...Array(27).keys()].map((i) => i + 1)).slice(0, totalPairs);
  const cards = shuffleArray([...uniqueCards, ...uniqueCards]);

  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(${gridLayout[0]}, 1fr)`;

  cards.forEach((id) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = id;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-back" style="background-image: url('assets/images/card/back/Back-Card.png');"></div>
        <div class="card-front" style="background-image: url('assets/images/card/front/Front-Card-${id}.png');"></div>
      </div>`;
    card.addEventListener("click", () => handleFlip(card));
    gameBoard.appendChild(card);
  });
}

function handleFlip(card) {
  if (lockBoard || card.classList.contains("matched") || card === firstCard) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.id === secondCard.dataset.id;
  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matched++;
    matchedDisplay.textContent = `${matched} / ${totalPairs}`;
    resetFlip();

    if (matched === totalPairs) endGame(false);
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetFlip();
    }, 900);
  }
}

function resetFlip() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function startTimer() {
  startTime = Date.now() - pausedTime;
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    pausedTime = elapsed;
    const sec = Math.floor(elapsed / 1000);
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    timerDisplay.textContent = `${m}:${s}`;

    if (sec >= maxTime) endGame(true);
  }, 500);
}

function endGame(isTimeOut = false) {
  clearInterval(timerInterval);
  const seconds = Math.floor(pausedTime / 1000);
  finalTime.textContent = timerDisplay.textContent;

  let stars = 1;
  const ratio = (maxTime - seconds) / maxTime;
  if (ratio >= 0.7) stars = 3;
  else if (ratio >= 0.4) stars = 2;
  else if (seconds < maxTime) stars = 1;
  else stars = 0;

  const isLose = stars === 0 || isTimeOut;
  const isQualified = stars === 3;

  winTitle.textContent = isLose ? "You Lose" : "Level Up!";
  levelLabel.textContent = currentLevel;
  starImage.src = `assets/images/star-${stars}.png`;
  starImage.classList.remove("animate");
  starImage.onload = () => starImage.classList.add("animate");

  const wardekaStars = JSON.parse(localStorage.getItem("wardekaStars") || "{}");
  const prevStars = wardekaStars[currentLevel] || 0;
  if (stars > prevStars) {
    saveStarToFirestore(`level${currentLevel}`, stars);
  }

  const infoNote = document.createElement("p");
  infoNote.style.fontSize = "12px";
  infoNote.style.color = "#FFDF7F";
  infoNote.style.fontFamily = "'Barlow Condensed', sans-serif";
  infoNote.style.marginBottom = "10px";
  infoNote.textContent = "Kamu harus mendapatkan 3 bintang untuk melanjutkan level berikutnya.";

  const buttonGroup = document.querySelector(".button-group");
  const existingNote = document.querySelector(".button-group + p");

  if (!isQualified && !existingNote) {
    buttonGroup.parentNode.insertBefore(infoNote, buttonGroup);
  }

  nextButton.textContent = isQualified ? "NEXT LEVEL" : "TRY AGAIN";

  nextButton.onclick = () => {
    if (!isQualified) {
      window.location.href = `game.html?level=${currentLevel}`;
    } else if (currentLevel < 10) {
      window.location.href = `game.html?level=${currentLevel + 1}`;
    } else {
      localStorage.setItem("wardekaLevelComplete", "10");
      window.location.href = "redeem.html";
    }
  };

  winScreen.style.display = "flex";
}

function goToMenu() {
  window.location.href = "level.html";
}

async function checkLevelAccess() {
  const levelKey = `level${currentLevel - 1}`;
  const prevStars = userStars[levelKey] || 0;

  if (currentLevel > 1 && prevStars < 3) {
    alert(`🔒 Level ${currentLevel} belum terbuka!\nSelesaikan level ${currentLevel - 1} dengan 3 bintang terlebih dahulu.`);
    window.location.href = "level.html";
  }
}

async function saveStarToFirestore(levelId, starsEarned) {
  if (!currentUser) return;

  const userRef = window.db.collection("users").doc(currentUser.uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) return;

  const userData = userSnap.data();
  const currentStars = userData.stars?.[levelId] || 0;

  if (starsEarned > currentStars) {
    await userRef.update({ [`stars.${levelId}`]: starsEarned });
    console.log(`Updated ${levelId} to ${starsEarned} stars`);
  }
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    window.db
      .collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          userStars = doc.data().stars || {};
          window.userStars = userStars;
        }
        initGame();
      });
  } else {
    alert("Silakan login terlebih dahulu.");
    window.location.href = "index.html";
  }
});

function initGame() {
  checkLevelAccess();
  matched = 0;
  pausedTime = 0;
  winScreen.style.display = "none";
  matchedDisplay.textContent = `0 / ${totalPairs}`;
  generateCards();
  startTimer();
}
