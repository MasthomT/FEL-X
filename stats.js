// Fonction pour calculer l'XP (doit être la même que dans app.js)
function calculateLevel(xp) {
    if (!xp || xp < 0) return 1;
    // Formule exacte du bot : (XP/100)^(1/2.2) + 1
    return Math.floor(Math.pow(xp / 100, 1 / 2.2)) + 1;
}

const CLIENT_ID_VERCEL = "kgyfzs0k3wk8enx7p3pd6299ro4izv";
const BROADCASTER_NAME = "masthom_";

document.addEventListener("DOMContentLoaded", async () => {
    const token = checkAuth();
    if(!token) return;

    const loadingEl = document.getElementById("loading");
    const contentEl = document.getElementById("stats-content");
    const db = firebase.database();

    try {
        // 1. DONNÉES FIREBASE (XP Communauté)
        const xpSnapshot = await db.ref('viewer_data/xp_data').once('value');
        const xpData = xpSnapshot.val() || {};

        if (Object.keys(xpData).length === 0) {
            loadingEl.textContent = "Aucune donnée disponible.";
            return;
        }

        // Calculs
        let users = [];
        let totalXP = 0;
        let totalLevels = 0;
        let maxLvl = 0;

        Object.entries(xpData).forEach(([key, val]) => {
    let xpValue = 0;
    let usernameValue = key;

    // On gère les deux formats : Objet {xp: ..., username: ...} ou juste un nombre
    if (val && typeof val === 'object') {
        xpValue = parseInt(val.xp) || 0; // On force la conversion en nombre
        usernameValue = val.username || key;
    } else if (typeof val === 'number') {
        xpValue = val;
    }

    if (xpValue > 0) {
        const lvl = calculateLevel(xpValue);
        totalXP += xpValue;
        totalLevels += lvl;
        if (lvl > maxLvl) maxLvl = lvl;
        
        users.push({ name: usernameValue, xp: xpValue, level: lvl });
    }
});

        const totalMembers = users.length;
        const avgLvl = totalMembers > 0 ? (totalLevels / totalMembers).toFixed(1) : 0;

        // Affichage Gauche
        document.getElementById("total-members").textContent = totalMembers.toLocaleString();
        document.getElementById("total-xp").textContent = totalXP.toLocaleString();
        document.getElementById("max-level").textContent = maxLvl;
        document.getElementById("avg-level").textContent = avgLvl;

        // Affichage Droite (Top 5)
        users.sort((a, b) => b.xp - a.xp);
        const topContainer = document.getElementById("top-5-list");
        topContainer.innerHTML = "";

        users.slice(0, 5).forEach((u, i) => {
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
                    <span style="color:var(--accent); font-weight:bold;">Niv. ${u.level}</span>
                </li>
            `;
        });

        // 2. DONNÉES TWITCH (Followers en temps réel)
        const headers = { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID_VERCEL };
        
        // On récupère l'ID du streamer
        const userResp = await fetch(`https://api.twitch.tv/helix/users?login=${BROADCASTER_NAME}`, { headers });
        const userData = await userResp.json();
        
        if (userData.data && userData.data.length > 0) {
            const broadcasterId = userData.data[0].id;
            
            // On récupère le nombre de followers
            const followResp = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${broadcasterId}`, { headers });
            const followData = await followResp.json();
            
            const currentFollows = followData.total;
            const GOAL = 1500;
            const percent = Math.min(100, Math.floor((currentFollows / GOAL) * 100));

            document.getElementById("current-follows").textContent = currentFollows;
            document.getElementById("goal-fill").style.width = percent + "%";
            document.getElementById("goal-text").textContent = percent + "%";
        }

        loadingEl.style.display = "none";
        contentEl.style.display = "grid";

    } catch (error) {
        console.error(error);
        // Si erreur token, on déconnecte proprement
        if (error.message && error.message.includes("401")) {
             localStorage.removeItem("twitch_token");
             window.location.href = "/";
        }
        loadingEl.innerHTML = `<span style="color:var(--red);">Erreur de chargement.</span>`;
    }
});