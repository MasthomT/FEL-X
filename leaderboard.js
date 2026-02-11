document.addEventListener("DOMContentLoaded", async () => {
    checkAuth(); 

    const loadingEl = document.getElementById("loading");
    const containerEl = document.getElementById("leaderboard-container");
    const listEl = document.getElementById("leaderboard-list");
    const podiumEl = document.getElementById("podium-container");
    
    const token = localStorage.getItem("twitch_token");
    const CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";

    try {
        loadingEl.textContent = "Récupération des données SQL...";

    const auth = btoa("masthom_admin:h7&K#p2Q9!mR5*vXzB@4sL8uN");

    const response = await fetch(`${SERVER_URL}/api/leaderboard`, {
    method: 'GET',
    headers: {
        "ngrok-skip-browser-warning": "true",
        "Accept": "application/json",
        "Authorization": `Basic ${auth}` // <--- ENVOIE LE MOT DE PASSE ICI
    }
});

        if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);

        const rawData = await response.json(); 
        
        if (!rawData || rawData.length === 0) {
            loadingEl.textContent = "Aucune donnée SQL trouvée.";
            return;
        }

        const usersArray = rawData.map(u => ({
            username: u.username,
            key: u.username.toLowerCase(),
            xp: parseInt(u.xp) || 0,
            watchtime_seconds: parseInt(u.watchtime_seconds) || 0,
            level: calculateLevel(parseInt(u.xp) || 0)
        })).sort((a, b) => b.xp - a.xp);

        const top3 = usersArray.slice(0, 3);
        const rest = usersArray.slice(3, 50);

        let twitchUsers = [];
        if (token && top3.length > 0) {
            try {
                const logins = top3.map(u => `login=${u.key}`).join('&');
                const resp = await fetch(`https://api.twitch.tv/helix/users?${logins}`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID }
                });
                const data = await resp.json();
                twitchUsers = data.data || [];
            } catch (e) { console.error("Erreur Twitch:", e); }
        }

        let top3HTML = "";
        top3.forEach((user, index) => {
            const rank = index + 1;
            const tUser = twitchUsers.find(u => u.login.toLowerCase() === user.key);
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
        podiumEl.innerHTML = top3HTML;

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
        containerEl.style.display = "block";

    } catch (error) {
        console.error(error);
        loadingEl.innerHTML = `<div style="color:var(--danger);">Erreur: ${error.message}</div>`;
    }
});

function calculateLevel(xp) {
    if (!xp || xp < 0) return 1;
    return Math.floor(Math.pow(xp / 100, 1 / 2.2)) + 1;
}