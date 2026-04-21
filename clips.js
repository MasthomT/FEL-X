<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Galerie Clips - FEL-X</title>
    <!-- On utilise le style.css Master -->
    <link rel="stylesheet" href="style.css">
    <style>
        /* Styles spécifiques pour la grille de vidéos */
        .clips-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 2rem;
            margin-top: 1rem;
        }

        .clip-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 24px;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .clip-card:hover {
            transform: translateY(-8px);
            border-color: var(--accent);
            box-shadow: 0 20px 40px -15px rgba(0,0,0,0.6);
        }

        .clip-thumbnail-wrapper {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 9;
            overflow: hidden;
            background: #000;
        }

        .clip-thumbnail {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .clip-card:hover .clip-thumbnail {
            transform: scale(1.05);
        }

        .clip-duration {
            position: absolute;
            bottom: 12px;
            right: 12px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            color: #fff;
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 800;
            z-index: 2;
        }

        .clip-play-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(139, 92, 246, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1;
        }

        .clip-card:hover .clip-play-overlay {
            opacity: 1;
        }

        .clip-info {
            padding: 1.5rem;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        .clip-title {
            color: #fff;
            font-weight: 700;
            font-size: 1rem;
            line-height: 1.4;
            margin-bottom: 12px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .clip-meta {
            margin-top: auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .clip-creator {
            font-size: 0.75rem;
            font-weight: 700;
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .clip-stats {
            font-size: 0.8rem;
            color: var(--text-dim);
            font-weight: 500;
        }

        /* Barre de recherche style Premium */
        .filter-bar {
            display: flex;
            gap: 1rem;
            margin-bottom: 3rem;
            flex-wrap: wrap;
        }

        .search-box {
            flex-grow: 1;
            position: relative;
            min-width: 280px;
        }

        .search-box input {
            width: 100%;
            padding: 14px 20px 14px 50px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 18px;
            color: #fff;
            outline: none;
            transition: all 0.3s ease;
        }

        .search-box input:focus {
            border-color: var(--accent);
            box-shadow: 0 0 20px var(--accent-glow);
        }

        .search-box svg {
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-dim);
        }
    </style>
</head>
<body>
    <!-- La sidebar est injectée ici par sidebar.js -->

    <main>
        <header>
            <h1>Galerie Clips</h1>
            <p class="page-desc">Redécouvrez les moments les plus légendaires capturés par la communauté.</p>
        </header>

        <!-- Filtres -->
        <div class="filter-bar">
            <div class="search-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" id="clipSearch" placeholder="Rechercher un moment ou un clipper..." onkeyup="filterClips()">
            </div>
        </div>

        <!-- Grille de Clips -->
        <div id="clips-root" class="clips-grid">
            <!-- Loader initial -->
            <div style="grid-column: 1 / -1; text-align: center; padding: 5rem;">
                <div style="width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px auto;"></div>
                <p style="color: var(--text-dim); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem;">Récupération des clips Twitch...</p>
            </div>
        </div>
    </main>

    <script src="config.js"></script>
    <script src="app.js"></script>
    <script src="sidebar.js"></script>
    <script>
        let allClips = [];

        document.addEventListener("DOMContentLoaded", async () => {
            const token = checkAuth();
            if(!token) return;

            const CLIENT_ID = typeof CONFIG !== 'undefined' ? CONFIG.CLIENT_ID : "";
            // ID de ta chaîne Twitch (Masthom_)
            const BROADCASTER_ID = "439356462"; 

            try {
                // Récupération des 100 derniers clips
                const resp = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${BROADCASTER_ID}&first=100`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID }
                });
                
                if (!resp.ok) throw new Error("API Twitch inaccessible");
                
                const data = await resp.json();
                allClips = data.data || [];

                renderClips(allClips);

            } catch (error) {
                console.error("Clips Error:", error);
                document.getElementById("clips-root").innerHTML = `
                    <div style="grid-column: 1/-1; padding: 3rem; text-align:center;" class="card">
                        <p style="color:var(--danger); font-weight:700;">Impossible de charger les clips Twitch.</p>
                        <p style="color:var(--text-dim); font-size:0.9rem; margin-top:10px;">Vérifiez votre connexion ou reconnectez-vous.</p>
                    </div>
                `;
            }
        });

        function renderClips(clips) {
            const container = document.getElementById("clips-root");
            container.innerHTML = "";

            if (clips.length === 0) {
                container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--text-dim); padding: 5rem;">Aucun clip trouvé.</p>`;
                return;
            }

            clips.forEach(clip => {
                const date = new Date(clip.created_at).toLocaleDateString('fr-FR');
                const views = clip.view_count.toLocaleString('fr-FR');

                const card = document.createElement("a");
                card.href = clip.url;
                card.target = "_blank";
                card.className = "clip-card";
                card.innerHTML = `
                    <div class="clip-thumbnail-wrapper">
                        <img src="${clip.thumbnail_url}" class="clip-thumbnail" loading="lazy">
                        <div class="clip-play-overlay">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="color:#fff;"><path d="M8 5v14l11-7z"></path></svg>
                        </div>
                        <span class="clip-duration">${Math.round(clip.duration)}s</span>
                    </div>
                    <div class="clip-info">
                        <h3 class="clip-title" title="${clip.title}">${clip.title}</h3>
                        <div class="clip-meta">
                            <span class="clip-creator">✂️ ${clip.creator_name}</span>
                            <span class="clip-stats">👁️ ${views} • ${date}</span>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function filterClips() {
            const query = document.getElementById("clipSearch").value.toLowerCase();
            const filtered = allClips.filter(c => 
                c.title.toLowerCase().includes(query) || 
                c.creator_name.toLowerCase().includes(query)
            );
            renderClips(filtered);
        }
    </script>
</body>
</html>