// =================================================================
// 1. CONFIGURATION (Identique à app.js)
// =================================================================

// Cible le bouton de déconnexion
if(document.getElementById("logout-sidebar")) {
    document.getElementById("logout-sidebar").onclick = function() {
        localStorage.removeItem("twitch_token");
        window.location.replace("/index.html");
    };
}

const firebaseConfig = {
    apiKey: "AIzaSyAK0b_n1yTPKGKIZ4TuUmpBNPb3aoVvCI8",
    authDomain: "fel-x-503f8.firebaseapp.com",
    databaseURL: "https://fel-x-503f8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fel-x-503f8",
    storageBucket: "fel-x-503f8.firebasestorage.app",
    messagingSenderId: "922613900734",
    appId: "1:922613900734:web:4d192151bebd5e7ac885ef"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Fonction de calcul de niveau (copiée de app.js)
function calculateLevel(xp) {
    if (xp < 0) return 1;
    const level = Math.floor(Math.pow(Math.max(0, xp + 1e-9) / 100, 1 / 2.2)) + 1;
    return Math.max(1, level);
}

// =================================================================
// 2. LOGIQUE DU CLASSEMENT
// =================================================================
(async function loadLeaderboard() {
    const token = localStorage.getItem("twitch_token");
    if (!token) {
        window.location.replace("/index.html");
        return;
    }

    const CLIENT_ID = "8jpfq5497uee7kdrsx4djhb7nw2xec";
    const twitchHeaders = new Headers({
        'Authorization': `Bearer ${token}`,
        'Client-Id': CLIENT_ID
    });
    
    const loadingEl = document.getElementById("loading");
    const listEl = document.getElementById("leaderboard-list");

    try {
        // --- Étape 1: Récupérer tous les XP de Firebase ---
        const xpRef = db.ref('viewer_data/xp');
        const xpSnapshot = await xpRef.get();

        if (!xpSnapshot.exists()) {
            throw new Error("Aucune donnée d'XP trouvée dans Firebase.");
        }
        
        const xpData = xpSnapshot.val();

        // --- Étape 2: Trier les données et prendre le Top 50 ---
        const sortedUsers = Object.entries(xpData)
            .map(([login, data]) => ({
                login: login,
                xp: data.xp
            }))
            .sort((a, b) => b.xp - a.xp) // Tri décroissant par XP
            .slice(0, 50); // On garde les 50 premiers

        // --- Étape 3: Préparer l'appel à l'API Twitch ---
        // On crée une longue query string: &login=user1&login=user2...
        const loginQuery = sortedUsers.map(u => `login=${encodeURIComponent(u.login)}`).join('&');
        
        const twitchResponse = await fetch(`https://api.twitch.tv/helix/users?${loginQuery}`, { headers: twitchHeaders });
        if (!twitchResponse.ok) {
            throw new Error("Impossible de récupérer les profils Twitch.");
        }
        
        const twitchData = await twitchResponse.json();
        // Crée un 'dictionnaire' pour un accès facile: { "user1": {avatar: ...}, "user2": ... }
        const twitchUsers = twitchData.data.reduce((acc, user) => {
            acc[user.login] = {
                display_name: user.display_name,
                avatar: user.profile_image_url
            };
            return acc;
        }, {});

        // --- Étape 4: Construire le HTML ---
        listEl.innerHTML = ""; // Vider la liste
        
        sortedUsers.forEach((user, index) => {
            const rank = index + 1;
            const twitchInfo = twitchUsers[user.login];
            
            // Si le profil Twitch n'existe plus (compte banni/supprimé), on le passe
            if (!twitchInfo) return; 
            
            const level = calculateLevel(user.xp);

            const item = document.createElement("li");
            item.className = "leaderboard-item";
            item.innerHTML = `
                <span class="rank">#${rank}</span>
                <img src="${twitchInfo.avatar}" alt="" class="avatar">
                <div class="user-info">
                    <span class="name">${twitchInfo.display_name}</span>
                    <span class="level">Niveau ${level}</span>
                </div>
                <div class="xp-info">
                    ${user.xp.toLocaleString('fr-FR')} <span>XP</span>
                </div>
            `;
            listEl.appendChild(item);
        });

        // --- Étape 5: Afficher le résultat ---
        loadingEl.style.display = "none";
        listEl.style.display = "flex"; // On utilise flex-direction: column

    } catch (error) {
        console.error("Erreur lors du chargement du classement:", error);
        loadingEl.textContent = "Une erreur est survenue lors du chargement du classement.";
        if (error.message.includes("Token")) {
            localStorage.removeItem("twitch_token");
            window.location.replace("/index.html?error=session_expired");
        }
    }
})();