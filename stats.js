document.addEventListener("DOMContentLoaded", async () => {
    const token = checkAuth(); 
    if(!token) return;

    const loadingEl = document.getElementById("loading");
    const contentEl = document.getElementById("stats-content");

    const API_URL = CONFIG.API_BASE_URL || "http://127.0.0.1:8000/api";
    const CLIENT_ID = CONFIG.CLIENT_ID;
    const BROADCASTER_NAME = "masthom_";

    try {
        loadingEl.textContent = "Récupération des statistiques...";
        
        // On récupère toute la liste et on fait les maths
        const response = await fetch(`${API_URL}/viewers`);
        if (!response.ok) throw new Error("Le bot ne répond pas.");
        const allData = await response.json();

        // Stats globales
        const totalMembers = allData.length;
        const totalXP = allData.reduce((sum, v) => sum + v.points, 0);
        const maxLevel = allData.length > 0 ? Math.max(...allData.map(v => v.level)) : 1;
        
        document.getElementById("total-members").textContent = totalMembers.toLocaleString();
        document.getElementById("total-xp").textContent = totalXP.toLocaleString();
        document.getElementById("max-level").textContent = maxLevel;
        
        if (totalMembers > 0) {
            const avgXP = totalXP / totalMembers;
            document.getElementById("avg-level").textContent = calculateLevel(avgXP);
        }

        // Élite Top 5
        const topContainer = document.getElementById("top-5-list");
        if (topContainer) {
            topContainer.innerHTML = ""; 

            const filteredTop = allData.filter(u => {
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
                    <span style="color:var(--accent); font-weight:bold;">Niv. ${u.level}</span>
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