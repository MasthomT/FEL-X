document.addEventListener("DOMContentLoaded", async () => {
    const token = checkAuth(); 
    if(!token) return;

    const loadingEl = document.getElementById("loading");
    const contentEl = document.getElementById("stats-content");
    const CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";
    const BROADCASTER_NAME = "masthom_";

   try {
    loadingEl.textContent = "Récupération des statistiques SQL...";
    
    const response = await fetch(`${SERVER_URL}/api/global_stats`, {
        method: 'GET',
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Accept": "application/json"
        }
    });
    
    if (!response.ok) throw new Error("Le serveur Pi ne répond pas.");
    const data = await response.json();

    // 1. Remplissage des blocs numériques
    document.getElementById("total-members").textContent = (data.totalMembers || 0).toLocaleString();
    document.getElementById("total-xp").textContent = (data.totalXP || 0).toLocaleString();
    document.getElementById("max-level").textContent = data.maxLevel || 1;
    
    if (data.totalMembers > 0) {
        const avgXP = data.totalXP / data.totalMembers;
        document.getElementById("avg-level").textContent = calculateLevel(avgXP);
    }

    // 2. Remplissage de l'Élite (Top 5) - BLOC SÉCURISÉ
    const topContainer = document.getElementById("top-5-list");
    if (topContainer && data.top5) {
        topContainer.innerHTML = ""; // On vide le chargement
        
        data.top5.forEach((u, i) => {
            const li = document.createElement("li");
            li.className = "top-item";
            
            // On gère les badges de rang
            let rankBadge = `<span class="rank-badge">${i+1}</span>`;
            if (i === 0) rankBadge = `<span class="rank-badge rank-1">1</span>`;
            if (i === 1) rankBadge = `<span class="rank-badge rank-2">2</span>`;
            if (i === 2) rankBadge = `<span class="rank-badge rank-3">3</span>`;

            // On utilise u.name qui arrive de ton JSON
            li.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    ${rankBadge} <span style="font-weight:600; color:white;">${u.name}</span>
                </div>
                <span style="color:var(--accent); font-weight:bold;">Niv. ${calculateLevel(u.xp)}</span>
            `;
            topContainer.appendChild(li);
        });
    }

    // 3. Affichage du contenu
    loadingEl.style.display = "none";
    contentEl.style.display = "grid";

} catch (error) {
    console.error("ERREUR CRITIQUE STATS:", error);
    loadingEl.innerHTML = `<div style="color:var(--danger);">Erreur: ${error.message}</div>`;
}


        // Twitch API
        const headers = { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID };
        const userResp = await fetch(`https://api.twitch.tv/helix/users?login=${BROADCASTER_NAME}`, { headers });
        const userData = await userResp.json();
        
        if (userData.data && userData.data.length > 0) {
            const broadcasterId = userData.data[0].id;
            const followResp = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${broadcasterId}`, { headers });
            const followData = await followResp.json();
            
            const currentFollows = followData.total;
            const GOAL = 1500;
            const percent = Math.min(100, Math.floor((currentFollows / GOAL) * 100));

            document.getElementById("current-follows").textContent = currentFollows.toLocaleString();
            document.getElementById("goal-fill").style.width = percent + "%";
            document.getElementById("goal-text").textContent = percent + "%";
        }

        loadingEl.style.display = "none";
        contentEl.style.display = "grid";

    } catch (error) {
        console.error(error);
        loadingEl.innerHTML = `<div style="color:var(--danger);">Erreur de connexion SQL</div>`;
    }
});

function calculateLevel(xp) {
    if (!xp || xp < 0) return 1;
    return Math.floor(Math.pow(xp / 100, 1 / 2.2)) + 1;
}