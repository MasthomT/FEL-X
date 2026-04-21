document.addEventListener("DOMContentLoaded", () => {
    // Vérifie l'authentification Twitch
    checkAuth();
    
    const listEl = document.getElementById("cmd-list");
    if (!listEl) return;

    // --- ZÉRO FIREBASE : La liste officielle est stockée ici en dur ---
    const allCommands = [
        // Modération
        { trigger: "!ban", description: "Bannit un utilisateur de manière permanente.", category: "Modération", access: "Modérateur" },
        { trigger: "!clear", description: "Efface tous les messages visibles.", category: "Modération", access: "Modérateur" },
        { trigger: "!setgame (!sg)", description: "Définit le jeu en cours.", category: "Modération", access: "Modérateur" },
        { trigger: "!settitle (!st)", description: "Définit le titre du stream.", category: "Modération", access: "Modérateur" },
        { trigger: "!so (!shoutout)", description: "Fait la promotion d'un autre diffuseur.", category: "Modération", access: "Modérateur" },
        { trigger: "!to30m", description: "Timeout 30 minutes.", category: "Modération", access: "Modérateur" },
        { trigger: "!to1h", description: "Timeout 1 heure.", category: "Modération", access: "Modérateur" },
        { trigger: "!to12h", description: "Timeout 12 heures.", category: "Modération", access: "Modérateur" },
        { trigger: "!to24h", description: "Timeout 24 heures.", category: "Modération", access: "Modérateur" },
        { trigger: "!to1s", description: "Timeout 1 semaine.", category: "Modération", access: "Modérateur" },
        { trigger: "!toMax", description: "Timeout Max (2 semaines).", category: "Modération", access: "Modérateur" },
        { trigger: "!torando", description: "Timeout Random (Fun).", category: "Modération", access: "Modérateur" },
        { trigger: "!untimeout (!unto)", description: "Annule une exclusion temporaire.", category: "Modération", access: "Modérateur" },
        { trigger: "!permit", description: "Autorisation de lien unique.", category: "Modération", access: "Modérateur" },
        { trigger: "!unpermit", description: "Retire l'autorisation de lien.", category: "Modération", access: "Modérateur" },
        { trigger: "!tts (!oral)", description: "Active le Text-to-Speech.", category: "Modération", access: "Modérateur" },

        // Chat Mode
        { trigger: "!emoton / !emotoff", description: "Active/Désactive le mode Emotes Seules.", category: "Chat Mode", access: "Modérateur" },
        { trigger: "!followon / !followoff", description: "Active/Désactive le mode Abonnés Seuls.", category: "Chat Mode", access: "Modérateur" },
        { trigger: "!shieldOn / !shieldOff", description: "Active/Désactive le mode Bouclier.", category: "Chat Mode", access: "Modérateur" },
        { trigger: "!subon", description: "Active le mode Abonnés Payants Seuls.", category: "Chat Mode", access: "Modérateur" },

        // VIP
        { trigger: "!addvip", description: "Ajoute un VIP.", category: "VIP", access: "Modérateur" },
        { trigger: "!extendvip", description: "Prolonge un VIP.", category: "VIP", access: "Modérateur" },
        { trigger: "!revokevip (!unvip)", description: "Retire un VIP.", category: "VIP", access: "Modérateur" },
        { trigger: "!myvip", description: "Vérifier son statut VIP.", category: "VIP", access: "Modérateur" },

        // Infos
        { trigger: "!bug", description: "Signaler un problème.", category: "Infos", access: "Viewer" },
        { trigger: "!clip", description: "Créer un clip (30s).", category: "Infos", access: "Viewer" },
        { trigger: "!commandes (!cmde)", description: "Affiche la liste des commandes.", category: "Infos", access: "Viewer" },
        { trigger: "!discord (!dc)", description: "Lien du Discord.", category: "Infos", access: "Viewer" },
        { trigger: "!tips (!don)", description: "Faire un don.", category: "Infos", access: "Viewer" },
        { trigger: "!followinfo", description: "Depuis quand vous suivez.", category: "Infos", access: "Viewer" },
        { trigger: "!game", description: "Jeu actuel.", category: "Infos", access: "Viewer" },
        { trigger: "!giveaway", description: "Info concours.", category: "Infos", access: "Viewer" },
        { trigger: "!myinfo (!level)", description: "Vos stats (XP, Niveau).", category: "Infos", access: "Viewer" },
        { trigger: "!planning", description: "Calendrier des streams.", category: "Infos", access: "Viewer" },
        { trigger: "!rs (!social)", description: "Réseaux sociaux.", category: "Infos", access: "Viewer" },
        { trigger: "!watchtime", description: "Temps de visionnage.", category: "Infos", access: "Viewer" },

        // Traduction
        { trigger: "!eng (!en)", description: "Traduire en Anglais.", category: "Traduction", access: "Viewer" },
        { trigger: "!esp (!es)", description: "Traduire en Espagnol.", category: "Traduction", access: "Viewer" },
        { trigger: "!fr (!fra)", description: "Traduire en Français.", category: "Traduction", access: "Viewer" },

        // Timer & Jeux
        { trigger: "!settimer", description: "Définit un timer.", category: "Timer", access: "Modérateur" },
        { trigger: "!stoptimer", description: "Arrête un timer.", category: "Timer", access: "Modérateur" },
        { trigger: "!bombstart", description: "Lancer la bombe.", category: "Game Bomb", access: "Modérateur" },
        { trigger: "!stopbombe", description: "Arrêter la bombe.", category: "Game Bomb", access: "Modérateur" },
        { trigger: "!pass {pseudo}", description: "Passer la bombe.", category: "Game Bomb", access: "Viewer" },

        // Emotes & Sons
        { trigger: "!dance", description: "Avalanche d'emote Danse.", category: "Emotes", access: "Viewer" },
        { trigger: "!hype", description: "Avalanche d'emote Hype.", category: "Emotes", access: "Viewer" },
        { trigger: "!felix", description: "Son: Félix.", category: "Sons", access: "Viewer" },
        { trigger: "!lurk", description: "Mode Lurk.", category: "Sons", access: "Viewer" },
        { trigger: "!purge", description: "Alerte Purge (Son).", category: "Sons", access: "Modérateur" }
    ];

    function renderCommands(cmds) {
        listEl.innerHTML = "";
        if (cmds.length === 0) {
            listEl.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:20px; color:var(--text-dim);'>Aucune commande trouvée.</td></tr>";
            return;
        }

        cmds.forEach(cmd => {
            const tr = document.createElement("tr");
            
            // Code couleur dynamique selon l'accès (Modérateur vs Viewer)
            const accessColor = cmd.access === "Modérateur" ? "color:#f43f5e;" : "color:#10b981;";
            
            tr.innerHTML = `
                <td data-label="Commande"><span style="font-weight:800; color:var(--accent);">${cmd.trigger}</span></td>
                <td data-label="Description" style="color:var(--text);">${cmd.description}</td>
                <td data-label="Catégorie"><span style="background:rgba(255,255,255,0.05); padding:4px 8px; border-radius:6px; font-size:0.85em; border:1px solid var(--border);">${cmd.category}</span></td>
                <td data-label="Accès"><span style="font-weight:600; font-size:0.85rem; ${accessColor}">${cmd.access}</span></td>
            `;
            listEl.appendChild(tr);
        });
    }

    function filterCommands() {
        const searchTerm = document.getElementById("cmd-search") ? document.getElementById("cmd-search").value.toLowerCase() : "";
        const category = document.getElementById("cmd-filter") ? document.getElementById("cmd-filter").value : "all";
        
        const filtered = allCommands.filter(cmd => {
            const matchesSearch = cmd.trigger.toLowerCase().includes(searchTerm) || cmd.description.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || cmd.category === category;
            return matchesSearch && matchesCategory;
        });
        renderCommands(filtered);
    }

    if (document.getElementById("cmd-search")) {
        document.getElementById("cmd-search").addEventListener("input", filterCommands);
        document.getElementById("cmd-filter").addEventListener("change", filterCommands);
    }

    // Tri initial : par Catégorie, puis alphabétique
    allCommands.sort((a, b) => a.category.localeCompare(b.category) || a.trigger.localeCompare(b.trigger));
    renderCommands(allCommands);
});