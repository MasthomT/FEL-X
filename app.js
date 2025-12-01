// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyAK0b_n1yTPKGKIZ4TuUmpBNPb3aoVvCI8",
    authDomain: "fel-x-503f8.firebaseapp.com",
    databaseURL: "https://fel-x-503f8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fel-x-503f8",
    storageBucket: "fel-x-503f8.firebasestorage.app",
    messagingSenderId: "922613900734",
    appId: "1:922613900734:web:4d192151bebd5e7ac885ef"
};

// Initialisation unique
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// --- GESTION UTILISATEUR ---
function checkAuth() {
    const token = localStorage.getItem("twitch_token");
    if (!token && window.location.pathname !== "/index.html" && window.location.pathname !== "/auth.html") {
        window.location.replace("/index.html");
    }
    return token;
}

function logout() {
    localStorage.removeItem("twitch_token");
    window.location.replace("/index.html");
}

// Gestionnaire du bouton déconnexion (s'il existe sur la page)
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-sidebar");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
    
    const logoutLink = document.getElementById("logout-btn");
    if (logoutLink) logoutLink.addEventListener("click", logout);
});

// Calcul de niveau global
function calculateLevel(xp) {
    if (xp < 0) return 1;
    return Math.floor(Math.pow(Math.max(0, xp + 1e-9) / 100, 1 / 2.2)) + 1;
}