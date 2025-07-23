// js/reward.js

const rewardContainer = document.getElementById("rewardContainer");
const copyBtn = document.getElementById("copyCodeBtn");
const codeText = document.getElementById("rewardCode");

async function fetchRewardCode() {
  try {
    const response = await fetch("data/rewardCodes.json");
    const data = await response.json();

    const user = JSON.parse(localStorage.getItem("wardekaUser"));
    const email = user?.email || "default";
    const rewardCode = data.users?.[email] || data.default;
    codeText.textContent = rewardCode;
  } catch (err) {
    codeText.textContent = "Gagal memuat kode";
  }
}

copyBtn.addEventListener("click", () => {
  const text = codeText.textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = "COPIED!";
      setTimeout(() => (copyBtn.textContent = "COPY CODE"), 1500);
    }).catch(() => {
      alert("Gagal menyalin kode.");
    });
  } else {
    alert("Fitur salin tidak didukung browser ini.");
  }
});

fetchRewardCode();
