const btnPlay = document.getElementById("btnPlay");
const btnLoginGoogle = document.getElementById("btnLoginGoogle");

if (btnLoginGoogle && btnPlay) {
  let currentUser = null;
  let userStars = {};

  btnLoginGoogle.addEventListener("click", async () => {
    try {
      const result = await firebase.auth().signInWithPopup(window.provider);
      currentUser = result.user;

      const userRef = window.db.collection("users").doc(currentUser.uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        await userRef.set({
          name: currentUser.displayName,
          email: currentUser.email,
          stars: {},
        });
        userStars = {};
      } else {
        userStars = userSnap.data().stars || {};
      }

      btnPlay.disabled = false;
      btnLoginGoogle.innerHTML = `${currentUser.displayName}`;
      console.log("Login success:", currentUser.displayName);

      window.currentUser = currentUser;
      window.userStars = userStars;
    } catch (error) {
      console.error("Login failed", error);
    }
  });

  // ⏯️ Selalu aktifkan tombol Play, tapi cek login saat diklik
  btnPlay.disabled = false;
  btnPlay.addEventListener("click", () => {
    if (window.currentUser) {
      window.location.href = "level.html";
    } else {
      const modal = document.getElementById("modalLoginRequired");
      if (modal) {
        modal.style.display = "flex";
      } else {
        alert("Silakan login terlebih dahulu.");
      }
    }
  });
}
