const CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";
const BROADCASTER_ID = "439356462"; 
let allClipsData = []; // Stockage local

const loadingEl = document.getElementById("loading");
const gridEl = document.getElementById("clips-grid");
const searchInput = document.getElementById("clip-search");
const filterSortSelect = document.getElementById("filter-sort");

document.addEventListener("DOMContentLoaded", async () => {
    const token = checkAuth(); // Vérif connexion (app.js)
    if(!token) return;

    try {
        loadingEl.textContent = "Récupération des clips...";
        
        // --- CHARGEMENT AVEC PAGINATION (BOUCLE) ---
        let cursor = "";
        let keepFetching = true;
        const MAX_CLIPS = 500; // On récupère jusqu'à 500 clips pour avoir de l'historique

        while (keepFetching && allClipsData.length < MAX_CLIPS) {
            // On construit l'URL
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

            // Si on a des clips, on les ajoute
            if (data.data && data.data.length > 0) {
                allClipsData.push(...data.data);
                loadingEl.textContent = `Chargement... (${allClipsData.length} clips récupérés)`;
                
                // Gestion du curseur pour la page suivante
                if (data.pagination && data.pagination.cursor) {
                    cursor = data.pagination.cursor;
                } else {
                    keepFetching = false; // Plus de page suivante
                }
            } else {
                keepFetching = false; // Liste vide
            }
        }

        if (allClipsData.length === 0) {
            loadingEl.textContent = "Aucun clip trouvé sur cette chaîne.";
            return;
        }

        // --- TRI INITIAL (PAR DATE : PLUS RÉCENT EN PREMIER) ---
        sortClips('date'); 

        // --- AFFICHAGE ---
        loadingEl.style.display = "none";
        gridEl.style.display = "grid";

        // --- ÉCOUTEURS ---
        if(searchInput) searchInput.addEventListener('input', (e) => filterClips(e.target.value));
        if(filterSortSelect) filterSortSelect.addEventListener('change', (e) => sortClips(e.target.value));

    } catch (error) {
        console.error("Erreur Clips:", error);
        // Affichage de l'erreur réelle à l'écran pour comprendre
        loadingEl.innerHTML = `
            <div style="color:#ff6b6b; border:1px solid #ff6b6b; padding:20px; border-radius:8px; display:inline-block;">
                <strong>Oups ! Impossible de charger les clips.</strong><br>
                <small>${error.message}</small><br><br>
                <button onclick="location.reload()" style="background:#ff6b6b; color:white; border:none; padding:8px 16px; cursor:pointer; border-radius:4px; font-weight:bold;">Réessayer</button>
            </div>
        `;
        
        if (error.message.includes("401")) {
            localStorage.removeItem("twitch_token");
            setTimeout(() => window.location.href = "/", 2000);
        }
    }
});

function sortClips(criteria) {
    if (criteria === 'date') {
        // Du plus récent au plus vieux
        allClipsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (criteria === 'views') {
        // Du plus vu au moins vu
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
    gridEl.innerHTML = "";
    if (clips.length === 0) {
        gridEl.innerHTML = "<p style='grid-column:1/-1; text-align:center; color:var(--text-dim)'>Aucun clip ne correspond à la recherche.</p>";
        return;
    }
    
    clips.forEach(clip => {
        const date = new Date(clip.created_at).toLocaleDateString('fr-FR');
        const views = clip.view_count.toLocaleString();

        const card = document.createElement("a");
        card.className = "clip-card"; // On utilise la classe CSS
        card.href = clip.url;
        card.target = "_blank";

        card.innerHTML = `
            <div class="clip-thumbnail" style="background-image:url('${clip.thumbnail_url}')">
                <span class="clip-duration">${Math.round(clip.duration)}s</span>
            </div>
            <div class="clip-info">
                <h3 class="clip-title" title="${clip.title}">${clip.title}</h3>
                <div class="clip-meta">
                    <span>👁️ ${views}</span>
                    <span>📅 ${date}</span>
                </div>
                <div class="clip-author">
                    ✂️ ${clip.creator_name}
                </div>
            </div>
        `;
        gridEl.appendChild(card);
    });
}