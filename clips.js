const CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";
const BROADCASTER_ID = "439356462"; // ID de Masthom

document.addEventListener("DOMContentLoaded", async () => {
    const token = checkAuth();
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

        if (!response.ok) throw new Error("Erreur API Twitch");

        const data = await response.json();
        const clips = data.data;

        if (clips.length === 0) {
            loadingEl.textContent = "Aucun clip trouvé.";
            return;
        }

        loadingEl.style.display = "none";
        gridEl.innerHTML = "";

        clips.forEach(clip => {
            const card = document.createElement("a");
            card.className = "clip-card";
            card.href = clip.url;
            card.target = "_blank";
            
            card.innerHTML = `
                <div class="clip-thumbnail" style="background-image: url('${clip.thumbnail_url}')"></div>
                <div class="clip-info">
                    <span class="clip-title">${clip.title}</span>
                    <span style="color: #b9bbbe; font-size: 0.8rem;">${clip.view_count} vues • par ${clip.creator_name}</span>
                </div>
            `;
            gridEl.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        loadingEl.textContent = "Erreur de chargement. Token expiré ?";
    }
});