// js/auth.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import { firebaseConfig } from "../libs/firebase.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("googleLoginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("wardekaUser", JSON.stringify({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      }));
      window.location.href = "level.html";
    } catch (error) {
      alert("Login gagal: " + error.message);
    }
  });
}

// Auto-redirect jika sudah login
onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.endsWith("index.html")) {
    window.location.href = "level.html";
  }
});
