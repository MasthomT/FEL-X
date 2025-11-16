if(document.getElementById("logout-sidebar")) {
    document.getElementById("logout-sidebar").onclick = function() {
        localStorage.removeItem("twitch_token");
        window.location.replace("/index.html");
    };
}

// Liste Statique des Commandes (MISE À JOUR)
const ALL_COMMANDS = [
    // --- Commandes Générales (Commands) ---
    { 
        trigger: "!bug", 
        description: "Signaler un bug ou une erreur au Streamer.", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!clip", 
        description: "Créer un clip du stream en cours. (Aliases : !clip)", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!commandes ou !cmde", 
        description: "Affiche le lien vers cette page de commandes. (Aliases : !commandes, !cmde)", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!discord ou !dc", 
        description: "Affiche le lien pour rejoindre le serveur Discord de la communauté. (Aliases : !discord, !dc)", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!tips ou !don", 
        description: "Affiche le lien pour faire un tip/don au Streamer. (Aliases : !tips, !don)", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!followinfo", 
        description: "Affiche depuis combien de temps vous suivez la chaîne. (Aliases : !followinfo)", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!infogame ou !gameinfo", 
        description: "Affiche les informations sur le jeu en cours. (Aliases : !infogame, !gameinfo)", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!giveaway ou !giveaways ou !roue", 
        description: "Informations sur le giveaway ou la roue de la fortune en cours. (Aliases : !giveaway, !giveaways, !roue)", 
        category: "fun", 
        access: "Viewer" 
    },
    { 
        trigger: "!myinfo ou !ifc", 
        description: "Affiche vos informations (XP, Niveau). (Aliases : !myinfo, !ifc)", 
        category: "xp", 
        access: "Viewer" 
    },
    { 
        trigger: "!lvl ou !level ou !niv", 
        description: "Affiche votre niveau actuel sur la chaîne. (Aliases : !lvl, !level, !niv)", 
        category: "xp", 
        access: "Viewer" 
    },
    { 
        trigger: "!onlyfan ou !onlyfans ou !of", 
        description: "Informations sur l'Onlyfans (si applicable). (Aliases : !onlyfan, !onlyfans, !of)", 
        category: "fun", 
        access: "Viewer" 
    },
    { 
        trigger: "!planning", 
        description: "Affiche le lien vers le planning des streams. (Aliases : !planning)", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!rs ou !réseauxsociaux", 
        description: "Affiche les liens vers les réseaux sociaux du Streamer. (Aliases : !rs, !réseauxsociaux)", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!team", 
        description: "Informations sur l'équipe du Streamer. (Aliases : !team)", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!tiktok", 
        description: "Affiche le lien du compte TikTok du Streamer. (Aliases : !tiktok)", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!top3", 
        description: "Affiche les 3 viewers ayant le plus d'XP ou de watchtime. (Aliases : !top3)", 
        category: "xp", 
        access: "Viewer" 
    },
    { 
        trigger: "!watchtime", 
        description: "Affiche votre temps de visionnage total sur la chaîne. (Aliases : !watchtime)", 
        category: "xp", 
        access: "Viewer" 
    },
    { 
        trigger: "!youtube ou !yt", 
        description: "Affiche le lien de la chaîne YouTube du Streamer. (Aliases : !youtube, !yt)", 
        category: "info", 
        access: "Viewer" 
    },
    
    // --- Commandes Sonores ---
    { trigger: "!anniversaire", description: "Déclenche le son 'anniversaire'. (Aliases : !anniversaire)", category: "fun", access: "Viewer" },
    { trigger: "!crétin", description: "Déclenche le son 'crétin'. (Aliases : !crétin)", category: "fun", access: "Viewer" },
    { trigger: "!deshonneur", description: "Déclenche le son 'déshonneur'. (Aliases : !deshonneur)", category: "fun", access: "Viewer" },
    { trigger: "!dodo", description: "Déclenche le son 'dodo'. (Aliases : !dodo)", category: "fun", access: "Viewer" },
    { trigger: "!faim", description: "Déclenche le son 'faim'. (Aliases : !faim)", category: "fun", access: "Viewer" },
    { trigger: "!felix", description: "Déclenche le son 'felix'. (Aliases : !felix, !félix)", category: "fun", access: "Viewer" },
    { trigger: "!first", description: "Déclenche le son 'first'. (Aliases : !first)", category: "fun", access: "Viewer" },
    { trigger: "!fouet", description: "Déclenche le son 'fouet'. (Aliases : !fouet)", category: "fun", access: "Viewer" },
    { trigger: "!honte", description: "Déclenche le son 'honte'. (Aliases : !honte)", category: "fun", access: "Viewer" },
    { trigger: "!lurk", description: "Déclenche le son 'lurk' et annonce que vous restez en fond. (Aliases : !lurk)", category: "fun", access: "Viewer" },
    { trigger: "!magnifique ou !wouha", description: "Déclenche le son 'magnifique'. (Aliases : !magnifique, !wouha)", category: "fun", access: "Viewer" },
    { trigger: "!ohé ou !ohe", description: "Déclenche le son 'ohé'. (Aliases : !ohé, !ohe)", category: "fun", access: "Viewer" },
    { trigger: "!purge", description: "Déclenche le son 'purge'. (Aliases : !purge)", category: "fun", access: "Viewer" },
    { trigger: "!salope ou !salop", description: "Déclenche le son 'salope'. (Aliases : !salope, !salop)", category: "fun", access: "Viewer" },
    { trigger: "!seul", description: "Déclenche le son 'seul'. (Aliases : !seul)", category: "fun", access: "Viewer" },
    { trigger: "!tagueule", description: "Déclenche le son 'ta gueule'. (Aliases : !tagueule)", category: "fun", access: "Viewer" },

    // --- Commandes Emotes ---
    { 
        trigger: "!dance ou !danse", 
        description: "Affiche une emote de danse dans le chat. (Aliases : !dance, !danse)", 
        category: "fun", 
        access: "Viewer" 
    },
    { 
        trigger: "!hype", 
        description: "Affiche une emote 'hype'. (Aliases : !hype)", 
        category: "fun", 
        access: "Viewer" 
    },
    { 
        trigger: "!love", 
        description: "Affiche une emote d'amour. (Aliases : !love)", 
        category: "fun", 
        access: "Viewer" 
    },
    { 
        trigger: "!raid", 
        description: "Affiche une emote de raid. (Aliases : !raid)", 
        category: "fun", 
        access: "Viewer" 
    },
    { 
        trigger: "!sub", 
        description: "Affiche une emote de sub. (Aliases : !sub)", 
        category: "fun", 
        access: "Viewer" 
    },

    [cite_start]// --- Commandes de Traduction [cite: 1] ---
    { 
        trigger: "!ar ou !ara <texte>", 
        [cite_start]description: "Traduit le texte en Arabe. (Aliases : !ar, !ara) [cite: 1]", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!ch ou !chi <texte>", 
        description: "Traduit le texte en Chinois. (Aliases : !ch, !chi) [cite_start][cite: 1]", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!eng ou !len ou !lang ou !lan <texte>", 
        description: "Traduit le texte en Anglais. (Aliases : !eng, !len, !lang, !lan) [cite_start][cite: 1]", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!esp ou !les <texte>", 
        description: "Traduit le texte en Espagnol. (Aliases : !esp, !les) [cite_start][cite: 1]", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!fr ou !fra <texte>", 
        description: "Traduit le texte en Français. (Aliases : !fr, !fra) [cite_start][cite: 1]", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!ge ou !ger ou !tall ou !tal <texte>", 
        description: "Traduit le texte en Allemand. (Aliases : !ge, !ger, !tall, !tal) [cite_start][cite: 1]", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!it ou !ita <texte>", 
        description: "Traduit le texte en Italien. (Aliases : !it, !ita) [cite_start][cite: 1]", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!ja ou !jap <texte>", 
        description: "Traduit le texte en Japonais. (Aliases : !ja, !jap) [cite_start][cite: 1]", 
        category: "info", 
        access: "Viewer" 
    },
];

const commandsListEl = document.getElementById("commands-list");
const searchInput = document.getElementById("command-search");
const filterSelect = document.getElementById("command-filter");
const noResultsEl = document.getElementById("no-results");


function renderCommands(commands) {
    commandsListEl.innerHTML = "";
    
    if (commands.length === 0) {
        noResultsEl.style.display = 'block';
        return;
    }
    
    noResultsEl.style.display = 'none';

    commands.forEach(cmd => {
        const row = commandsListEl.insertRow();
        
        const triggerCell = row.insertCell();
        triggerCell.innerHTML = `<span class="command-trigger">${cmd.trigger}</span>`;
        
        const descCell = row.insertCell();
        descCell.textContent = cmd.description;
        
        const categoryCell = row.insertCell();
        categoryCell.textContent = cmd.category.charAt(0).toUpperCase() + cmd.category.slice(1);
        
        const accessCell = row.insertCell();
        // L'accès est par défaut "Viewer" dans le script, si vous souhaitez
        // un accès plus précis (Modérateur, Streamer, ou Level X), il faudrait
        // ajouter ces informations dans la liste des commandes ci-dessus.
        accessCell.innerHTML = `<span class="command-level">${cmd.access}</span>`; 
    });
}

function applyFiltersAndSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterCategory = filterSelect.value;
    
    let filteredCommands = ALL_COMMANDS;

    // 1. Appliquer le filtre par catégorie
    if (filterCategory !== 'all') {
        // La catégorie 'info' est utilisée pour les commandes de traduction
        const categoryKey = filterCategory === 'info' ? ['info', 'translation'] : [filterCategory];

        filteredCommands = filteredCommands.filter(cmd => 
            categoryKey.includes(cmd.category)
        );
    }
    
    // 2. Appliquer la recherche par mot-clé
    if (searchTerm) {
        filteredCommands = filteredCommands.filter(cmd => 
            cmd.trigger.toLowerCase().includes(searchTerm) || 
            cmd.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderCommands(filteredCommands);
}

// Initialisation: Afficher toutes les commandes au chargement et attacher les écouteurs
renderCommands(ALL_COMMANDS);
searchInput.addEventListener('input', applyFiltersAndSearch);
filterSelect.addEventListener('change', applyFiltersAndSearch);