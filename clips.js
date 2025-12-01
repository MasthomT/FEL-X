const CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";
const BROADCASTER_ID = "439356462"; // ID de Masthom_ (Vérifié dans vos logs)

document.addEventListener("DOMContentLoaded", async () => {
    checkAuth(); // Vérifie que l'utilisateur est connecté

    const loadingEl = document.getElementById("loading");
    const gridEl = document.getElementById("clips-grid");

    try {
        const token = localStorage.getItem("twitch_token");
        if (!token) throw new Error("Pas de token. Reconnectez-vous.");

        // On demande les 20 clips les plus populaires de la chaîne
        const response = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${BROADCASTER_ID}&first=20`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': CLIENT_ID
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Erreur API Twitch (${response.status}) : ${errText}`);
        }

        const data = await response.json();
        const clips = data.data;

        // Si aucun clip n'est trouvé
        if (!clips || clips.length === 0) {
            loadingEl.textContent = "Aucun clip trouvé sur cette chaîne.";
            return;
        }

        // On vide et on affiche
        gridEl.innerHTML = "";
        
        clips.forEach(clip => {
            const card = document.createElement("a");
            card.className = "card"; // Utilise le style .card de style.css
            card.style.textDecoration = "none";
            card.style.padding = "0"; // Pour que l'image prenne tout le haut
            card.style.overflow = "hidden";
            card.style.display = "block";
            card.style.cursor = "pointer";
            card.href = clip.url;
            card.target = "_blank";
            
            // Formatage de la date
            const date = new Date(clip.created_at).toLocaleDateString('fr-FR');
            const views = clip.view_count.toLocaleString();

            card.innerHTML = `
                <div style="width:100%; height:180px; background:url('${clip.thumbnail_url}') center/cover;"></div>
                <div style="padding:1rem;">
                    <h3 style="margin:0 0 5px 0; font-size:1rem; color:white; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${clip.title}</h3>
                    <div style="font-size:0.85rem; color:var(--text-dim); display:flex; justify-content:space-between;">
                        <span>👁️ ${views}</span>
                        <span>📅 ${date}</span>
                    </div>
                    <div style="font-size:0.8rem; color:var(--accent); margin-top:5px;">
                        Clipper : ${clip.creator_name}
                    </div>
                </div>
            `;
            gridEl.appendChild(card);
        });

        loadingEl.style.display = "none";
        gridEl.style.display = "grid"; // On utilise le display grid du CSS

    } catch (error) {
        console.error("Erreur Clips:", error);
        loadingEl.innerHTML = `
            <div style="color:#ff6b6b; border:1px solid #ff6b6b; padding:20px; border-radius:8px; display:inline-block;">
                <strong>Oups ! Impossible de charger les clips.</strong><br>
                <small>${error.message}</small><br><br>
                <button onclick="logout()" style="background:#ff6b6b; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:4px;">Se reconnecter</button>
            </div>
        `;
    }
});