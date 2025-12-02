// Fonction pour calculer l'XP (doit être la même que dans app.js)
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
        // 1. Récupération des données (XP + Historique)
        const [xpSnap, eventsSnap, clipsSnap, giveSnap] = await Promise.all([
            db.ref('viewer_data/xp').once('value'),
            db.ref('stream_data/global_stats').once('value'),
            db.ref('stream_data/clips_history').limitToLast(1).once('value'),
            db.ref('stream_data/giveaways_history').limitToLast(1).once('value')
        ]);

        const xpData = xpSnap.val() || {};
        const eventTotals = eventsSnap.val() || {};
        const lastClip = clipsSnap.val() ? Object.values(clipsSnap.val())[0] : null;
        const lastGiveaway = giveSnap.val() ? Object.values(giveSnap.val())[0] : null;

        if (Object.keys(xpData).length === 0) {
            loadingEl.textContent = "Aucune donnée disponible.";
            return;
        }

        // 2. Calculs Communauté
        let users = [];
        let totalXP = 0;
        let totalLevels = 0;
        let maxLvl = 0;

        Object.entries(xpData).forEach(([key, val]) => {
            if (val && typeof val.xp === 'number') {
                totalXP += val.xp;
                const lvl = calculateLevel(val.xp);
                totalLevels += lvl;
                if (lvl > maxLvl) maxLvl = lvl;
                
                users.push({ name: val.username || key, xp: val.xp, level: lvl });
            }
        });

        const totalMembers = users.length;
        const avgLvl = totalMembers > 0 ? (totalLevels / totalMembers).toFixed(1) : 0;
        const avgXP = totalMembers > 0 ? Math.floor(totalXP / totalMembers) : 0;
        
        users.sort((a, b) => b.xp - a.xp); // Tri pour le Top 5

        // --- 3. AFFICHAGE ---

        // Chiffres Clés
        document.getElementById("total-members").textContent = totalMembers.toLocaleString();
        document.getElementById("total-xp").textContent = totalXP.toLocaleString();
        document.getElementById("max-level").textContent = maxLvl;
        
        // Moyennes
        document.getElementById("avg-level").textContent = avgLvl;
        document.getElementById("avg-xp").textContent = avgXP.toLocaleString() + " XP";

        // Hall of Fame
        document.getElementById("winner-clip").textContent = lastClip ? lastClip.winner : "N/A";
        document.getElementById("winner-giveaway").textContent = lastGiveaway ? lastGiveaway.winner : "N/A";

        // Totaux Événements
        document.getElementById("total-bits").textContent = (eventTotals.bits || 0).toLocaleString();
        document.getElementById("total-subgifts").textContent = (eventTotals.subgift || 0).toLocaleString();
        document.getElementById("total-follows").textContent = (eventTotals.follow || 0).toLocaleString();
        document.getElementById("total-raids").textContent = (eventTotals.raid || 0).toLocaleString();
        
        // Top 5
        const topListEl = document.getElementById("top-5-list");
        topListEl.innerHTML = "";
        users.slice(0, 5).forEach((u, i) => {
            let rankClass = "";
            if (i === 0) rankClass = "rank-1";
            if (i === 1) rankClass = "rank-2";
            if (i === 2) rankClass = "rank-3";

            topListEl.innerHTML += `
                <li class="list-row">
                    <span class="mini-rank-pos ${rankClass}">#${i + 1}</span>
                    <span class="mini-rank-name">${u.name}</span>
                    <span class="mini-rank-lvl">Niv. ${u.level}</span>
                </li>
            `;
        });

        loadingEl.style.display = "none";
        contentEl.style.display = "grid";

    } catch (error) {
        console.error("Erreur critique lors du chargement des statistiques:", error);
        loadingEl.innerHTML = `<span style="color:var(--red);">Erreur lors du chargement. Veuillez vérifier votre connexion Firebase.</span>`;
    }
});