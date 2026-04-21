/**
 * APP.JS - Configuration Globale et Authentification
 */

// --- 1. CONNEXION TWITCH ---
function loginWithTwitch() {
    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${CONFIG.CLIENT_ID}&redirect_uri=${encodeURIComponent(CONFIG.REDIRECT_URI)}&response_type=token&scope=user:read:follows`;
    window.location.href = url;
}

function checkAuth() {
    const token = localStorage.getItem("twitch_token");
    const path = window.location.pathname;
    
    const isAuthPage = path.includes("index.html") || path === "/" || path.includes("auth-relay.html");

    // Si pas de token et on n'est pas sur la page de connexion -> Dehors !
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
    localStorage.removeItem("twitch_user_id");
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