document.addEventListener("DOMContentLoaded", async () => {
    checkAuth(); 

    const loadingEl = document.getElementById("loading");
    const containerEl = document.getElementById("leaderboard-container");
    const listEl = document.getElementById("leaderboard-list");
    const podiumEl = document.getElementById("podium-container");
    
    const token = localStorage.getItem("twitch_token");
    const API_URL = CONFIG.API_BASE_URL || "http://127.0.0.1:8000/api";
    const CLIENT_ID = CONFIG.CLIENT_ID;

    try {
        loadingEl.textContent = "Récupération des données depuis le Bot...";

        // Appel direct à FastAPI (sans mot de passe car c'est une route publique)
        const response = await fetch(`${API_URL}/viewers`);
        if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);

        const rawData = await response.json(); 
        if (!rawData || rawData.length === 0) {
            loadingEl.textContent = "Aucune donnée trouvée.";
            return;
        }

        // On exclut les bots et on formate
        const usersArray = rawData.filter(u => {
            const n = u.username.toLowerCase();
            return n !== "masthom_" && n !== "felixthebigblackcat" && n !== "streamelements" && n !== "wizebot";
        });

        const top3 = usersArray.slice(0, 3);
        const rest = usersArray.slice(3, 50);

        // Fetch des avatars Twitch pour le top 3
        let twitchUsers = [];
        if (token && top3.length > 0) {
            try {
                const logins = top3.map(u => `login=${u.username.toLowerCase()}`).join('&');
                const resp = await fetch(`https://api.twitch.tv/helix/users?${logins}`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID }
                });
                const data = await resp.json();
                twitchUsers = data.data || [];
            } catch (e) { console.error("Erreur Twitch:", e); }
        }

        // Rendu Podium
        let top3HTML = "";
        top3.forEach((user, index) => {
            const rank = index + 1;
            const tUser = twitchUsers.find(u => u.login.toLowerCase() === user.username.toLowerCase());
            const avatar = tUser ? tUser.profile_image_url : "logo-felix.png";
            const h = Math.floor(user.watchtime / 3600);
            const m = Math.floor((user.watchtime % 3600) / 60);

            top3HTML += `
                <div class="podium-item place-${rank}">
                    <img src="${avatar}" class="podium-avatar">
                    <div class="podium-rank">${rank}</div>
                    <div class="podium-name">${user.username}</div>
                    <div class="podium-xp">Niv. ${user.level}</div>
                    <small style="color:var(--accent); font-weight:bold;">${user.points.toLocaleString()} XP</small>
                    <div style="font-size:0.7rem; color:var(--text-dim); margin-top:2px;">🕒 ${h}h ${m}m</div>
                </div>`;
        });
        podiumEl.innerHTML = top3HTML;

        // Rendu Liste
        listEl.innerHTML = "";
        rest.forEach((user, index) => {
            const rank = index + 4;
            const h = Math.floor(user.watchtime / 3600);
            const m = Math.floor((user.watchtime % 3600) / 60);
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>#${rank}</td>
                <td style="font-weight:500;">${user.username}</td>
                <td><span style="background:var(--surface); padding:2px 8px; border-radius:4px; font-size:0.9em;">Niv. ${user.level}</span></td>
                <td style="text-align:right;">
                    <div style="color:var(--accent); font-weight:bold;">${user.points.toLocaleString()} XP</div>
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