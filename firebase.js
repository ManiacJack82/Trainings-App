// Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// Auth Listener
firebase.auth().onAuthStateChanged(user => {
  if (!user && location.pathname.includes("app.html")) {
    location.href = "index.html";
  }
});

