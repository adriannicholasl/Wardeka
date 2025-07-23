// firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyBI6qdb9K50spCADts-JBVVtNPHPRrV_QM",
  authDomain: "wardeka-memory-game.firebaseapp.com",
  projectId: "wardeka-memory-game",
  storageBucket: "wardeka-memory-game.appspot.com",
  messagingSenderId: "754181412408",
  appId: "1:754181412408:web:4f265be9356bef5b1138cd",
  measurementId: "G-3KTHVD6QFS",
};

// Inisialisasi
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();

// Simpan ke global window
window.auth = auth;
window.provider = provider;
window.db = db;
