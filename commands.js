/**
 * COMMANDS.JS - Version Structurée par Catégories
 * Groupement automatique et visuel pour une meilleure lisibilité.
 */

document.addEventListener("DOMContentLoaded", () => {
    if (typeof checkAuth === 'function') checkAuth();

    const tbody = document.getElementById("cmd-list-body");
    const searchInput = document.getElementById("cmdSearch");
    const catFilter = document.getElementById("catFilter");

    const allCommands = [
        // --- INFOS & LIENS ---
        { t: "!discord (!dc)", c: "Infos", d: "Lien d'invitation permanent pour rejoindre la communauté sur Discord.", a: "viewer" },
        { t: "!myinfo (!fc / !level / !nv)", c: "Infos", d: "Affiche ton niveau, ton EXP globale et ton rang sur la chaîne.", a: "viewer" },
        { t: "!watchtime", c: "Infos", d: "Affiche ton temps de présence total sur le live.", a: "viewer" },
        { t: "!planning", c: "Infos", d: "Affiche le calendrier des prochains lives.", a: "viewer" },
        { t: "!rs (!social / !réseaux)", c: "Infos", d: "Affiche tous les réseaux sociaux officiels.", a: "viewer" },
        { t: "!tiktok", c: "Infos", d: "Lien direct vers le compte TikTok.", a: "viewer" },
        { t: "!youtube", c: "Infos", d: "Lien direct vers la chaîne YouTube.", a: "viewer" },
        { t: "!team", c: "Infos", d: "Affiche les membres de la team actuelle.", a: "viewer" },
        { t: "!infogame (!game)", c: "Infos", d: "Détails du jeu en cours.", a: "viewer" },
        { t: "!giveaway (!roue)", c: "Infos", d: "Détails sur le concours actuel.", a: "viewer" },
        { t: "!onlyfan (!of)", c: "Infos", d: "Lien vers le 'OnlyFans' de Masthom.", a: "viewer" },
        { t: "!bug", c: "Infos", d: "Signaler un problème technique.", a: "viewer" },
        { t: "!clip", c: "Infos", d: "Crée un clip des 30 dernières secondes.", a: "viewer" },
        { t: "!top3", c: "Infos", d: "Affiche le podium des viewers les plus actifs.", a: "viewer" },

        // --- MODÉRATION ---
        { t: "!so (!shoutout)", c: "Modération", d: "Promouvoir un streamer avec un clip sur OBS.", a: "mod" },
        { t: "!ban {pseudo}", c: "Modération", d: "Bannir un utilisateur du chat.", a: "mod" },
        { t: "!clear", c: "Modération", d: "Effacer tout l'historique du chat.", a: "mod" },
        { t: "!permit / !unpermit", c: "Modération", d: "Gérer l'autorisation d'envoi de liens.", a: "mod" },
        { t: "!taistoi", c: "Modération", d: "Faire taire un utilisateur instantanément.", a: "mod" },
        { t: "!to1s / !toMax", c: "Modération", d: "Exclure temporairement un utilisateur.", a: "mod" },
        { t: "!setgame (!sg)", c: "Modération", d: "Changer la catégorie du stream.", a: "mod" },
        { t: "!settitle (!st)", c: "Modération", d: "Modifier le titre du live.", a: "mod" },
        { t: "!oral", c: "Modération", d: "Activer/Désactiver la lecture vocale (TTS).", a: "mod" },

        // --- CHAT MODE ---
        { t: "!emoteon / !emotoff", c: "Chat Mode", d: "Activer/Désactiver le mode Emotes uniquement.", a: "mod" },
        { t: "!followon / !folloff", c: "Chat Mode", d: "Activer/Désactiver le mode Followers uniquement.", a: "mod" },
        { t: "!subon", c: "Chat Mode", d: "Activer le mode Abonnés uniquement.", a: "mod" },
        { t: "!shieldOn / !shieldOff", c: "Chat Mode", d: "Gérer le bouclier de protection Twitch.", a: "mod" },

        // --- TRADUCTION ---
        { t: "!fr / !fra", c: "Traduction", d: "Traduit ton message en Français.", a: "viewer" },
        { t: "!eng / !en / !ang", c: "Traduction", d: "Traduit ton message en Anglais.", a: "viewer" },
        { t: "!esp / !es", c: "Traduction", d: "Traduit ton message en Espagnol.", a: "viewer" },
        { t: "!ger / !all", c: "Traduction", d: "Traduit ton message en Allemand.", a: "viewer" },
        { t: "!it / !ita", c: "Traduction", d: "Traduit ton message en Italien.", a: "viewer" },
        { t: "!ja / !jap", c: "Traduction", d: "Traduit ton message en Japonais.", a: "viewer" },
        { t: "!ar / !ara", c: "Traduction", d: "Traduit ton message en Arabe.", a: "viewer" },
        { t: "!ch / !chi", c: "Traduction", d: "Traduit ton message en Chinois.", a: "viewer" },

        // --- MINI-JEUX ---
        { t: "!bombstart", c: "Mini-Jeux", d: "Lancer une partie de la bombe.", a: "mod" },
        { t: "!pass {pseudo}", c: "Mini-Jeux", d: "Passer la bombe à un autre joueur.", a: "viewer" },
        { t: "!stopbombe", c: "Mini-Jeux", d: "Arrêter le jeu en cours.", a: "mod" },
        { t: "!mot {devinette}", c: "Mini-Jeux", d: "Deviner le mot secret pour l'EXP.", a: "viewer" },

        // --- SONS & FUN ---
        { t: "!felix", c: "Sons & Fun", d: "Réponse IA ou son aléatoire de Félix.", a: "viewer" },
        { t: "!roast {1-10}", c: "Sons & Fun", d: "Régler le niveau de méchanceté de Félix.", a: "viewer" },
        { t: "!lurk", c: "Sons & Fun", d: "Mode spectateur discret.", a: "viewer" },
        { t: "!first / !deuz / !troiz", c: "Sons & Fun", d: "Revendiquer sa place sur le podium.", a: "viewer" },
        { t: "!dance / !hype", c: "Sons & Fun", d: "Pluie d'emotes sur l'écran.", a: "viewer" },
        { t: "!love {pseudo}", c: "Sons & Fun", d: "Test d'affinité amoureux.", a: "viewer" },
        { t: "!raid", c: "Sons & Fun", d: "Message à copier pour un raid.", a: "viewer" },
        { t: "!salope / !tg / !dodo / !faim", c: "Sons & Fun", d: "Déclenche un son culte du stream.", a: "viewer" },
        { t: "!anniversaire / !ohe / !seul", c: "Sons & Fun", d: "Effets sonores divers.", a: "viewer" },

        // --- ADMIN ---
        { t: "!renotif", c: "Admin", d: "Renvoyer l'alerte live sur Discord.", a: "admin" },
        { t: "!replay", c: "Admin", d: "Relancer un clip spécifique sur OBS.", a: "admin" },
        { t: "!checkcopains", c: "Admin", d: "Vérifier l'état des partenaires.", a: "admin" },
        { t: "!settimer / !stoptimer", c: "Admin", d: "Gérer le compte à rebours visuel.", a: "admin" }
    ];

    const categoryIcons = {
        "Infos": "📋",
        "Modération": "🛡️",
        "Chat Mode": "💬",
        "Traduction": "🌍",
        "Mini-Jeux": "🎮",
        "Sons & Fun": "🎸",
        "Admin": "⚙️"
    };

    function render() {
        if (!tbody) return;
        const q = searchInput.value.toLowerCase();
        const cat = catFilter.value;

        // 1. Filtrage
        const filtered = allCommands.filter(cmd => {
            const matchesSearch = cmd.t.toLowerCase().includes(q) || cmd.d.toLowerCase().includes(q);
            const matchesCat = cat === "all" || cmd.c === cat;
            return matchesSearch && matchesCat;
        });

        // 2. Groupement par catégorie
        const groups = {};
        filtered.forEach(cmd => {
            if (!groups[cmd.c]) groups[cmd.c] = [];
            groups[cmd.c].push(cmd);
        });

        // 3. Rendu par blocs
        let html = "";
        
        // On respecte un ordre logique de catégories
        const sortedCats = Object.keys(groups).sort((a,b) => {
            const order = ["Infos", "Mini-Jeux", "Sons & Fun", "Traduction", "Chat Mode", "Modération", "Admin"];
            return order.indexOf(a) - order.indexOf(b);
        });

        sortedCats.forEach(catName => {
            // Ligne de titre de catégorie
            html += `
            <tr class="category-header">
                <td colspan="4" style="background: rgba(99, 102, 241, 0.05); padding: 1.2rem 2.5rem; border-bottom: 1px solid var(--border);">
                    <div style="display: flex; items-center; gap: 0.8rem;">
                        <span style="font-size: 1.2rem;">${categoryIcons[catName] || '📂'}</span>
                        <span style="font-weight: 900; color: #fff; text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem;">${catName}</span>
                        <span style="color: var(--text-dim); font-size: 0.75rem; font-weight: 400;">(${groups[catName].length} commandes)</span>
                    </div>
                </td>
            </tr>`;

            // Liste des commandes du groupe
            groups[catName].forEach(cmd => {
                let bClass = "badge-viewer"; 
                let bLabel = "Viewer";
                if (cmd.a === "mod") { bClass = "badge-mod"; bLabel = "Modérateur"; }
                else if (cmd.a === "vip") { bClass = "badge-vip"; bLabel = "VIP"; }
                else if (cmd.a === "admin") { bClass = "badge-admin"; bLabel = "Admin"; }

                html += `
                <tr class="cmd-row" style="transition: all 0.2s ease;">
                    <td style="padding-left: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.03);"><span class="cmd-trigger">${cmd.t}</span></td>
                    <td style="border-bottom: 1px solid rgba(255,255,255,0.03);"><span class="cat-tag">${cmd.c}</span></td>
                    <td style="color: var(--text-main); font-weight: 500; font-size: 0.9rem; border-bottom: 1px solid rgba(255,255,255,0.03);">${cmd.d}</td>
                    <td style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.03);">
                        <span class="badge ${bClass}">${bLabel}</span>
                    </td>
                </tr>`;
            });
        });

        tbody.innerHTML = html || `<tr><td colspan="4" style="text-align:center; padding:5rem; color:var(--text-dim); font-style:italic;">Félix n'a rien trouvé... 😿</td></tr>`;
    }

    searchInput.addEventListener("input", render);
    catFilter.addEventListener("change", render);
    
    // Premier rendu
    render();
});