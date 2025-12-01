document.addEventListener("DOMContentLoaded", async () => {
    checkAuth(); // Vérifie si connecté

    const loadingEl = document.getElementById("loading");
    const containerEl = document.getElementById("leaderboard-container");
    const listEl = document.getElementById("leaderboard-list");
    
    // Référence Firebase (db est initialisé dans app.js)
    const dbRef = firebase.database().ref('viewer_data/xp');

    try {
        const snapshot = await dbRef.once('value');
        const xpData = snapshot.val();

        if (!xpData) {
            loadingEl.textContent = "Aucune donnée disponible.";
            return;
        }

        // Transformation des données en tableau pour le tri
        let users = [];
        Object.entries(xpData).forEach(([key, val]) => {
            if (val && typeof val.xp === 'number') {
                users.push({
                    username: val.username || key, // Utilise le pseudo stocké ou la clé
                    xp: val.xp,
                    level: calculateLevel(val.xp) // Fonction globale dans app.js
                });
            }
        });

        // Tri par XP décroissant (du plus grand au plus petit)
        users.sort((a, b) => b.xp - a.xp);

        // Affichage du Top 50
        listEl.innerHTML = "";
        users.slice(0, 50).forEach((user, index) => {
            const rank = index + 1;
            let rankClass = "";
            if (rank === 1) rankClass = "rank-1";
            if (rank === 2) rankClass = "rank-2";
            if (rank === 3) rankClass = "rank-3";

            const row = `
                <tr>
                    <td class="${rankClass}">#${rank}</td>
                    <td style="font-weight:500;">${user.username}</td>
                    <td><span style="background:var(--accent); color:black; padding:2px 8px; border-radius:10px; font-size:0.8em; font-weight:bold;">Niv. ${user.level}</span></td>
                    <td>${user.xp.toLocaleString()} XP</td>
                </tr>
            `;
            listEl.insertAdjacentHTML('beforeend', row);
        });

        loadingEl.style.display = "none";
        containerEl.style.display = "block";

    } catch (e) {
        console.error("Erreur leaderboard:", e);
        loadingEl.textContent = "Erreur lors du chargement.";
    }
});