// On attend que Firebase soit dispo via app.js
document.addEventListener("DOMContentLoaded", async () => {
    checkAuth(); // Vérification de la connexion (fonction supposée dans app.js)

    const loadingEl = document.getElementById("loading");
    const containerEl = document.getElementById("leaderboard-container");
    const listEl = document.getElementById("leaderboard-list");
    const podiumEl = document.getElementById("podium-container");
    const db = firebase.database();
    
    const token = localStorage.getItem("twitch_token");
    const CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";

    try {
        // 1. RÉCUPÉRATION DES DONNÉES
        const snapshot = await db.ref('viewer_data/xp').once('value');
        const xpData = snapshot.val();

        if (!xpData) {
            loadingEl.textContent = "Aucune donnée d'XP trouvée.";
            return;
        }

        // 2. TRAITEMENT DES DONNÉES (Gestion format Objet et Nombre)
        let usersArray = [];
        for (const [key, val] of Object.entries(xpData)) {
            let xpValue = 0;
            let usernameValue = key;
            let watchtimeValue = 0;
            
            if (val && typeof val === 'object') {
                // Nouveau format (Objet envoyé par le bot)
                xpValue = val.xp || 0;
                usernameValue = val.username || key;
                watchtimeValue = val.watchtime_seconds || 0;
            } else if (typeof val === 'number') {
                // Ancien format (Nombre seul dans Firebase)
                xpValue = val;
            }

            // On n'ajoute que les utilisateurs ayant de l'XP
            if (xpValue > 0) {
                usersArray.push({
                    username: usernameValue,
                    key: key, // login twitch minuscule
                    xp: xpValue,
                    watchtime_seconds: watchtimeValue,
                    level: calculateLevel(xpValue)
                });
            }
        }

        // Tri par XP descendant
        usersArray.sort((a, b) => b.xp - a.xp);

        // --- 3. GESTION DU PODIUM (TOP 3) ---
        const top3 = usersArray.slice(0, 3);
        const rest = usersArray.slice(3, 50); // Top 50

        let top3HTML = "";
        
        // Récupération des avatars Twitch si le token est présent
        let twitchUsers = [];
        if (token && top3.length > 0) {
            try {
                const logins = top3.map(u => `login=${u.key}`).join('&');
                const resp = await fetch(`https://api.twitch.tv/helix/users?${logins}`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID }
                });
                const data = await resp.json();
                twitchUsers = data.data || [];
            } catch (e) {
                console.error("Erreur API Twitch Avatars:", e);
            }
        }

        top3.forEach((user, index) => {
            const rank = index + 1;
            const tUser = twitchUsers.find(u => u.login.toLowerCase() === user.key.toLowerCase());
            const avatar = tUser ? tUser.profile_image_url : "logo-felix.png";

            // Calcul watchtime pour le podium
            const hours = Math.floor(user.watchtime_seconds / 3600);
            const mins = Math.floor((user.watchtime_seconds % 3600) / 60);

            top3HTML += `
                <div class="podium-item place-${rank}">
                    <img src="${avatar}" class="podium-avatar">
                    <div class="podium-rank">${rank}</div>
                    <div class="podium-name">${user.username}</div>
                    <div class="podium-xp">Niv. ${user.level}</div>
                    <small style="color:var(--accent); font-weight:bold;">${user.xp.toLocaleString()} XP</small>
                    <div style="font-size:0.7rem; color:var(--text-dim); margin-top:2px;">🕒 ${hours}h ${mins}m</div>
                </div>
            `;
        });

        if (podiumEl) podiumEl.innerHTML = top3HTML;

        // --- 4. GESTION DU RESTE (TABLEAU) ---
        listEl.innerHTML = "";
        rest.forEach((user, index) => {
            const rank = index + 4;
            const hours = Math.floor(user.watchtime_seconds / 3600);
            const mins = Math.floor((user.watchtime_seconds % 3600) / 60);

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>#${rank}</td>
                <td style="font-weight:500;">${user.username}</td>
                <td><span style="background:var(--surface); padding:2px 8px; border-radius:4px; font-size:0.9em;">Niv. ${user.level}</span></td>
                <td style="text-align:right;">
                    <div style="color:var(--accent); font-weight:bold;">${user.xp.toLocaleString()} XP</div>
                    <div style="font-size:0.75rem; color:var(--text-dim);">🕒 ${hours}h ${mins}m</div>
                </td>
            `;
            listEl.appendChild(tr);
        });

        // Affichage final
        loadingEl.style.display = "none";
        if (containerEl) containerEl.style.display = "block";

    } catch (error) {
        console.error("Erreur Leaderboard:", error);
        loadingEl.textContent = "Erreur lors du chargement des données.";
    }
});

// Fonction de calcul de niveau (doublon de app.js par sécurité)
function calculateLevel(xp) {
    if (!xp || xp < 0) return 1;
    return Math.floor(Math.pow(xp / 100, 1 / 2.2)) + 1;
}