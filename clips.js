const CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";
const BROADCASTER_ID = "439356462"; 
let allClipsData = []; // Stockage local pour la recherche

const loadingEl = document.getElementById("loading");
const gridEl = document.getElementById("clips-grid");
const searchInput = document.getElementById("clip-search");
const sortSelect = document.getElementById("filter-sort");

document.addEventListener("DOMContentLoaded", async () => {
    const token = checkAuth();
    if(!token) return;

    try {
        // On récupère 50 clips (plus de choix pour la recherche)
        const response = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${BROADCASTER_ID}&first=50`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID }
        });

        if (!response.ok) throw new Error("Erreur API Twitch");
        const data = await response.json();
        
        // STOCKAGE ET TRI PAR DÉFAUT (DATE)
        allClipsData = data.data;
        sortClips('date'); // Fonction de tri définie plus bas
        
        renderClips(allClipsData); // Affichage initial

        // ÉCOUTEURS
        searchInput.addEventListener('input', (e) => filterClips(e.target.value));
        sortSelect.addEventListener('change', (e) => sortClips(e.target.value));

        loadingEl.style.display = "none";
        gridEl.style.display = "grid";

    } catch (error) {
        console.error(error);
        loadingEl.textContent = "Erreur de chargement des clips.";
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
    renderClips(allClipsData); // On ré-affiche après tri
}

function filterClips(query) {
    const lowerQ = query.toLowerCase();
    const filtered = allClipsData.filter(clip => clip.title.toLowerCase().includes(lowerQ));
    renderClips(filtered);
}

function renderClips(clips) {
    gridEl.innerHTML = "";
    if (clips.length === 0) {
        gridEl.innerHTML = "<p>Aucun clip trouvé.</p>";
        return;
    }
    clips.forEach(clip => {
        const date = new Date(clip.created_at).toLocaleDateString('fr-FR');
        gridEl.innerHTML += `
            <a href="${clip.url}" target="_blank" class="card" style="text-decoration:none; color:white; padding:0; overflow:hidden; transition:0.3s;">
                <div style="height:180px; background:url('${clip.thumbnail_url}') center/cover;"></div>
                <div style="padding:1rem;">
                    <h3 style="font-size:1rem; margin-bottom:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${clip.title}</h3>
                    <small style="color:var(--text-dim); display:flex; justify-content:space-between;">
                        <span>👁️ ${clip.view_count}</span>
                        <span>📅 ${date}</span>
                    </small>
                </div>
            </a>
        `;
    });
}