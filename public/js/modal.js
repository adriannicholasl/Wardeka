// js/modal.js

const modalRestart = document.getElementById("modalRestart");
const modalPause = document.getElementById("modalPause");
const btnCancelRestart = document.getElementById("btnCancelRestart");
const btnConfirmRestart = document.getElementById("btnConfirmRestart");
const btnResume = document.getElementById("btnResume");

// Tombol RESTART
const restartBtn = document.getElementById("restartBtn");
if (restartBtn) {
  restartBtn.onclick = () => {
    clearInterval(timerInterval);
    modalRestart.style.display = "flex";
  };
}

// Tombol PAUSE
const pauseBtn = document.getElementById("pauseBtn");
if (pauseBtn) {
  pauseBtn.onclick = () => {
    clearInterval(timerInterval);
    modalPause.style.display = "flex";
  };
}

// Tombol RESUME dari modal pause
if (btnResume) {
  btnResume.onclick = () => {
    modalPause.style.display = "none";
    startTimer();
  };
}

// Tombol CANCEL dari modal restart
if (btnCancelRestart) {
  btnCancelRestart.onclick = () => {
    modalRestart.style.display = "none";
    startTimer();
  };
}

// Tombol CONFIRM restart
if (btnConfirmRestart) {
  btnConfirmRestart.onclick = () => {
    modalRestart.style.display = "none";
    initGame();
  };
}
