document.addEventListener("DOMContentLoaded", async () => {
    checkAuth(); // Vérifie si connecté

    const loadingEl = document.getElementById("loading");
    const containerEl = document.getElementById("leaderboard-container");
    const listEl = document.getElementById("leaderboard-list");
    
    // Référence à la base de données XP
    const dbRef = firebase.database().ref('viewer_data/xp');

    try {
        const snapshot = await dbRef.once('value');
        const xpData = snapshot.val();

        if (!xpData) {
            loadingEl.textContent = "Aucune donnée disponible pour le moment.";
            return;
        }

        // Conversion Objet -> Tableau pour pouvoir trier
        let users = [];
        Object.entries(xpData).forEach(([key, val]) => {
            if (val && typeof val.xp === 'number') {
                users.push({
                    username: val.username || key, // Nom ou clé par défaut
                    xp: val.xp,
                    level: calculateLevel(val.xp) // Fonction globale dans app.js
                });
            }
        });

        // Tri par XP décroissant
        users.sort((a, b) => b.xp - a.xp);

        // Génération du HTML (Top 50)
        listEl.innerHTML = "";
        users.slice(0, 50).forEach((user, index) => {
            const rank = index + 1;
            let rankStyle = "";
            
            // Couleurs pour le podium
            if (rank === 1) rankStyle = "color:#FFD700; font-weight:bold; font-size:1.2em;"; // Or
            if (rank === 2) rankStyle = "color:#C0C0C0; font-weight:bold; font-size:1.1em;"; // Argent
            if (rank === 3) rankStyle = "color:#CD7F32; font-weight:bold; font-size:1.1em;"; // Bronze

            const row = `
                <tr>
                    <td style="${rankStyle}">#${rank}</td>
                    <td style="font-weight:500;">${user.username}</td>
                    <td><span style="background:var(--accent); color:#18181b; padding:2px 8px; border-radius:10px; font-size:0.8em; font-weight:bold;">Niv. ${user.level}</span></td>
                    <td>${user.xp.toLocaleString()} XP</td>
                </tr>
            `;
            listEl.insertAdjacentHTML('beforeend', row);
        });

        // Affichage
        loadingEl.style.display = "none";
        containerEl.style.display = "block";

    } catch (e) {
        console.error("Erreur Leaderboard:", e);
        loadingEl.textContent = "Erreur lors du chargement des données.";
    }
});