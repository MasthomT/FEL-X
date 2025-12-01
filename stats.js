document.addEventListener("DOMContentLoaded", async () => {
    checkAuth();

    const loadingEl = document.getElementById("loading");
    const contentEl = document.getElementById("stats-content");
    const dbRef = firebase.database().ref('viewer_data/xp');

    try {
        const snapshot = await dbRef.once('value');
        const data = snapshot.val();

        if (!data) {
            loadingEl.textContent = "Pas de données.";
            return;
        }

        let stats = {
            viewers: 0,
            xp: 0,
            messages: 0,
            maxLvl: 0,
            watchtime: 0
        };

        // On parcourt chaque utilisateur pour additionner
        Object.values(data).forEach(user => {
            stats.viewers++;
            stats.xp += (user.xp || 0);
            stats.messages += (user.MessageCount || 0);
            stats.watchtime += (user.WatchtimeInSeconds || 0);
            
            const lvl = calculateLevel(user.xp || 0);
            if (lvl > stats.maxLvl) stats.maxLvl = lvl;
        });

        // Mise à jour du HTML
        document.getElementById("total-viewers").textContent = stats.viewers.toLocaleString();
        document.getElementById("total-xp").textContent = stats.xp.toLocaleString();
        document.getElementById("total-messages").textContent = stats.messages.toLocaleString();
        document.getElementById("max-level").textContent = stats.maxLvl;
        
        // Conversion secondes -> heures
        const hours = Math.floor(stats.watchtime / 3600);
        document.getElementById("total-watchtime").textContent = `${hours.toLocaleString()}h`;

        loadingEl.style.display = "none";
        contentEl.style.display = "grid";

    } catch (e) {
        console.error("Erreur Stats:", e);
        loadingEl.textContent = "Erreur de chargement.";
    }
});