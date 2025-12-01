// On attend que Firebase soit dispo via app.js
document.addEventListener("DOMContentLoaded", async () => {
    checkAuth(); // Vérif connexion

    const loadingEl = document.getElementById("loading");
    const containerEl = document.getElementById("leaderboard-container");
    const listEl = document.getElementById("leaderboard-list");
    const podiumEl = document.getElementById("podium-container");
    const db = firebase.database();
    
    // Pour récupérer les avatars, on a besoin du token
    const token = localStorage.getItem("twitch_token");
    const CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";

    try {
        const snapshot = await db.ref('viewer_data/xp').once('value');
        const xpData = snapshot.val();

        if (!xpData) {
            loadingEl.textContent = "Aucune donnée d'XP trouvée.";
            return;
        }

        let usersArray = [];
        for (const [key, val] of Object.entries(xpData)) {
            if (val && typeof val.xp === 'number') {
                usersArray.push({
                    username: val.username || key,
                    key: key, // Pseudo Twitch minuscule (clé firebase)
                    xp: val.xp,
                    level: calculateLevel(val.xp)
                });
            }
        }

        // Tri par XP descendant
        usersArray.sort((a, b) => b.xp - a.xp);

        // --- 1. GESTION DU PODIUM (TOP 3) ---
        const top3 = usersArray.slice(0, 3);
        const rest = usersArray.slice(3, 50); // Le reste jusqu'à 50

        // On récupère les avatars du Top 3 via l'API Twitch
        let top3HTML = "";
        if (token) {
            // On prépare les pseudos pour l'API
            const logins = top3.map(u => `login=${u.key}`).join('&');
            const resp = await fetch(`https://api.twitch.tv/helix/users?${logins}`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID }
            });
            const twitchData = await resp.json();
            
            // On associe l'avatar à l'utilisateur
            top3.forEach((user, index) => {
                const rank = index + 1;
                const twitchUser = twitchData.data ? twitchData.data.find(u => u.login.toLowerCase() === user.key) : null;
                const avatar = twitchUser ? twitchUser.profile_image_url : "logo-felix.png"; // Fallback

                top3HTML += `
                    <div class="podium-item place-${rank}">
                        <img src="${avatar}" class="podium-avatar">
                        <div class="podium-rank">${rank}</div>
                        <div class="podium-name">${user.username}</div>
                        <div class="podium-xp">Niv. ${user.level}</div>
                        <small style="color:#777">${user.xp.toLocaleString()} XP</small>
                    </div>
                `;
            });
        }
        
        // Si podiumEl existe (ajouté dans le HTML), on l'injecte
        if(podiumEl) podiumEl.innerHTML = top3HTML;


        // --- 2. GESTION DU RESTE (TABLEAU) ---
        listEl.innerHTML = "";
        rest.forEach((user, index) => {
            const rank = index + 4; // Commence à 4
            const li = document.createElement("tr"); // Attention, c'est un tableau maintenant
            li.innerHTML = `
                <td>#${rank}</td>
                <td style="font-weight:500;">${user.username}</td>
                <td><span style="background:var(--surface); padding:2px 8px; border-radius:4px; font-size:0.9em;">Niv. ${user.level}</span></td>
                <td style="color:var(--accent);">${user.xp.toLocaleString()} XP</td>
            `;
            listEl.appendChild(li);
        });

        loadingEl.style.display = "none";
        containerEl.style.display = "block";

    } catch (error) {
        console.error("Erreur Leaderboard:", error);
        loadingEl.textContent = "Erreur de chargement.";
    }
});