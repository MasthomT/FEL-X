document.addEventListener("DOMContentLoaded", async () => {
    checkAuth(); 

    const loadingEl = document.getElementById("loading");
    const containerEl = document.getElementById("leaderboard-container");
    const listEl = document.getElementById("leaderboard-list");
    const podiumEl = document.getElementById("podium-container");
    const db = firebase.database();
    
    const token = localStorage.getItem("twitch_token");
    const CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";

    try {
        // --- CORRECTION DU CHEMIN ICI : xp_data au lieu de xp ---
        const snapshot = await db.ref('viewer_data/xp_data').once('value');
        const xpData = snapshot.val();

        if (!xpData) {
            loadingEl.textContent = "Aucune donnée d'XP trouvée dans xp_data.";
            return;
        }

        let usersArray = [];
        for (const [key, val] of Object.entries(xpData)) {
    let xpValue = 0;
    let usernameValue = key;
    let wt_seconds = 0;
    
    // On s'assure de lire l'objet tel qu'il est stocké par le bot
    if (val && typeof val === 'object') {
        // Priorité aux données chiffrées réelles
        xpValue = parseInt(val.xp) || 0; 
        usernameValue = val.username || key;
        wt_seconds = parseInt(val.watchtime_seconds) || 0;
    } else if (typeof val === 'number') {
        xpValue = val;
    }

    if (xpValue > 0) {
        usersArray.push({
            username: usernameValue,
            key: key, 
            xp: xpValue,
            watchtime_seconds: wt_seconds,
            level: calculateLevel(xpValue) // Utilise ta formule synchronisée
        });
    }
}

        usersArray.sort((a, b) => b.xp - a.xp);

        // --- PODIUM (TOP 3) ---
        const top3 = usersArray.slice(0, 3);
        const rest = usersArray.slice(3, 50);

        let top3HTML = "";
        let twitchUsers = [];
        if (token && top3.length > 0) {
            const logins = top3.map(u => `login=${u.key}`).join('&');
            const resp = await fetch(`https://api.twitch.tv/helix/users?${logins}`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID }
            });
            const data = await resp.json();
            twitchUsers = data.data || [];
        }

        top3.forEach((user, index) => {
            const rank = index + 1;
            const tUser = twitchUsers.find(u => u.login.toLowerCase() === user.key.toLowerCase());
            const avatar = tUser ? tUser.profile_image_url : "logo-felix.png";
            const h = Math.floor(user.watchtime_seconds / 3600);
            const m = Math.floor((user.watchtime_seconds % 3600) / 60);

            top3HTML += `
                <div class="podium-item place-${rank}">
                    <img src="${avatar}" class="podium-avatar">
                    <div class="podium-rank">${rank}</div>
                    <div class="podium-name">${user.username}</div>
                    <div class="podium-xp">Niv. ${user.level}</div>
                    <small style="color:var(--accent); font-weight:bold;">${user.xp.toLocaleString()} XP</small>
                    <div style="font-size:0.7rem; color:var(--text-dim); margin-top:2px;">🕒 ${h}h ${m}m</div>
                </div>`;
        });

        if (podiumEl) podiumEl.innerHTML = top3HTML;

        // --- TABLEAU (SUITE) ---
        listEl.innerHTML = "";
        rest.forEach((user, index) => {
            const rank = index + 4;
            const h = Math.floor(user.watchtime_seconds / 3600);
            const m = Math.floor((user.watchtime_seconds % 3600) / 60);
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>#${rank}</td>
                <td style="font-weight:500;">${user.username}</td>
                <td><span style="background:var(--surface); padding:2px 8px; border-radius:4px; font-size:0.9em;">Niv. ${user.level}</span></td>
                <td style="text-align:right;">
                    <div style="color:var(--accent); font-weight:bold;">${user.xp.toLocaleString()} XP</div>
                    <div style="font-size:0.75rem; color:var(--text-dim);">🕒 ${h}h ${m}m</div>
                </td>`;
            listEl.appendChild(tr);
        });

        loadingEl.style.display = "none";
        if (containerEl) containerEl.style.display = "block";

    } catch (error) {
        console.error("Erreur Leaderboard:", error);
        loadingEl.textContent = "Erreur de chargement.";
    }
});

function calculateLevel(xp) {
    if (!xp || xp < 0) return 1;
    // Formule : Racine de (XP/100) avec puissance 2.2
    return Math.floor(Math.pow(xp / 100, 1 / 2.2)) + 1;
}