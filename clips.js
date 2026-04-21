document.addEventListener("DOMContentLoaded", async () => {
    // Auth Check
    const token = typeof checkAuth === 'function' ? checkAuth() : localStorage.getItem("twitch_token");
    if (!token) return;

    const gridEl = document.getElementById("clips-root");
    const searchInput = document.getElementById("clipSearch");
    
    const CLIENT_ID = typeof CONFIG !== 'undefined' ? CONFIG.CLIENT_ID : "";
    const BROADCASTER_ID = "439356462"; 
    
    let allClips = [];

    async function fetchClips() {
        try {
            const resp = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${BROADCASTER_ID}&first=100`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID }
            });
            const data = await resp.json();
            allClips = data.data || [];
            render(allClips);
        } catch (e) {
            if (gridEl) gridEl.innerHTML = `<p style="color:var(--danger); grid-column:1/-1; text-align:center;">Erreur lors de la connexion à l'API Twitch.</p>`;
        }
    }

    function render(clips) {
        if (!gridEl) return;
        
        if (clips.length === 0) {
            gridEl.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--text-dim); padding: 5rem;">Aucun clip trouvé.</p>`;
            return;
        }

        gridEl.innerHTML = clips.map(c => `
            <a href="${c.url}" target="_blank" class="clip-card">
                <div class="clip-thumb-box">
                    <img src="${c.thumbnail_url}" loading="lazy" onerror="this.src='https://static-cdn.jtvnw.net/ttv-static/404_preview-320x180.jpg'">
                    <span class="clip-duration">${Math.round(c.duration)}s</span>
                </div>
                <div class="clip-info">
                    <h3 class="clip-title" title="${c.title}">${c.title}</h3>
                    <div class="clip-meta">
                        <span class="clip-author">✂️ ${c.creator_name}</span>
                        <span>👁️ ${c.view_count.toLocaleString('fr-FR')}</span>
                    </div>
                </div>
            </a>
        `).join('');
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const q = e.target.value.toLowerCase();
            const filtered = allClips.filter(c => 
                c.title.toLowerCase().includes(q) || 
                c.creator_name.toLowerCase().includes(q)
            );
            render(filtered);
        });
    }

    fetchClips();
});
