/**
 * APP.JS - Configuration Globale et Fonctions Communes
 * Projet : FEL-X System (Connecté à FastAPI / Ngrok)
 */

// --- 1. GESTION DE L'AUTHENTIFICATION TWITCH ---
function checkAuth() {
    const token = localStorage.getItem("twitch_token");
    const path = window.location.pathname;
    
    // On ne redirige pas si on est déjà sur la page de login ou d'auth
    const isAuthPage = path.includes("index.html") || path === "/" || path.includes("auth.html");

    if (!token && !isAuthPage) {
        console.warn("⚠️ Aucun token trouvé, redirection vers l'accueil.");
        window.location.href = "index.html";
        return null;
    }
    return token;
}

function logout() {
    console.log("🔌 Déconnexion en cours...");
    localStorage.removeItem("twitch_token");
    localStorage.removeItem("twitch_username");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            logout();
        };
    }
});

// --- 2. LOGIQUE DE PROGRESSION (XP & NIVEAUX) ---
function calculateLevel(xp) {
    if (!xp || xp <= 0) return 1;
    const xpNum = parseFloat(xp);
    return Math.floor(Math.pow(xpNum / 100, 1 / 2.2)) + 1;
}