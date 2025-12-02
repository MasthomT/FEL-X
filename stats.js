function calculateLevel(xp) {
    if (xp < 0) return 1;
    return Math.floor(Math.pow(Math.max(0, xp) / 100, 1 / 2.2)) + 1;
}

document.addEventListener("DOMContentLoaded", async () => {
    checkAuth();

    const loadingEl = document.getElementById("loading");
    const contentEl = document.getElementById("stats-content");
    const db = firebase.database();

    try {
        // Récupération des données XP
        const xpSnapshot = await db.ref('viewer_data/xp').once('value');
        const xpData = xpSnapshot.val() || {};

        // Récupération des données des Événements (Pour les totaux)
        const eventsSnapshot = await db.ref('stream_data/total_events').once('value');
        const eventTotals = eventsSnapshot.val() || {};

        // Récupération des Historiques (pour les derniers gagnants)
        const clipsHistorySnapshot = await db.ref('viewer_data/history/clips').once('value');
        const clipsHistory = clipsHistorySnapshot.val() || {};

        const giveawaysHistorySnapshot = await db.ref('viewer_data/history/giveaways').once('value');
        const giveawaysHistory = giveawaysHistorySnapshot.val() || {};


        if (Object.keys(xpData).length === 0) {
            loadingEl.textContent = "Aucune donnée de la communauté disponible.";
            return;
        }

        let totalViewers = 0;
        let totalXP = 0;
        let totalLevels = 0;
        let maxLevel = 0;
        let usersArray = [];

        // 1. Calculs des stats XP
        Object.entries(xpData).forEach(([key, user]) => {
            totalViewers++;
            const xp = user.xp || 0;
            totalXP += xp;

            const lvl = calculateLevel(xp);
            totalLevels += lvl;
            if (lvl > maxLevel) maxLevel = lvl;
            
            usersArray.push({
                username: user.username || key,
                xp: xp,
                level: lvl
            });
        });

        // 2. Calcul des moyennes et tri
        const avgLevel = totalViewers > 0 ? (totalLevels / totalViewers).toFixed(1) : 1;
        const avgXP = totalViewers > 0 ? (totalXP / totalViewers).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) : 0;
        
        usersArray.sort((a, b) => b.xp - a.xp); // Tri pour le leaderboard

        // --- 3. MISE A JOUR DU HTML ---

        // Stats Principales
        document.getElementById("stat-viewer-count").textContent = totalViewers.toLocaleString();
        document.getElementById("stat-total-xp").textContent = totalXP.toLocaleString();
        document.getElementById("stat-max-level").textContent = maxLevel;
        document.getElementById("stat-total-clips").textContent = (clipsHistory.count || 0).toLocaleString(); // Affichage du nombre total de clips

        // Moyennes
        document.getElementById("stat-avg-level").textContent = avgLevel;
        document.getElementById("stat-avg-xp").textContent = avgXP + " XP";
        
        // Progression Follow (exemple)
        document.getElementById("stat-followers-progress").textContent = "35%"; // Laisse le % pour le moment

        // Totaux Événements
        document.getElementById("stat-total-bits").textContent = (eventTotals.bits || 0).toLocaleString();
        document.getElementById("stat-total-subgifts").textContent = (eventTotals.subgift || 0).toLocaleString();
        document.getElementById("stat-total-follows").textContent = (eventTotals.follow || 0).toLocaleString();
        document.getElementById("stat-total-raids").textContent = (eventTotals.raid || 0).toLocaleString();
        
        // Derniers Gagnants (Récupération de la dernière entrée)
        const lastClipKey = Object.keys(clipsHistory).sort().reverse()[0];
        const lastGiveawayKey = Object.keys(giveawaysHistory).sort().reverse()[0];

        document.getElementById("stat-last-clip").textContent = lastClipKey ? clipsHistory[lastClipKey].winner : "N/A";
        document.getElementById("stat-last-giveaway").textContent = lastGiveawayKey ? giveawaysHistory[lastGiveawayKey].winner : "N/A";

        // Leaderboard Top 5
        const listEl = document.getElementById("leaderboard-list");
        listEl.innerHTML = "";
        usersArray.slice(0, 5).forEach((user, index) => {
            const rank = index + 1;
            let rankClass = "";
            if (rank === 1) rankClass = "top-rank-1";
            if (rank === 2) rankClass = "top-rank-2";
            if (rank === 3) rankClass = "top-rank-3";
            
            listEl.insertAdjacentHTML('beforeend', `
                <li class="top-item">
                    <span class="${rankClass}">#${rank}</span>
                    <span>${user.username}</span>
                    <span style="color:var(--accent);">Niv. ${user.level}</span>
                </li>
            `);
        });

        // Affichage final
        loadingEl.style.display = "none";
        contentEl.style.display = "grid";

    } catch (error) {
        console.error("Erreur critique lors du chargement des statistiques:", error);
        loadingEl.innerHTML = `<span style="color:var(--red);">Une erreur est survenue lors du chargement. Vérifiez les clés Firebase.</span>`;
    }
});