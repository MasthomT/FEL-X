/**
 * CLIPS.JS - Récupération intégrale, pagination et tri chronologique
 */

document.addEventListener("DOMContentLoaded", async () => {
    // Vérification de l'authentification via app.js
    const token = typeof checkAuth === 'function' ? checkAuth() : localStorage.getItem("twitch_token");
    if (!token) return;

    const gridEl = document.getElementById("clips-root");
    const searchInput = document.getElementById("clipSearch");
    const counterEl = document.getElementById("loading-counter");
    
    // Identifiants récupérés depuis config.js
    const CLIENT_ID = typeof CONFIG !== 'undefined' ? CONFIG.CLIENT_ID : "";
    const BROADCASTER_ID = "439356462"; // ID Twitch de Masthom_
    
    let allClips = [];

    /**
     * Récupère la totalité des clips en gérant les pages (cursors) de l'API Twitch
     */
    async function fetchAllClips() {
        let cursor = "";
        let hasMore = true;
        const headers = { 
            'Authorization': `Bearer ${token}`, 
            'Client-Id': CLIENT_ID 
        };

        try {
            while (hasMore) {
                // On demande 100 clips par page (le maximum autorisé)
                const url = `https://api.twitch.tv/helix/clips?broadcaster_id=${BROADCASTER_ID}&first=100${cursor ? `&after=${cursor}` : ""}`;
                
                const resp = await fetch(url, { headers });
                
                if (!resp.ok) {
                    const errData = await resp.json();
                    throw new Error(errData.message || "Erreur API Twitch");
                }
                
                const data = await resp.json();
                const clipsBatch = data.data || [];
                
                // On ajoute les nouveaux clips à la liste totale
                allClips = allClips.concat(clipsBatch);
                
                // Mise à jour visuelle du compteur pour faire patienter le viewer
                if (counterEl) counterEl.textContent = allClips.length;

                // Gestion de la pagination
                cursor = data.pagination?.cursor;
                if (!cursor || clipsBatch.length < 100) {
                    hasMore = false;
                }
                
                // Petite pause de sécurité pour éviter le Rate Limit
                await new Promise(r => setTimeout(r, 50));
            }

            // --- TRI : Du plus récent (en haut) au plus ancien (en bas) ---
            allClips.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            // Une fois tout récupéré et trié, on affiche
            render(allClips);

        } catch (e) {
            console.error("❌ Erreur lors de la récupération des clips:", e);
            if (gridEl) {
                gridEl.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <p style="color: var(--danger); font-weight: 700;">Impossible de charger les clips Twitch.</p>
                        <p style="color: var(--text-dim); font-size: 0.8rem; margin-top: 10px;">Détails : ${e.message}</p>
                    </div>
                `;
            }
        }
    }

    /**
     * Génère le HTML des cartes de clips
     * @param {Array} clips - Liste des objets clips à afficher
     */
    function render(clips) {
        if (!gridEl) return;
        
        if (clips.length === 0) {
            gridEl.innerHTML = `<p style="grid-column: 1 / -1; text-align:center; color:var(--text-dim); padding: 5rem;">Aucun clip ne correspond à cette recherche.</p>`;
            return;
        }

        gridEl.innerHTML = clips.map(c => {
            // Formatage de la date (ex: 21 avril 2026)
            const dateStr = new Date(c.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            // Conversion des vues en format lisible (ex: 1 234)
            const viewsStr = c.view_count.toLocaleString('fr-FR');

            return `
            <a href="${c.url}" target="_blank" class="clip-card">
                <div class="clip-thumb-box">
                    <img src="${c.thumbnail_url}" loading="lazy" alt="${c.title}" onerror="this.src='https://static-cdn.jtvnw.net/ttv-static/404_preview-320x180.jpg'">
                    <span class="clip-duration">${Math.round(c.duration)}s</span>
                    <div class="clip-play-overlay">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" style="color:white;"><path d="M8 5v14l11-7z"></path></svg>
                    </div>
                </div>
                <div class="clip-info">
                    <h3 class="clip-title" title="${c.title}">${c.title}</h3>
                    <div class="clip-meta">
                        <span class="clip-author">✂️ ${c.creator_name}</span>
                        <span>👁️ ${viewsStr} • ${dateStr}</span>
                    </div>
                </div>
            </a>
            `;
        }).join('');
    }

    /**
     * Système de filtrage via la barre de recherche
     */
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            // On cherche dans le titre DU CLIP ou le nom DU CLIPPER
            const filtered = allClips.filter(c => 
                c.title.toLowerCase().includes(query) || 
                c.creator_name.toLowerCase().includes(query)
            );
            
            render(filtered);
        });
    }

    // Lancement de la procédure de récupération
    fetchAllClips();
});