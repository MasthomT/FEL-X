// Fonction pour calculer l'XP (doit être la même que dans app.js)
function calculateLevel(xp) {
    if (!xp || xp < 0) return 1;
    return Math.floor(Math.pow(xp / 100, 1 / 2.2)) + 1;
}

const CLIENT_ID_VERCEL = "kgyfzs0k3wk8enx7p3pd6299ro4izv";
const BROADCASTER_NAME = "masthom_";

document.addEventListener("DOMContentLoaded", async () => {
    const token = checkAuth(); // Vérifie la connexion via app.js
    if(!token) return;

    const loadingEl = document.getElementById("loading");
    const contentEl = document.getElementById("stats-content");
    const CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";
    const BROADCASTER_NAME = "masthom_";

    try {
        loadingEl.textContent = "Récupération des statistiques SQL...";
        
        // 1. Appel à ton API sur le Pi via l'URL Ngrok fixe (définie dans app.js)
        const response = await fetch(`${SERVER_URL}/api/global_stats`);
        
        if (!response.ok) throw new Error("Le serveur Pi ne répond pas.");
        
        const data = await response.json();

        // 2. Remplissage des blocs de chiffres avec les données du SQL
        // Utilisation des clés envoyées par ton Python : totalMembers, totalXP, maxLevel
        document.getElementById("total-members").textContent = (data.totalMembers || 0).toLocaleString();
        document.getElementById("total-xp").textContent = (data.totalXP || 0).toLocaleString();
        document.getElementById("max-level").textContent = data.maxLevel || 1;
        
        // Calcul du niveau moyen (Total XP / Nombre de membres)
        if (data.totalMembers > 0) {
            const avgXP = data.totalXP / data.totalMembers;
            document.getElementById("avg-level").textContent = calculateLevel(avgXP);
        }

        // 3. Affichage du Top 5 (L'Élite)
        const topContainer = document.getElementById("top-5-list");
        topContainer.innerHTML = "";

        if (data.top5 && data.top5.length > 0) {
            data.top5.forEach((u, i) => {
                let rankBadge = `<span class="rank-badge" style="color:#777; border-color:#777;">${i+1}</span>`;
                if (i === 0) rankBadge = `<span class="rank-badge rank-1">1</span>`;
                if (i === 1) rankBadge = `<span class="rank-badge rank-2">2</span>`;
                if (i === 2) rankBadge = `<span class="rank-badge rank-3">3</span>`;

                topContainer.innerHTML += `
                    <li class="top-item">
                        <div style="display:flex; align-items:center; gap:10px;">
                            ${rankBadge}
                            <span style="font-weight:600;">${u.name}</span>
                        </div>
                        <span style="color:var(--accent); font-weight:bold;">Niv. ${calculateLevel(u.xp)}</span>
                    </li>
                `;
            });
        }

        // 4. Objectif Followers (Via Twitch API)
        const headers = { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID };
        
        // Récupération de l'ID du streamer
        const userResp = await fetch(`https://api.twitch.tv/helix/users?login=${BROADCASTER_NAME}`, { headers });
        const userData = await userResp.json();
        
        if (userData.data && userData.data.length > 0) {
            const broadcasterId = userData.data[0].id;
            
            // Récupération du nombre de followers
            const followResp = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${broadcasterId}`, { headers });
            const followData = await followResp.json();
            
            const currentFollows = followData.total;
            const GOAL = 1500;
            const percent = Math.min(100, Math.floor((currentFollows / GOAL) * 100));

            document.getElementById("current-follows").textContent = currentFollows.toLocaleString();
            document.getElementById("goal-fill").style.width = percent + "%";
            document.getElementById("goal-text").textContent = percent + "%";
        }

        // Affichage final
        loadingEl.style.display = "none";
        contentEl.style.display = "grid";

    } catch (error) {
        console.error("Erreur Stats:", error);
        
        // Gestion de l'erreur de token (401)
        if (error.message && error.message.includes("401")) {
             localStorage.removeItem("twitch_token");
             window.location.href = "/";
             return;
        }

        loadingEl.innerHTML = `
            <div style="color:var(--danger); border:1px solid; padding:15px; border-radius:8px;">
                <strong>Erreur de chargement</strong><br>
                Impossible de joindre le serveur SQL via Ngrok.<br>
                <small>${error.message}</small>
            </div>`;
    }
});