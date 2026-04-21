document.addEventListener("DOMContentLoaded", async () => {
    // 1. Vérification stricte
    const token = checkAuth();
    if(!token) return;

    const CLIENT_ID = typeof CONFIG !== 'undefined' ? CONFIG.CLIENT_ID : "kgyfzs0k3wk8enx7p3pd6299ro4izv";
    const BROADCASTER_ID = "439356462"; // ID Twitch de masthom_
    
    let allClipsData = [];

    const loadingEl = document.getElementById("loading");
    const gridEl = document.getElementById("clips-grid");
    const searchInput = document.getElementById("clip-search");
    const filterSortSelect = document.getElementById("filter-sort");

    try {
        if(loadingEl) loadingEl.textContent = "Récupération des clips via Twitch...";
        
        let cursor = "";
        let keepFetching = true;
        const MAX_CLIPS = 500;

        // Requêtes vers l'API Officielle Twitch
        while (keepFetching && allClipsData.length < MAX_CLIPS) {
            let url = `https://api.twitch.tv/helix/clips?broadcaster_id=${BROADCASTER_ID}&first=100`;
            if (cursor) url += `&after=${cursor}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID }
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Twitch API Error (${response.status}): ${errText}`);
            }
            
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                allClipsData.push(...data.data);
                if(loadingEl) loadingEl.textContent = `Chargement... (${allClipsData.length} clips récupérés)`;
                
                if (data.pagination && data.pagination.cursor) {
                    cursor = data.pagination.cursor;
                } else {
                    keepFetching = false;
                }
            } else {
                keepFetching = false;
            }
        }

        if (allClipsData.length === 0) {
            if(loadingEl) loadingEl.textContent = "Aucun clip trouvé sur cette chaîne.";
            return;
        }

        // Tri par défaut (Les plus récents)
        sortClips('date'); 

        if(loadingEl) loadingEl.style.display = "none";
        if(gridEl) gridEl.style.display = "grid";

        // Événements de tri et recherche
        if(searchInput) searchInput.addEventListener('input', (e) => filterClips(e.target.value));
        if(filterSortSelect) filterSortSelect.addEventListener('change', (e) => sortClips(e.target.value));

    } catch (error) {
        console.error("Erreur Clips:", error);
        if(loadingEl) {
            loadingEl.innerHTML = `
                <div style="color:#f43f5e; border:1px solid #f43f5e; padding:20px; border-radius:12px; display:inline-block; background:rgba(244,63,94,0.1);">
                    <strong>Oups ! Impossible de charger les clips depuis Twitch.</strong><br>
                    <small style="color:var(--text-dim);">${error.message}</small><br><br>
                    <button onclick="location.reload()" style="background:#f43f5e; color:white; border:none; padding:10px 20px; cursor:pointer; border-radius:8px; font-weight:800;">Réessayer</button>
                </div>
            `;
        }
        
        // Si le token est expiré (401), on déconnecte de force
        if (error.message.includes("401")) {
            localStorage.removeItem("twitch_token");
            setTimeout(() => window.location.href = "/", 2000);
        }
    }

    // --- FONCTIONS INTERNES ---
    function sortClips(criteria) {
        if (criteria === 'date') {
            allClipsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (criteria === 'views') {
            allClipsData.sort((a, b) => b.view_count - a.view_count);
        }
        renderClips(allClipsData);
    }

    function filterClips(query) {
        const lowerQ = query.toLowerCase();
        const filtered = allClipsData.filter(clip => 
            clip.title.toLowerCase().includes(lowerQ) || 
            clip.creator_name.toLowerCase().includes(lowerQ)
        );
        renderClips(filtered);
    }

    function renderClips(clips) {
        if (!gridEl) return;
        gridEl.innerHTML = "";
        
        if (clips.length === 0) {
            gridEl.innerHTML = "<div style='grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-dim);'>Aucun clip ne correspond à ta recherche. 😢</div>";
            return;
        }
        
        clips.forEach(clip => {
            const date = new Date(clip.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
            const views = clip.view_count.toLocaleString('fr-FR');

            const card = document.createElement("a");
            card.className = "clip-card";
            card.href = clip.url;
            card.target = "_blank";
            card.style.cssText = "display:flex; flex-direction:column; background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; text-decoration:none; color:white; transition:0.2s;";

            card.innerHTML = `
                <div style="height:180px; background-image:url('${clip.thumbnail_url}'); background-size:cover; background-position:center; position:relative;">
                    <span style="position:absolute; bottom:10px; right:10px; background:rgba(0,0,0,0.8); padding:4px 8px; border-radius:6px; font-size:0.8rem; font-weight:bold;">${Math.round(clip.duration)}s</span>
                </div>
                <div style="padding:15px;">
                    <h3 style="margin:0 0 10px 0; font-size:1rem; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${clip.title}">${clip.title}</h3>
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--text-dim); margin-bottom:10px; font-weight:600;">
                        <span><i class="fas fa-eye"></i> ${views} vues</span>
                        <span><i class="fas fa-calendar"></i> ${date}</span>
                    </div>
                    <div style="font-size:0.85rem; color:var(--accent); font-weight:800;">
                        ✂️ Clippé par ${clip.creator_name}
                    </div>
                </div>
            `;
            gridEl.appendChild(card);
        });
    }
});