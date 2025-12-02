document.addEventListener("DOMContentLoaded", async () => {
    checkAuth(); // Vérif connexion (app.js)

    const loadingEl = document.getElementById("loading");
    const contentEl = document.getElementById("stats-content");
    const db = firebase.database();

    try {
        // 1. Récupération des données XP (Pour totaux et moyennes)
        const xpSnapshot = await db.ref('viewer_data/xp').once('value');
        const xpData = xpSnapshot.val();

        // 2. Récupération Historiques (Pour gagnants)
        const histClipSnap = await db.ref('viewer_data/history/clips').limitToLast(1).once('value');
        const histGiveawaySnap = await db.ref('viewer_data/history/giveaways').limitToLast(1).once('value');
        
        if (!xpData) {
            loadingEl.textContent = "Aucune donnée disponible.";
            return;
        }

        // --- CALCULS ---
        let totalMembers = 0;
        let sumXP = 0;
        let sumLevels = 0;
        let maxLvl = 0;
        let usersList = [];

        Object.entries(xpData).forEach(([key, val]) => {
            if (val && typeof val.xp === 'number') {
                totalMembers++;
                sumXP += val.xp;
                const lvl = calculateLevel(val.xp);
                sumLevels += lvl;
                if (lvl > maxLvl) maxLvl = lvl;

                usersList.push({ name: val.username || key, xp: val.xp, level: lvl });
            }
        });

        // Moyennes
        const avgLvl = totalMembers > 0 ? (sumLevels / totalMembers).toFixed(1) : 0;
        const avgXP = totalMembers > 0 ? Math.floor(sumXP / totalMembers) : 0;
        
        // Tri pour le Top 5
        usersList.sort((a, b) => b.xp - a.xp);

        // --- AFFICHAGE ---

        // 1. Chiffres Clés
        document.getElementById("stat-total-members").textContent = totalMembers.toLocaleString();
        document.getElementById("stat-total-xp").textContent = sumXP.toLocaleString();
        
        // 2. Moyennes
        document.getElementById("stat-avg-level").textContent = avgLvl;
        document.getElementById("stat-avg-xp").textContent = avgXP.toLocaleString() + " XP";
        document.getElementById("stat-max-level").textContent = maxLvl;
        
        // (Optionnel) Objectif Follow - À connecter à l'API Twitch si voulu, sinon valeur fixe pour l'exemple
        document.getElementById("stat-goal-progress").textContent = "35%"; 

        // 3. Derniers Vainqueurs
        const clips = histClipSnap.val();
        const giveaways = histGiveawaySnap.val();
        
        const lastClip = clips ? Object.values(clips)[0] : null;
        const lastGiveaway = giveaways ? Object.values(giveaways)[0] : null;

        document.getElementById("winner-clip").textContent = lastClip ? lastClip.winner : "Aucun";
        document.getElementById("winner-giveaway").textContent = lastGiveaway ? lastGiveaway.winner : "Aucun";

        // 4. Top 5 Liste
        const topListEl = document.getElementById("top-5-list");
        topListEl.innerHTML = "";
        usersList.slice(0, 5).forEach((u, i) => {
            let rankClass = "";
            if(i===0) rankClass = "pos-1";
            if(i===1) rankClass = "pos-2";
            if(i===2) rankClass = "pos-3";
            
            topListEl.innerHTML += `
                <li class="mini-rank-item">
                    <span class="mini-rank-pos ${rankClass}">#${i+1}</span>
                    <span class="mini-rank-name">${u.name}</span>
                    <span class="mini-rank-lvl">Niv. ${u.level}</span>
                </li>
            `;
        });

        loadingEl.style.display = "none";
        contentEl.style.display = "grid";

    } catch (e) {
        console.error(e);
        loadingEl.textContent = "Erreur lors du chargement.";
    }
});