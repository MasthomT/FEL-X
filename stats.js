document.addEventListener("DOMContentLoaded", async () => {
    checkAuth();

    const loadingEl = document.getElementById("loading");
    const contentEl = document.getElementById("stats-content");
    const db = firebase.database();

    try {
        // 1. Récupérer XP (Pour le Top 5 et les totaux communautaires)
        const xpSnapshot = await db.ref('viewer_data/xp').once('value');
        const xpData = xpSnapshot.val() || {};

        // 2. Récupérer Historiques (Pour les gagnants)
        // Note : On lit le tableau entier pour prendre le dernier
        const clipsSnap = await db.ref('stream_data/clips_history').once('value');
        const giveSnap = await db.ref('stream_data/giveaways_history').once('value');

        if (Object.keys(xpData).length === 0) {
            loadingEl.textContent = "Aucune donnée disponible.";
            return;
        }

        // --- CALCULS COMMUNAUTÉ ---
        let totalMembers = 0;
        let sumXP = 0;
        let sumLevels = 0;
        let maxLvl = 0;
        let users = [];

        Object.entries(xpData).forEach(([key, val]) => {
            if (val && typeof val.xp === 'number') {
                totalMembers++;
                sumXP += val.xp;
                const lvl = calculateLevel(val.xp);
                sumLevels += lvl;
                if (lvl > maxLvl) maxLvl = lvl;
                
                users.push({ name: val.username || key, xp: val.xp, level: lvl });
            }
        });

        const avgLvl = totalMembers > 0 ? (sumLevels / totalMembers).toFixed(1) : 0;

        // --- AFFICHAGE GAUCHE ---
        document.getElementById("total-members").textContent = totalMembers.toLocaleString();
        document.getElementById("total-xp").textContent = sumXP.toLocaleString();
        document.getElementById("max-level").textContent = maxLvl;
        document.getElementById("avg-level").textContent = avgLvl;

        // --- AFFICHAGE DROITE (GAGNANTS) ---
        const clips = clipsSnap.val() || [];
        const giveaways = giveSnap.val() || [];

        // On prend le premier élément (car main.py insert(0, ...))
        const lastClip = clips.length > 0 ? clips[0] : null;
        const lastGiveaway = giveaways.length > 0 ? giveaways[0] : null;

        document.getElementById("winner-clip").textContent = lastClip ? lastClip.winner : "Aucun";
        document.getElementById("winner-giveaway").textContent = lastGiveaway ? lastGiveaway.winner : "Aucun";

        // --- AFFICHAGE TOP 5 ---
        users.sort((a, b) => b.xp - a.xp);
        const topContainer = document.getElementById("top-5-container");
        topContainer.innerHTML = "";

        users.slice(0, 5).forEach((u, i) => {
            let colorClass = "";
            if(i===0) colorClass = "rank-1";
            if(i===1) colorClass = "rank-2";
            if(i===2) colorClass = "rank-3";

            const row = document.createElement("div");
            row.className = "list-row";
            row.innerHTML = `
                <div>
                    <span class="${colorClass}" style="margin-right:10px;">#${i+1}</span>
                    <span>${u.name}</span>
                </div>
                <span style="color:var(--accent); font-size:0.9rem;">Niv. ${u.level}</span>
            `;
            topContainer.appendChild(row);
        });

        loadingEl.style.display = "none";
        contentEl.style.display = "grid";

    } catch (error) {
        console.error(error);
        loadingEl.innerHTML = `<span style="color:var(--red);">Erreur de chargement (Vérifiez la console).</span>`;
    }
});