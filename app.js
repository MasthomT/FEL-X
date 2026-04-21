// Lance la page de connexion officielle Twitch
function loginWithTwitch() {
    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${CONFIG.CLIENT_ID}&redirect_uri=${encodeURIComponent(CONFIG.REDIRECT_URI)}&response_type=token&scope=user:read:follows`;
    window.location.href = url;
}

// Vérifie si le viewer est connecté
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

    // 2. Vérification de la sécurité
    const token = localStorage.getItem("twitch_token");
    const path = window.location.pathname;
    const isAuthPage = path.includes("index.html") || path === "/";

    if (!token && !isAuthPage) {
        // Bloqué : Retour à l'accueil
        window.location.href = "index.html"; 
        return null;
    }

    if (token && isAuthPage) {
         // Déjà connecté : On l'envoie sur son profil
         window.location.href = "profile.html"; 
    }

    return token;
}

function logout() {
    localStorage.removeItem("twitch_token");
    localStorage.removeItem("twitch_user_id");
    localStorage.removeItem("twitch_username");
    window.location.href = "index.html";
}

// Calcule le niveau en fonction de l'EXP (Puissance 2.2)
function calculateLevel(xp) {
    if (!xp || xp <= 0) return 1;
    return Math.floor(Math.pow(xp / 100, 1 / 2.2)) + 1;
}

// Activation du bouton déconnexion commun à toutes les pages
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    }
});