document.addEventListener("DOMContentLoaded", async () => {
    const token = checkAuth(); 
    if(!token) return;

    const loadingEl = document.getElementById("loading");
    const contentEl = document.getElementById("stats-content");

    // On récupère tout depuis le fichier config.js
    const SERVER_URL = CONFIG.SERVER_URL;
    const CLIENT_ID = CONFIG.CLIENT_ID;
    const BROADCASTER_NAME = CONFIG.BROADCASTER_NAME;

    try {
        loadingEl.textContent = "Récupération des statistiques SQL...";
        
        // Préparation de l'autorisation
        const auth = btoa("masthom_admin:h7&K#p2Q9!mR5*vXzB@4sL8uN");

        const response = await fetch(`${SERVER_URL}/api/global_stats`, {
            method: 'GET',
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Accept": "application/json",
                "Authorization": `Basic ${auth}`
            }
        });
        
        if (!response.ok) throw new Error("Le serveur Pi ne répond pas.");
        const data = await response.json();

        // Remplissage des blocs numériques
        document.getElementById("total-members").textContent = (data.totalMembers || 0).toLocaleString();
        document.getElementById("total-xp").textContent = (data.totalXP || 0).toLocaleString();
        document.getElementById("max-level").textContent = data.maxLevel || 1;
        
        if (data.totalMembers > 0) {
            const avgXP = data.totalXP / data.totalMembers;
            document.getElementById("avg-level").textContent = calculateLevel(avgXP);
        }

        // Élite Top 5
        const topContainer = document.getElementById("top-5-list");
        if (topContainer && data.top5) {
            topContainer.innerHTML = ""; 
            data.top5.forEach((u, i) => {
                const li = document.createElement("li");
                li.className = "top-item";
                let rankBadge = `<span class="rank-badge">${i+1}</span>`;
                if (i === 0) rankBadge = `<span class="rank-badge rank-1">1</span>`;
                if (i === 1) rankBadge = `<span class="rank-badge rank-2">2</span>`;
                if (i === 2) rankBadge = `<span class="rank-badge rank-3">3</span>`;

                li.innerHTML = `
                    <div style="display:flex; align-items:center; gap:10px;">
                        ${rankBadge} <span style="font-weight:600; color:white;">${u.name}</span>
                    </div>
                    <span style="color:var(--accent); font-weight:bold;">Niv. ${calculateLevel(u.xp)}</span>
                `;
                topContainer.appendChild(li);
            });
        }

        // Twitch API (Followers)
        const twitchHeaders = { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID };
        const userResp = await fetch(`https://api.twitch.tv/helix/users?login=${BROADCASTER_NAME}`, { headers: twitchHeaders });
        const userData = await userResp.json();
        
        if (userData.data && userData.data.length > 0) {
            const broadcasterId = userData.data[0].id;
            const followResp = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${broadcasterId}`, { headers: twitchHeaders });
            const followData = await followResp.json();
            
            const currentFollows = followData.total;
            const percent = Math.min(100, Math.floor((currentFollows / 1500) * 100));

            document.getElementById("current-follows").textContent = currentFollows.toLocaleString();
            document.getElementById("goal-fill").style.width = percent + "%";
            document.getElementById("goal-text").textContent = percent + "%";
        }

        loadingEl.style.display = "none";
        contentEl.style.display = "grid";

    } catch (error) {
        console.error("ERREUR STATS:", error);
        loadingEl.innerHTML = `<div style="color:var(--danger);">Erreur: ${error.message}</div>`;
    }
});

function calculateLevel(xp) {
    if (!xp || xp < 0) return 1;
    return Math.floor(Math.pow(xp / 100, 1 / 2.2)) + 1;
}