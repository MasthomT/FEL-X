
// CONFIGURATION A REMPLIR AVEC VOS INFOS FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyAK0b_n1yTPKGKIZ4TuUmpBNPb3aoVvCI8",
    authDomain: "fel-x-503f8.firebaseapp.com",
    databaseURL: "https://fel-x-503f8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fel-x-503f8",
    storageBucket: "fel-x-503f8.firebasestorage.app",
    messagingSenderId: "922613900734",
    appId: "1:922613900734:web:4d192151bebd5e7ac885ef"
};

// Initialisation Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Configuration Twitch
const TWITCH_CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";
const STREAMER_NAME = "masthom_";

// Gestion Auth
function getAuthHeaders() {
    const token = localStorage.getItem("twitch_token");
    if (!token) return null;
    return {
        'Authorization': `Bearer ${token}`,
        'Client-Id': TWITCH_CLIENT_ID
    };
}

function logout() {
    localStorage.removeItem("twitch_token");
    window.location.href = "/index.html";
}

// Vérification de connexion globale
function checkAuth() {
    if (!localStorage.getItem("twitch_token") && window.location.pathname !== "/index.html" && window.location.pathname !== "/") {
        window.location.href = "/index.html";
    }
}

// Fonction utilitaire pour formater les dates
function formatDate(isoString) {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

// Exécution au chargement
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
    });
});