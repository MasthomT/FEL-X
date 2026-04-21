<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Commandes - FEL-X</title>
    <!-- On appelle le design maître pour les marges et les couleurs -->
    <link rel="stylesheet" href="style.css">
    <style>
        .search-container {
            position: relative;
            margin-bottom: 2.5rem;
            max-width: 500px;
        }
        .search-input {
            width: 100%;
            padding: 16px 20px 16px 52px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 20px;
            color: #fff;
            font-size: 1rem;
            outline: none;
            transition: all 0.3s ease;
        }
        .search-input:focus {
            border-color: var(--accent);
            box-shadow: 0 0 20px var(--accent-glow);
        }
        .search-icon {
            position: absolute; left: 20px; top: 50%;
            transform: translateY(-50%); color: var(--text-dim);
            pointer-events: none;
        }
        /* Badges d'accès */
        .badge {
            font-size: 0.65rem; font-weight: 900; padding: 4px 10px;
            border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;
            border: 1px solid transparent;
        }
        .badge-viewer { background: rgba(16, 185, 129, 0.1); color: #10b981; border-color: rgba(16, 185, 129, 0.2); }
        .badge-mod { background: rgba(244, 63, 94, 0.1); color: #f43f5e; border-color: rgba(244, 63, 94, 0.2); }
        .badge-vip { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border-color: rgba(139, 92, 246, 0.2); }
        
        .cmd-trigger { font-family: 'JetBrains Mono', monospace; color: var(--accent); font-weight: 800; }
        .hidden { display: none; }
    </style>
</head>
<body>
    <!-- La sidebar est injectée ici par sidebar.js -->

    <main>
        <header>
            <h1>Commandes Chat</h1>
            <p class="page-desc">Toutes les interactions disponibles pour dynamiser le live.</p>
        </header>

        <div class="search-container">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="cmdSearch" class="search-input" placeholder="Rechercher une commande..." onkeyup="filterCommands()">
        </div>

        <div class="card" style="padding: 0; overflow: hidden;">
            <table style="margin-top: 0;">
                <thead>
                    <tr>
                        <th style="padding-left: 2.5rem; width: 220px;">Trigger</th>
                        <th>Description</th>
                        <th style="width: 150px; text-align: center;">Accès</th>
                    </tr>
                </thead>
                <tbody id="cmd-list">
                    <!-- Injecté par JS -->
                </tbody>
            </table>
        </div>
    </main>

    <script src="app.js"></script>
    <script src="sidebar.js"></script>
    <script>
        const commands = [
            { t: "!so {pseudo}", d: "Promotion d'un streamer avec clip.", a: "mod" },
            { t: "!level", d: "Affiche ton niveau et ton EXP.", a: "viewer" },
            { t: "!rang", d: "Ta position dans le classement.", a: "viewer" },
            { t: "!discord", d: "Lien permanent du serveur.", a: "viewer" },
            { t: "!clip", d: "Crée un clip des 30 dernières secondes.", a: "viewer" },
            { t: "!dance", d: "Pluie d'emotes de danse.", a: "viewer" },
            { t: "!uptime", d: "Temps depuis le début du stream.", a: "viewer" },
            { t: "!game", d: "Affiche le jeu actuel.", a: "viewer" }
        ];

        function render() {
            const list = document.getElementById('cmd-list');
            list.innerHTML = commands.map(c => `
                <tr class="cmd-row">
                    <td style="padding-left: 2.5rem;"><span class="cmd-trigger">${c.t}</span></td>
                    <td style="color: var(--text-main); font-weight: 500;">${c.d}</td>
                    <td style="text-align: center;">
                        <span class="badge badge-${c.a}">${c.a === 'mod' ? 'Modérateur' : c.a}</span>
                    </td>
                </tr>
            `).join('');
        }

        function filterCommands() {
            const q = document.getElementById("cmdSearch").value.toLowerCase();
            document.querySelectorAll(".cmd-row").forEach(r => {
                r.classList.toggle("hidden", !r.textContent.toLowerCase().includes(q));
            });
        }

        document.addEventListener("DOMContentLoaded", () => {
            checkAuth();
            render();
        });
    </script>
</body>
</html>