// ==========================================
// 1. CONFIGURATION FIREBASE (REPRISE)
// ==========================================
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
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// ==========================================
// 2. SÉCURITÉ & AUTHENTIFICATION
// ==========================================

/**
 * Vérifie si l'utilisateur est connecté.
 * Redirige vers l'index si le token est absent.
 */
function checkAuth() {
    const token = localStorage.getItem("twitch_token");
    const path = window.location.pathname;
    
    // Pages publiques qui ne nécessitent pas de token
    const isPublicPage = path === "/" || path === "/index" || path === "/index.html" || path === "/auth-relay";

    if (!token && !isPublicPage) {
        window.location.href = "/";
        return null;
    }
    return token;
}

/**
 * Déconnexion propre
 */
function logout() {
    localStorage.removeItem("twitch_token");
    window.location.href = "/";
}

// Liaison automatique du bouton déconnexion s'il existe
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "logout-btn") {
        e.preventDefault();
        logout();
    }
});

// ==========================================
// 3. LOGIQUE GAMING (XP & NIVEAUX)
// ==========================================

/**
 * Calcule le niveau à partir de l'XP
 * Formule : Niveau = (XP / 100)^(1 / 2.2) + 1
 */
function calculateLevel(xp) {
    if (!xp || xp < 0) return 1;
    return Math.floor(Math.pow(Math.max(0, xp) / 100, 1 / 2.2)) + 1;
}

/**
 * Récupère l'ID utilisateur Twitch à partir du token
 */
async function getUserId(token) {
    try {
        const resp = await fetch('https://api.twitch.tv/helix/users', {
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Client-Id': CONFIG.CLIENT_ID 
            }
        });
        const data = await resp.json();
        return data.data[0].id;
    } catch (err) {
        console.error("Impossible de récupérer l'ID Twitch", err);
        return null;
    }
}

// ==========================================
// 4. UTILITAIRES INTERFACE
// ==========================================

// Gestion du chargement (Overlay)
function hideLoading() {
    const loader = document.getElementById("loading-overlay");
    if (loader) loader.style.display = "none";
}

function showLoading(text = "Chargement...") {
    const loader = document.getElementById("loading-overlay");
    if (loader) {
        loader.textContent = text;
        loader.style.display = "flex";
    }
}