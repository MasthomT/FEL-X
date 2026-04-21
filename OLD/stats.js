document.addEventListener("DOMContentLoaded", async () => {
    const token = checkAuth(); 
    if(!token) return;

    const loadingEl = document.getElementById("loading");
    const contentEl = document.getElementById("stats-content");

    const API_URL = CONFIG.API_BASE_URL;
    const CLIENT_ID = CONFIG.CLIENT_ID;
    const BROADCASTER_NAME = CONFIG.BROADCASTER_NAME || "masthom_";

    try {
        loadingEl.textContent = "Récupération des statistiques du Bot...";
        
        // AJOUT DU "/v1/" ICI AUSSI 🔥
        const response = await fetch(`${API_URL}/v1/global_stats`, {
            headers: { "Accept": "application/json" }
        });
        
        if (!response.ok) throw new Error("Le bot ne répond pas.");
        const data = await response.json();

        document.getElementById("total-members").textContent = (data.total_members || 0).toLocaleString();
        document.getElementById("total-xp").textContent = (data.total_xp || 0).toLocaleString();
        document.getElementById("max-level").textContent = calculateLevel(data.max_xp || 0);
        
        if (data.total_members > 0) {
            const avgXP = data.total_xp / data.total_members;
            document.getElementById("avg-level").textContent = calculateLevel(avgXP);
        } else {
            document.getElementById("avg-level").textContent = 1;
        }

        const topContainer = document.getElementById("top-5-list");
        if (topContainer && data.top5) {
            topContainer.innerHTML = ""; 
            const filteredTop = data.top5.filter(u => {
                const n = u.username.toLowerCase();
                return n !== "masthom_" && n !== "felixthebigblackcat" && n !== "streamelements" && n !== "wizebot";
            });

            filteredTop.slice(0, 5).forEach((u, i) => { 
                const li = document.createElement("li");
                li.className = "top-item";
                
                let rankBadge = `<span class="rank-badge">${i+1}</span>`;
                if (i === 0) rankBadge = `<span class="rank-badge rank-1">1</span>`;
                if (i === 1) rankBadge = `<span class="rank-badge rank-2">2</span>`;
                if (i === 2) rankBadge = `<span class="rank-badge rank-3">3</span>`;

                li.innerHTML = `
                    <div style="display:flex; align-items:center; gap:10px;">
                        ${rankBadge} <span style="font-weight:600; color:white;">${u.username}</span>
                    </div>
                    <span style="color:var(--accent); font-weight:bold;">Niv. ${calculateLevel(u.points)}</span>
                `;
                topContainer.appendChild(li);
            });
        }
        
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
        loadingEl.innerHTML = `<div style="color:var(--danger);">Erreur de connexion avec le Bot Cloudflare.</div>`;
    }
});