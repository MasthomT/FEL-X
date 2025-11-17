if(document.getElementById("logout-sidebar")) {
    document.getElementById("logout-sidebar").onclick = function() {
        localStorage.removeItem("twitch_token");
        window.location.replace("/index.html");
    };
}

const CLIENT_ID = "8jpfq5497uee7kdrsx4djhb7nw2xec";
const BROADCASTER_ID = "439356462"; 
let allClipsData = []; 

const loadingEl = document.getElementById("loading");
const gridEl = document.getElementById("clips-grid");
const searchInput = document.getElementById("clip-search");
const filterSortSelect = document.getElementById("filter-sort");


function renderClips(clips) {
    gridEl.innerHTML = "";
    
    if (clips.length === 0) {
        gridEl.innerHTML = "<p style='grid-column: 1 / -1; text-align: center; color: var(--color-text-secondary);'>Aucun clip ne correspond à vos critères de recherche ou de filtre.</p>";
        return;
    }
    
    clips.forEach(clip => {
        const card = document.createElement("a");
        card.className = "clip-card";
        card.href = clip.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        
        const thumbnailUrl = clip.thumbnail_url;
        
        card.innerHTML = `
            <div class="clip-thumbnail" style="background-image: url('${thumbnailUrl}')">
                <div class="clip-thumbnail-overlay">
                    <svg class="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                </div>
            </div>
            <div class="clip-info">
                <span class="title">${clip.title}</span>
                <span class="details">
                    Clippé par <strong>${clip.creator_name}</strong> &bull; ${clip.view_count.toLocaleString('fr-FR')} vues
                </span>
            </div>
        `;
        gridEl.appendChild(card);
    });

    loadingEl.style.display = "none";
    gridEl.style.display = "grid";
}


function applyFiltersAndSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortValue = filterSortSelect.value;
    
    let filteredClips = allClipsData;

    if (searchTerm) {
        filteredClips = allClipsData.filter(clip => 
            clip.title.toLowerCase().includes(searchTerm) || 
            clip.creator_name.toLowerCase().includes(searchTerm)
        );
    }
    
    if (sortValue === 'views_desc') {
        filteredClips.sort((a, b) => b.view_count - a.view_count);
    } else if (sortValue === 'date_desc') {
        filteredClips.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    renderClips(filteredClips);
}


(async function loadAllClips() {
    const token = localStorage.getItem("twitch_token");
    if (!token) {
        window.location.replace("/index.html");
        return;
    }

    const twitchHeaders = new Headers({
        'Authorization': `Bearer ${token}`,
        'Client-Id': CLIENT_ID
    });
    
    let cursor = null;
    const limitPerRequest = 100;

    try {
        do {
            let url = `https://api.twitch.tv/helix/clips?broadcaster_id=${BROADCASTER_ID}&first=${limitPerRequest}`;
            if (cursor) {
                url += `&after=${cursor}`;
            }

            const clipsResponse = await fetch(url, { headers: twitchHeaders });

            if (!clipsResponse.ok) {
                throw new Error("Impossible de récupérer les clips depuis l'API Twitch.");
            }
            
            const clipsData = await clipsResponse.json();

            if (clipsData.data.length === 0) {
                break;
            }
            
            allClipsData.push(...clipsData.data);
            cursor = clipsData.pagination.cursor;
            
        } while (cursor);

        localStorage.setItem("twitch_clip_count", allClipsData.length);
        if (allClipsData.length === 0) {
            loadingEl.textContent = "Aucun clip n'a été trouvé pour cette chaîne.";
            return;
        }
        localStorage.setItem("twitch_clip_count", allClipsData.length);
        allClipsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        renderClips(allClipsData);
        searchInput.addEventListener('input', applyFiltersAndSearch);
        filterSortSelect.addEventListener('change', applyFiltersAndSearch);
        document.getElementById("filter-form").style.display = 'flex';
        
    } catch (error) {
        console.error("Erreur lors du chargement des clips:", error);
        loadingEl.textContent = "Une erreur est survenue lors du chargement des clips.";
        if (error.message.includes("Token")) {
            localStorage.removeItem("twitch_token");
            window.location.replace("/index.html?error=session_expired");
        }
    }
})();