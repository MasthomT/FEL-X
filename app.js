/**
 * APP.JS - Configuration Globale et Authentification
 */

// --- 1. CONNEXION TWITCH ---
function loginWithTwitch() {
    // Sécurité : Vérifie si config.js est bien chargé
    if (typeof CONFIG === 'undefined') {
        alert("Erreur: Le fichier config.js est introuvable. Vérifie qu'il est bien sur Vercel !");
        return;
    }

    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${CONFIG.CLIENT_ID}&redirect_uri=${encodeURIComponent(CONFIG.REDIRECT_URI)}&response_type=token&scope=user:read:follows`;
    window.location.href = url;
}

function checkAuth() {
    // 1. Capture du Token si on revient de la page Twitch
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get("access_token");
        if (token) {
            localStorage.setItem("twitch_token", token);
            // On nettoie l'URL pour faire propre
            window.history.replaceState(null, null, window.location.pathname);
        }
    }

    const token = localStorage.getItem("twitch_token");
    const path = window.location.pathname;
    
    // On repère si on est sur la page de connexion
    const isAuthPage = path.includes("index.html") || path === "/" || path.endsWith("/");

    // 2. Si pas de token et on n'est pas sur la page de connexion -> Dehors !
    if (!token && !isAuthPage) {
        console.warn("⚠️ Aucun token trouvé, redirection vers l'accueil.");
        window.location.href = "index.html";
        return null;
    }

    // 3. Si on a le token et qu'on est sur l'accueil -> Go Profil !
    if (token && isAuthPage) {
        window.location.href = "profile.html";
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