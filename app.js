// Import the necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoLkNWHvtAlruSTlxU79A60HzzMGkdVSY",
  authDomain: "aligned-fan-replacement.firebaseapp.com",
  projectId: "aligned-fan-replacement",
  storageBucket: "aligned-fan-replacement.appspot.com",
  messagingSenderId: "926247244763",
  appId: "1:926247244763:web:d4f3da9d16635ab5c50dfe",
  measurementId: "G-EK0GTQNMK3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore();

// DOM Elements
const loginButton = document.getElementById("loginButton");
const signOutButton = document.getElementById("signOutButton");
const addSiteForm = document.getElementById("addSiteForm");

// Handle Google Sign-In
if (loginButton) {
  loginButton.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("User signed in:", result.user.displayName);
        toggleDashboardVisibility(true);
        loadDashboardData();
      })
      .catch((error) => console.error("Sign-in error:", error));
  });
}

// Handle Sign-Out
if (signOutButton) {
  signOutButton.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        toggleDashboardVisibility(false);
      })
      .catch((error) => console.error("Sign-out error:", error));
  });
}

// Toggle visibility between login and dashboard
function toggleDashboardVisibility(isLoggedIn) {
  document.getElementById("loginSection").style.display = isLoggedIn
    ? "none"
    : "block";
  document.getElementById("dashboardSection").style.display = isLoggedIn
    ? "block"
    : "none";
}

// Load Dashboard Data
async function loadDashboardData() {
  const sitesGrid = document.getElementById("sitesGrid");
  sitesGrid.innerHTML = ""; // Clear previous data

  const querySnapshot = await getDocs(collection(db, "fanReplacements"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    sitesGrid.innerHTML += `
      <div class="stat-card">
        <div class="stat-value">${data.siteName}</div>
        <div class="stat-label">Fans Replaced: ${data.fansReplaced}</div>
        <div class="stat-label">Time: ${new Date(data.timestamp.seconds * 1000).toLocaleString()}</div>
      </div>
    `;
  });
}

// Add Site Form Submission
if (addSiteForm) {
  addSiteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const siteName = document.getElementById("siteName").value;
    const totalFans = parseInt(document.getElementById("totalFans").value);

    try {
      await addDoc(collection(db, "fanReplacements"), {
        siteName,
        fansReplaced: totalFans,
        timestamp: new Date(),
      });
      console.log("Site added successfully!");
      loadDashboardData();
      addSiteForm.reset();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  });
}
