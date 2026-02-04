document.addEventListener("DOMContentLoaded", async () => {
    checkAuth(); 
    const listEl = document.getElementById("leaderboard-list");
    const podiumEl = document.getElementById("podium-container");
    const containerEl = document.getElementById("leaderboard-container");
    const loadingEl = document.getElementById("loading");

    try {
        const response = await fetch(`${CONFIG.SERVER_URL}/api/leaderboard`, {
            headers: { "ngrok-skip-browser-warning": "true" }
        });
        
        const rawData = await response.json();
        if (!rawData || rawData.length === 0) throw new Error("Aucune donnée");

        // On trie et on prépare les données
        const top3 = rawData.slice(0, 3);
        const rest = rawData.slice(3);

        // --- GÉNÉRATION DU PODIUM ---
        // Ordre visuel : 2, 1, 3
        const podiumOrder = [top3[1], top3[0], top3[2]]; 
        podiumEl.innerHTML = podiumOrder.map((user, i) => {
            if (!user) return `<div class="podium-slot empty"></div>`;
            const rank = (i === 0) ? 2 : (i === 1 ? 1 : 3);
            return `
                <div class="podium-item rank-${rank}">
                    <div class="avatar-wrapper">
                        <img src="https://ui-avatars.com/api/?name=${user.username}&background=random" class="podium-avatar">
                        <div class="rank-badge">${rank}</div>
                    </div>
                    <div class="podium-name">${user.username}</div>
                    <div class="podium-xp">${user.xp.toLocaleString()} XP</div>
                </div>
            `;
        }).join('');

        // --- GÉNÉRATION DU TABLEAU ---
        listEl.innerHTML = rest.map((user, index) => {
            const level = calculateLevel(user.xp);
            return `
                <tr>
                    <td class="rank-cell">#${index + 4}</td>
                    <td class="user-cell">${user.username}</td>
                    <td><span class="lvl-tag">LVL ${level}</span></td>
                    <td class="text-right xp-cell">${user.xp.toLocaleString()} <span>XP</span></td>
                </tr>
            `;
        }).join('');

        loadingEl.style.display = "none";
        containerEl.style.display = "block";

    } catch (err) {
        loadingEl.innerHTML = `<p class="error">Impossible de joindre le Raspberry Pi.</p>`;
    }
});