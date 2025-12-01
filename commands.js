// --- VOTRE LISTE OFFICIELLE ET EXHAUSTIVE ---
const ALL_COMMANDS = [
    // 🛠️ MODÉRATION
    { trigger: "!ban", description: "Bannit un utilisateur de manière permanente du chat.", category: "moderator", access: "Modérateur" },
    { trigger: "!clear", description: "Efface tous les messages visibles dans le chat.", category: "moderator", access: "Modérateur" },
    { trigger: "!setgame (!sg)", description: "Définit le jeu en cours de diffusion.", category: "moderator", access: "Modérateur" },
    { trigger: "!settitle (!st)", description: "Définit le titre du stream actuel.", category: "moderator", access: "Modérateur" },
    { trigger: "!so (!shoutout)", description: "Fait la promotion d'un autre diffuseur.", category: "moderator", access: "Modérateur" },
    { trigger: "!to30m", description: "Timeout 30 minutes.", category: "moderator", access: "Modérateur" },
    { trigger: "!to1h", description: "Timeout 1 heure.", category: "moderator", access: "Modérateur" },
    { trigger: "!to12h", description: "Timeout 12 heures.", category: "moderator", access: "Modérateur" },
    { trigger: "!to24h", description: "Timeout 24 heures.", category: "moderator", access: "Modérateur" },
    { trigger: "!to1s", description: "Timeout 1 semaine.", category: "moderator", access: "Modérateur" },
    { trigger: "!toMax", description: "Timeout Max (~2 semaines).", category: "moderator", access: "Modérateur" },
    { trigger: "!torando", description: "Timeout un utilisateur aléatoire.", category: "moderator", access: "Modérateur" },
    { trigger: "!untimeout (!unto)", description: "Annule une exclusion temporaire.", category: "moderator", access: "Modérateur" },
    { trigger: "!permit", description: "Donne une permission unique d'envoyer un lien.", category: "moderator", access: "Modérateur" },
    { trigger: "!unpermit", description: "Retire la permission d'envoyer un lien.", category: "moderator", access: "Modérateur" },
    { trigger: "!tts (!oral)", description: "Active le Text-to-Speech dans le chat.", category: "moderator", access: "Modérateur" },
    { trigger: "!oral / !taistoi", description: "Commandes d'action personnalisées.", category: "moderator", access: "Modérateur" },

    // 💬 CHAT MODE
    { trigger: "!emoton / !emotoff", description: "Active/Désactive le mode Emotes Seules.", category: "moderator", access: "Modérateur" },
    { trigger: "!followon / !followoff", description: "Active/Désactive le mode Abonnés Seules.", category: "moderator", access: "Modérateur" },
    { trigger: "!shieldOn / !shieldOff", description: "Active/Désactive le mode Shield.", category: "moderator", access: "Modérateur" },
    { trigger: "!subon", description: "Active le mode Abonnés Payants Seules.", category: "moderator", access: "Modérateur" },
    { trigger: "!settimer", description: "Définit ou active un timer.", category: "moderator", access: "Modérateur" },
    { trigger: "!stoptimer", description: "Arrête ou désactive un timer.", category: "moderator", access: "Modérateur" },

    // 👑 VIP
    { trigger: "!addvip", description: "Ajoute un utilisateur à la liste des VIP.", category: "moderator", access: "Modérateur" },
    { trigger: "!extendvip", description: "Prolonge la durée du statut VIP.", category: "moderator", access: "Modérateur" },
    { trigger: "!revokevip (!unvip)", description: "Retire le statut VIP.", category: "moderator", access: "Modérateur" },
    { trigger: "!myvip", description: "Permet de vérifier le statut VIP.", category: "xp", access: "Viewer" },

    // ℹ️ INFOS GÉNÉRALES
    { trigger: "!bug", description: "Signaler un problème.", category: "info", access: "Viewer" },
    { trigger: "!clip", description: "Crée un clip des 30 dernières secondes.", category: "info", access: "Viewer" },
    { trigger: "!commandes (!cmde)", description: "Affiche la liste des commandes.", category: "info", access: "Viewer" },
    { trigger: "!discord (!dc)", description: "Affiche le lien vers le serveur Discord.", category: "info", access: "Viewer" },
    { trigger: "!tips (!don)", description: "Affiche le lien pour faire un don.", category: "info", access: "Viewer" },
    { trigger: "!followinfo", description: "Infos sur votre suivi.", category: "info", access: "Viewer" },
    { trigger: "!game (!gameinfo)", description: "Jeu actuellement diffusé.", category: "info", access: "Viewer" },
    { trigger: "!giveaway (!roue)", description: "Infos concours / tirage au sort.", category: "info", access: "Viewer" },
    { trigger: "!myinfo (!level)", description: "Vos informations (Niveau, XP...).", category: "xp", access: "Viewer" },
    { trigger: "!onlyfan (!of)", description: "Lien OnlyFans.", category: "info", access: "Viewer" },
    { trigger: "!planning", description: "Calendrier des streams.", category: "info", access: "Viewer" },
    { trigger: "!rs (!social)", description: "Liens réseaux sociaux.", category: "info", access: "Viewer" },
    { trigger: "!team", description: "Info équipe Twitch.", category: "info", access: "Viewer" },
    { trigger: "!tiktok", description: "Lien TikTok.", category: "info", access: "Viewer" },
    { trigger: "!top3", description: "Classement des 3 meilleurs viewers.", category: "xp", access: "Viewer" },
    { trigger: "!watchtime", description: "Temps total passé sur le stream.", category: "xp", access: "Viewer" },
    { trigger: "!youtube", description: "Lien YouTube.", category: "info", access: "Viewer" },

    // 🗣️ TRADUCTION
    { trigger: "!ar (!ara)", description: "Traduire en Arabe.", category: "info", access: "Viewer" },
    { trigger: "!ch (!chi)", description: "Traduire en Chinois.", category: "info", access: "Viewer" },
    { trigger: "!eng (!en)", description: "Traduire en Anglais.", category: "info", access: "Viewer" },
    { trigger: "!esp (!es)", description: "Traduire en Espagnol.", category: "info", access: "Viewer" },
    { trigger: "!fr (!fra)", description: "Traduire en Français.", category: "info", access: "Viewer" },
    { trigger: "!ge (!all)", description: "Traduire en Allemand.", category: "info", access: "Viewer" },
    { trigger: "!it (!ita)", description: "Traduire en Italien.", category: "info", access: "Viewer" },
    { trigger: "!ja (!jap)", description: "Traduire en Japonais.", category: "info", access: "Viewer" },

    // 🎭 FUN & EMOTES
    { trigger: "!dance", description: "Avalanche d'emote Danse.", category: "fun", access: "Viewer" },
    { trigger: "!hype", description: "Avalanche d'emote Hype.", category: "fun", access: "Viewer" },
    { trigger: "!love", description: "Avalanche d'emote Love.", category: "fun", access: "Viewer" },
    { trigger: "!raid", description: "Avalanche d'emote Raid.", category: "fun", access: "Viewer" },
    { trigger: "!sub", description: "Avalanche d'emote Money.", category: "fun", access: "Viewer" },

    // 🔊 SONS
    { trigger: "!anniversaire", description: "Son Joyeux Anniversaire.", category: "fun", access: "Viewer" },
    { trigger: "!dodo", description: "Son Dodo.", category: "fun", access: "Viewer" },
    { trigger: "!faim", description: "Son Faim.", category: "fun", access: "Viewer" },
    { trigger: "!felix", description: "Son Félix.", category: "fun", access: "Viewer" },
    { trigger: "!fouet", description: "Bruit de fouet.", category: "fun", access: "Viewer" },
    { trigger: "!honte", description: "Son de la honte.", category: "fun", access: "Viewer" },
    { trigger: "!lurk", description: "Mode Lurk.", category: "fun", access: "Viewer" },
    { trigger: "!magnifique", description: "C'est magnifique !", category: "fun", access: "Viewer" },
    { trigger: "!ohe", description: "Réveil streamer.", category: "fun", access: "Viewer" },
    { trigger: "!purge", description: "Alerte purge.", category: "moderator", access: "Modérateur" },
    { trigger: "!salope", description: "Son humoristique.", category: "fun", access: "Viewer" },
    { trigger: "!seul", description: "Son solitude.", category: "fun", access: "Viewer" },
    { trigger: "!tg", description: "Faire taire.", category: "fun", access: "Viewer" },
    { trigger: "!deshonneur", description: "Déshonneur !", category: "fun", access: "Viewer" },

    // 💣 GAME BOMB
    { trigger: "!bombstart", description: "Lancer la bombe.", category: "fun", access: "Streamer" },
    { trigger: "!stopbombe", description: "Arrêter la bombe.", category: "fun", access: "Streamer" },
    { trigger: "!pass {pseudo}", description: "Passer la bombe.", category: "fun", access: "Viewer" }
];

document.addEventListener("DOMContentLoaded", () => {
    // On garde juste la vérification d'auth pour la barre latérale, mais la liste s'affiche pour tout le monde
    checkAuth(); 

    const listEl = document.getElementById("cmd-list");
    const searchInput = document.getElementById("cmd-search");
    const filterSelect = document.getElementById("cmd-filter");

    function renderCommands(commands) {
        listEl.innerHTML = "";
        
        if (commands.length === 0) {
            listEl.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:20px;'>Aucune commande trouvée.</td></tr>";
            return;
        }

        commands.forEach(cmd => {
            const tr = document.createElement("tr");
            
            // Couleurs des badges
            let badgeColor = "background:rgba(114, 137, 218, 0.2); color:#7289da;"; // Info (Bleu)
            if(cmd.category === "fun") badgeColor = "background:rgba(233, 30, 99, 0.2); color:#e91e63;"; // Fun (Rose)
            if(cmd.category === "xp") badgeColor = "background:rgba(255, 215, 0, 0.1); color:#FFD700;"; // XP (Or)
            if(cmd.category === "moderator") badgeColor = "background:rgba(240, 71, 71, 0.2); color:#f04747;"; // Modo (Rouge)

            tr.innerHTML = `
                <td><span class="command-trigger">${cmd.trigger}</span></td>
                <td style="color:var(--text-dim)">${cmd.description}</td>
                <td><span style="padding:4px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold; ${badgeColor}">${cmd.category.toUpperCase()}</span></td>
                <td>${cmd.access}</td>
            `;
            listEl.appendChild(tr);
        });
    }

    function filterCommands() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = filterSelect.value;
        
        const filtered = ALL_COMMANDS.filter(cmd => {
            const matchesSearch = cmd.trigger.toLowerCase().includes(searchTerm) || 
                                  cmd.description.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || cmd.category === category;
            
            return matchesSearch && matchesCategory;
        });
        
        renderCommands(filtered);
    }

    // Écouteurs d'événements
    searchInput.addEventListener("input", filterCommands);
    filterSelect.addEventListener("change", filterCommands);

    // Affichage initial
    renderCommands(ALL_COMMANDS);
});