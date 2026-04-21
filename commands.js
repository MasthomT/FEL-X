<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Commandes Chat - FEL-X</title>
    <!-- On utilise le style.css Master pour la structure et le thème -->
    <link rel="stylesheet" href="style.css">
    <style>
        /* Ajustements spécifiques pour la recherche et les badges */
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
            background: rgba(30, 41, 59, 0.6);
        }

        .search-icon {
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-dim);
            pointer-events: none;
        }

        /* Badges d'accès stylisés */
        .access-badge {
            font-size: 0.65rem;
            font-weight: 900;
            padding: 4px 10px;
            border-radius: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-width: 1px;
            border-style: solid;
            white-space: nowrap;
        }

        .access-viewer { background: rgba(16, 185, 129, 0.1); color: #10b981; border-color: rgba(16, 185, 129, 0.2); }
        .access-mod { background: rgba(244, 63, 94, 0.1); color: #f43f5e; border-color: rgba(244, 63, 94, 0.2); }
        .access-vip { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border-color: rgba(139, 92, 246, 0.2); }

        .cmd-trigger {
            font-family: 'JetBrains Mono', monospace;
            color: var(--accent);
            font-weight: 800;
            font-size: 1.05rem;
        }

        .cmd-row { transition: all 0.2s ease; }
        .cmd-row:hover td { background: rgba(255, 255, 255, 0.03); }
        .hidden { display: none; }
    </style>
</head>
<body>
    <!-- La sidebar est injectée ici par sidebar.js -->

    <main>
        <header>
            <h1>Commandes Chat</h1>
            <p class="page-desc">Interagissez avec Félix et le stream via ces commandes textuelles.</p>
        </header>

        <!-- Barre de Recherche Premium -->
        <div class="search-container">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="cmdSearch" class="search-input" placeholder="Rechercher une commande (ex: !so)..." onkeyup="filterCommands()">
        </div>

        <!-- Tableau des Commandes -->
        <div class="card" style="padding: 0; overflow: hidden;">
            <table style="margin-top: 0; width: 100%;">
                <thead>
                    <tr>
                        <th style="padding-left: 2.5rem; width: 250px;">Déclencheur</th>
                        <th>Description</th>
                        <th style="width: 150px; text-align: center;">Accès</th>
                    </tr>
                </thead>
                <tbody id="cmd-table-body">
                    <!-- Les commandes seront générées par le script JS ci-dessous -->
                </tbody>
            </table>
        </div>
    </main>

    <script src="config.js"></script>
    <script src="app.js"></script>
    <script src="sidebar.js"></script>
    <script>
        // Base de données des commandes
        const commandsData = [
            { t: "!so {pseudo}", d: "Affiche un clip et fait la promotion d'un autre streamer.", a: "mod" },
            { t: "!level", d: "Affiche ton niveau actuel et ton expérience restante.", a: "viewer" },
            { t: "!rang", d: "Affiche ta position exacte dans le classement général.", a: "viewer" },
            { t: "!discord", d: "Envoie le lien d'invitation du serveur Discord.", a: "viewer" },
            { t: "!clip", d: "Crée instantanément un clip des 30 dernières secondes.", a: "viewer" },
            { t: "!dance", d: "Déclenche une avalanche d'emotes de danse.", a: "viewer" },
            { t: "!ban {pseudo}", d: "Bannit définitivement un utilisateur du chat.", a: "mod" },
            { t: "!timeout {pseudo}", d: "Exclut un utilisateur pendant 10 minutes.", a: "mod" },
            { t: "!uptime", d: "Affiche depuis combien de temps le live est lancé.", a: "viewer" },
            { t: "!game", d: "Affiche le nom du jeu actuel.", a: "viewer" },
            { t: "!lurk", d: "Passe en mode spectateur silencieux.", a: "viewer" },
            { t: "!bug", d: "Signaler un problème technique sur le bot.", a: "viewer" },
            { t: "!felix", d: "Déclenche une réponse aléatoire de Félix.", a: "viewer" }
        ];

        // Fonction pour générer le tableau
        function renderCommands() {
            const tbody = document.getElementById('cmd-table-body');
            tbody.innerHTML = commandsData.map(cmd => {
                const badgeClass = cmd.a === 'mod' ? 'access-mod' : (cmd.a === 'vip' ? 'access-vip' : 'access-viewer');
                const badgeLabel = cmd.a === 'mod' ? 'Modérateur' : (cmd.a === 'vip' ? 'VIP' : 'Viewer');
                
                return `
                    <tr class="cmd-row">
                        <td style="padding-left: 2.5rem;"><span class="cmd-trigger">${cmd.t}</span></td>
                        <td style="color: var(--text-main); font-weight: 500;">${cmd.d}</td>
                        <td style="text-align: center;">
                            <span class="access-badge ${badgeClass}">${badgeLabel}</span>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Système de filtrage en temps réel
        function filterCommands() {
            const input = document.getElementById("cmdSearch");
            const filter = input.value.toLowerCase();
            const rows = document.querySelectorAll(".cmd-row");

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                // On cache ou affiche la ligne selon la recherche
                row.classList.toggle("hidden", !text.includes(filter));
            });
        }

        document.addEventListener("DOMContentLoaded", () => {
            // On vérifie l'auth Twitch via app.js
            checkAuth();
            renderCommands();
        });
    </script>
</body>
</html>