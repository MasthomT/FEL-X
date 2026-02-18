/**
 * APP.JS - Configuration Globale et Fonctions Communes
 * Projet : FEL-X System
 */

// --- 1. CONFIGURATION FIREBASE ---
// Utilisation de 'var' pour éviter les erreurs de re-déclaration si le script est chargé 2 fois
if (typeof firebaseConfig === 'undefined') {
    var firebaseConfig = {
        apiKey: "AIzaSyAK0b_n1yTPKGKIZ4TuUmpBNPb3aoVvCI8",
        authDomain: "fel-x-503f8.firebaseapp.com",
        databaseURL: "https://fel-x-503f8-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "fel-x-503f8",
        storageBucket: "fel-x-503f8.firebasestorage.app",
        messagingSenderId: "922613900734",
        appId: "1:922613900734:web:4d192151bebd5e7ac885ef"
    };
}

// Initialisation sécurisée : on ne l'initialise que si aucune instance n'existe
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig);
        console.log("🔥 Firebase initialisé avec succès.");
    } catch (e) {
        console.error("❌ Erreur lors de l'initialisation Firebase:", e);
    }
}

// --- 2. GESTION DE L'AUTHENTIFICATION TWITCH ---

/**
 * Vérifie si l'utilisateur est connecté.
 * Redirige vers l'index si le token est absent (sauf sur la page d'accueil).
 */
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

/**
 * Gère la déconnexion
 */
function logout() {
    console.log("🔌 Déconnexion en cours...");
    localStorage.removeItem("twitch_token");
    localStorage.removeItem("twitch_username");
    window.location.href = "index.html";
}

// Initialisation du bouton de déconnexion s'il existe dans le DOM
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            logout();
        };
    }
});

// --- 3. LOGIQUE DE PROGRESSION (XP & NIVEAUX) ---

/**
 * Calcule le niveau en fonction de l'XP totale.
 * Formule : Niveau = (XP / 100)^(1/2.2) + 1
 */
function calculateLevel(xp) {
    if (!xp || xp <= 0) return 1;
    // On s'assure que xp est un nombre
    const xpNum = parseFloat(xp);
    return Math.floor(Math.pow(xpNum / 100, 1 / 2.2)) + 1;
}

// --- 4. SYNCHRONISATION BACKEND (Facultatif) ---

/**
 * Envoie des données au serveur local (Raspberry Pi via Ngrok ou local)
 */
async function saveToSQL(userId, userName, payload) {
    // Note : SERVER_URL doit être défini selon ton environnement (ex: ton adresse ngrok)
    const SERVER_URL = ""; 
    if (!SERVER_URL) return;

    try {
        const response = await fetch(`${SERVER_URL}/api/update_context`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
                twitch_id: userId,
                username: userName,
                ...payload
            })
        });
        
        if (response.ok) {
            console.log("✅ Synchronisation SQL réussie !");
        } else {
            console.error("❌ Erreur serveur SQL:", response.status);
        }
    } catch (e) {
        console.error("❌ Échec de la connexion au serveur SQL:", e);
    }
}