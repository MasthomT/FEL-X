// CONFIGURATION ET AUTH (IDENTIQUE AUX AUTRES)
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

function calculateLevel(xp) {
    if (xp < 0) return 1;
    const level = Math.floor(Math.pow(Math.max(0, xp + 1e-9) / 100, 1 / 2.2)) + 1;
    return Math.max(1, level);
}

// CHARGEMENT DU CLASSEMENT
document.addEventListener("DOMContentLoaded", async () => {
    const loadingEl = document.getElementById("leaderboard-loading");
    const listEl = document.getElementById("leaderboard-list");
    const token = localStorage.getItem("twitch_token");

    if (!token) {
        window.location.replace("/index.html");
        return;
    }

    try {
        // 1. Récupérer les données XP depuis Firebase
        // ATTENTION : On suppose que vos données sont dans 'viewer_data/xp'
        const snapshot = await db.ref('viewer_data/xp').once('value');
        const xpData = snapshot.val();

        if (!xpData) {
            loadingEl.textContent = "Aucune donnée d'XP trouvée pour le moment.";
            return;
        }

        // 2. Convertir en tableau pour trier
        // Format attendu: { "pseudo_lower": { "xp": 1000, "username": "Pseudo" } }
        let usersArray = [];
        
        for (const [key, val] of Object.entries(xpData)) {
            // Sécurité : on vérifie que l'objet a bien de l'XP
            if (val && typeof val.xp === 'number') {
                usersArray.push({
                    username: val.username || key, // Fallback sur la clé si pas de username
                    xp: val.xp,
                    level: val.level || calculateLevel(val.xp)
                });
            }
        }

        // 3. Trier par XP décroissant
        usersArray.sort((a, b) => b.xp - a.xp);

        // 4. Afficher le Top 50
        listEl.innerHTML = "";
        const topUsers = usersArray.slice(0, 50);

        topUsers.forEach((user, index) => {
            const li = document.createElement("li");
            li.className = "leaderboard-item";
            
            // On crée le HTML de la ligne
            li.innerHTML = `
                <span class="rank">#${index + 1}</span>
                <div class="user-info">
                    <span class="name">${user.username}</span>
                    <span class="level">Niveau ${user.level}</span>
                </div>
                <div class="xp-info">
                    ${user.xp.toLocaleString()} <span>XP</span>
                </div>
            `;
            listEl.appendChild(li);
        });

        loadingEl.style.display = "none";
        listEl.style.display = "flex";

    } catch (error) {
        console.error("Erreur Leaderboard:", error);
        loadingEl.textContent = "Erreur de chargement. Vérifiez la console (F12).";
    }
});