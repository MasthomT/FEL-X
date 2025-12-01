const CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";
const BROADCASTER_ID = "439356462"; // ID de Masthom

document.addEventListener("DOMContentLoaded", async () => {
    const token = checkAuth(); // Vient de app.js
    if(!token) return;

    const loadingEl = document.getElementById("loading");
    const gridEl = document.getElementById("clips-grid");

    try {
        const response = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${BROADCASTER_ID}&first=20`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': CLIENT_ID
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Erreur Twitch (${response.status}): ${errText}`);
        }

        const data = await response.json();
        const clips = data.data;

        // Nettoyage UI
        loadingEl.style.display = "none";
        gridEl.innerHTML = "";

        if (!clips || clips.length === 0) {
            gridEl.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Aucun clip trouvé.</p>';
            return;
        }

        clips.forEach(clip => {
            const card = document.createElement("a");
            card.className = "clip-card";
            card.href = clip.url;
            card.target = "_blank";
            
            // Formatage de la vue
            const views = clip.view_count.toLocaleString();
            
            card.innerHTML = `
                <div class="clip-thumbnail" style="background-image: url('${clip.thumbnail_url}')"></div>
                <div class="clip-info">
                    <span class="title">${clip.title}</span>
                    <small style="color:var(--text-dim)">${views} vues • ${new Date(clip.created_at).toLocaleDateString()}</small>
                </div>
            `;
            gridEl.appendChild(card);
        });

    } catch (error) {
        console.error("Erreur Clips:", error);
        loadingEl.innerHTML = `<span style="color:#ff6b6b">Erreur de chargement.<br><small>${error.message}</small></span>`;
    }
});