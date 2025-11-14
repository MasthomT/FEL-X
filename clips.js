if(document.getElementById("logout-sidebar")) {
    document.getElementById("logout-sidebar").onclick = function() {
        localStorage.removeItem("twitch_token");
        window.location.replace("/index.html");
    };
}

(async function loadClips() {
    const token = localStorage.getItem("twitch_token");
    if (!token) {
        window.location.replace("/index.html");
        return;
    }

    const CLIENT_ID = "8jpfq5497uee7kdrsx4djhb7nw2xec";
    const BROADCASTER_ID = "439356462"; 
    
    const twitchHeaders = new Headers({
        'Authorization': `Bearer ${token}`,
        'Client-Id': CLIENT_ID
    });
    
    const loadingEl = document.getElementById("loading");
    const gridEl = document.getElementById("clips-grid");

    try {
        const clipsResponse = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${BROADCASTER_ID}&first=20`, { headers: twitchHeaders });

        if (!clipsResponse.ok) {
            throw new Error("Impossible de récupérer les clips depuis l'API Twitch.");
        }
        
        const clipsData = await clipsResponse.json();

        if (clipsData.data.length === 0) {
            loadingEl.textContent = "Aucun clip n'a été trouvé pour cette chaîne.";
            return;
        }

        gridEl.innerHTML = "";
        
        clipsData.data.forEach(clip => {
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

    } catch (error) {
        console.error("Erreur lors du chargement des clips:", error);
        loadingEl.textContent = "Une erreur est survenue lors du chargement des clips.";
        if (error.message.includes("Token")) {
            localStorage.removeItem("twitch_token");
            window.location.replace("/index.html?error=session_expired");
        }
    }
})();