// --- VOTRE LISTE OFFICIELLE (Données en dur) ---
const STATIC_COMMANDS = [
    // --- INFOS ---
    { trigger: "!bug", description: "Affiche l'information sur un bug ou un lien pour signaler un problème.", category: "info", access: "Viewer" },
    { trigger: "!clip", description: "Crée un clip des 30 dernières secondes du stream.", category: "info", access: "Viewer" },
    { trigger: "!commandes (!cmde)", description: "Affiche la liste des commandes disponibles dans le chat.", category: "info", access: "Viewer" },
    { trigger: "!discord (!dc)", description: "Affiche le lien vers le serveur Discord du diffuseur.", category: "info", access: "Viewer" },
    { trigger: "!tips (!don)", description: "Affiche le lien pour faire un don (tip) au diffuseur.", category: "info", access: "Viewer" },
    { trigger: "!followinfo", description: "Fournit des informations sur le suivi de l'utilisateur.", category: "info", access: "Viewer" },
    { trigger: "!game (!gameinfo)", description: "Affiche le jeu actuellement diffusé.", category: "info", access: "Viewer" },
    { trigger: "!giveaway (!roue)", description: "Fournit des informations ou un lien pour un concours.", category: "info", access: "Viewer" },
    { trigger: "!onlyfan (!of)", description: "Affiche le lien vers la page Onlyfans (Humour).", category: "info", access: "Viewer" },
    { trigger: "!planning", description: "Affiche le calendrier des streams.", category: "info", access: "Viewer" },
    { trigger: "!rs (!social)", description: "Affiche les liens vers les réseaux sociaux.", category: "info", access: "Viewer" },
    { trigger: "!team", description: "Affiche l'information sur l'équipe Twitch.", category: "info", access: "Viewer" },
    { trigger: "!tiktok", description: "Affiche le lien vers le compte TikTok.", category: "info", access: "Viewer" },
    { trigger: "!youtube", description: "Affiche le lien vers la chaîne YouTube.", category: "info", access: "Viewer" },

    // --- TRADUCTION ---
    { trigger: "!ar (!ara)", description: "Traduit le texte en Arabe.", category: "info", access: "Viewer" },
    { trigger: "!ch (!chi)", description: "Traduit le texte en Chinois.", category: "info", access: "Viewer" },
    { trigger: "!eng (!en)", description: "Traduit le texte en Anglais.", category: "info", access: "Viewer" },
    { trigger: "!esp (!es)", description: "Traduit le texte en Espagnol.", category: "info", access: "Viewer" },
    { trigger: "!fr (!fra)", description: "Traduit le texte en Français.", category: "info", access: "Viewer" },
    { trigger: "!ge (!all)", description: "Traduit le texte en Allemand.", category: "info", access: "Viewer" },
    { trigger: "!it (!ita)", description: "Traduit le texte en Italien.", category: "info", access: "Viewer" },
    { trigger: "!ja (!jap)", description: "Traduit le texte en Japonais.", category: "info", access: "Viewer" },

    // --- XP & NIVEAUX ---
    { trigger: "!myinfo (!ivl)", description: "Affiche les informations de l'utilisateur (points, niveau...).", category: "xp", access: "Viewer" },
    { trigger: "!level (!nv)", description: "Affiche le niveau ou le classement d'un utilisateur.", category: "xp", access: "Viewer" },
    { trigger: "!top3", description: "Affiche le classement des 3 meilleurs utilisateurs.", category: "xp", access: "Viewer" },
    { trigger: "!watchtime", description: "Affiche le temps total passé à regarder le stream.", category: "xp", access: "Viewer" },
    { trigger: "!myvip", description: "Permet de vérifier le statut VIP.", category: "xp", access: "Viewer" },

    // --- FUN & SONS ---
    { trigger: "!dance", description: "Déclenche une avalanche d'emote danse.", category: "fun", access: "Viewer" },
    { trigger: "!hype", description: "Déclenche une avalanche d'emote hype.", category: "fun", access: "Viewer" },
    { trigger: "!love", description: "Déclenche une avalanche d'emote amour.", category: "fun", access: "Viewer" },
    { trigger: "!raid", description: "Déclenche une avalanche d'emote Raid.", category: "fun", access: "Viewer" },
    { trigger: "!sub", description: "Déclenche une avalanche d'emote Money.", category: "fun", access: "Viewer" },
    { trigger: "!anniversaire", description: "Son: Joyeux anniversaire.", category: "fun", access: "Viewer" },
    { trigger: "!dodo", description: "Son: Quand tu vas dormir.", category: "fun", access: "Viewer" },
    { trigger: "!faim", description: "Son: Quand tu as faim.", category: "fun", access: "Viewer" },
    { trigger: "!felix", description: "Son et message liés à Félix.", category: "fun", access: "Viewer" },
    { trigger: "!fouet", description: "Son: Bruit de fouet.", category: "fun", access: "Viewer" },
    { trigger: "!honte", description: "Son: Honte.", category: "fun", access: "Viewer" },
    { trigger: "!lurk", description: "Indique le mode Lurk.", category: "fun", access: "Viewer" },
    { trigger: "!magnifique", description: "Son: C'est magnifique.", category: "fun", access: "Viewer" },
    { trigger: "!ohe", description: "Son: Rappel au streamer de lire le chat.", category: "fun", access: "Viewer" },
    { trigger: "!salope", description: "Son: Humoristique.", category: "fun", access: "Viewer" },
    { trigger: "!seul", description: "Son: Solitude.", category: "fun", access: "Viewer" },
    { trigger: "!tg", description: "Son: Faire taire.", category: "fun", access: "Viewer" },
    { trigger: "!deshonneur", description: "Son: Déshonneur.", category: "fun", access: "Viewer" },
    { trigger: "!pass {pseudo}", description: "Jeu Bombe: Passer la bombe.", category: "fun", access: "Viewer" },

    // --- MODÉRATION (Tout à la fin !) ---
    { trigger: "!ban", description: "Bannit un utilisateur de manière permanente.", category: "moderator", access: "Modérateur" },
    { trigger: "!clear", description: "Efface tous les messages visibles.", category: "moderator", access: "Modérateur" },
    { trigger: "!setgame (!sg)", description: "Définit le jeu en cours.", category: "moderator", access: "Modérateur" },
    { trigger: "!settitle (!st)", description: "Définit le titre du stream.", category: "moderator", access: "Modérateur" },
    { trigger: "!so (!shoutout)", description: "Fait la promotion d'un autre diffuseur.", category: "moderator", access: "Modérateur" },
    { trigger: "!to30m", description: "Timeout 30 minutes.", category: "moderator", access: "Modérateur" },
    { trigger: "!to1h", description: "Timeout 1 heure.", category: "moderator", access: "Modérateur" },
    { trigger: "!to12h", description: "Timeout 12 heures.", category: "moderator", access: "Modérateur" },
    { trigger: "!to24h", description: "Timeout 24 heures.", category: "moderator", access: "Modérateur" },
    { trigger: "!to1s", description: "Timeout 1 semaine.", category: "moderator", access: "Modérateur" },
    { trigger: "!toMax", description: "Timeout Max.", category: "moderator", access: "Modérateur" },
    { trigger: "!torando", description: "Timeout Random (Fun).", category: "moderator", access: "Modérateur" },
    { trigger: "!untimeout", description: "Annule un timeout.", category: "moderator", access: "Modérateur" },
    { trigger: "!permit", description: "Autorisation de lien unique.", category: "moderator", access: "Modérateur" },
    { trigger: "!unpermit", description: "Retire l'autorisation de lien.", category: "moderator", access: "Modérateur" },
    { trigger: "!tts (!oral)", description: "Active le TTS.", category: "moderator", access: "Modérateur" },
    { trigger: "!emoton / !off", description: "Mode Emotes Only.", category: "moderator", access: "Modérateur" },
    { trigger: "!followon / !off", description: "Mode Followers Only.", category: "moderator", access: "Modérateur" },
    { trigger: "!shieldOn / !off", description: "Mode Bouclier.", category: "moderator", access: "Modérateur" },
    { trigger: "!subon", description: "Mode Abonnés Only.", category: "moderator", access: "Modérateur" },
    { trigger: "!settimer", description: "Définit un timer.", category: "moderator", access: "Modérateur" },
    { trigger: "!stoptimer", description: "Arrête un timer.", category: "moderator", access: "Modérateur" },
    { trigger: "!purge", description: "Son: Alerte purge.", category: "moderator", access: "Modérateur" },
    { trigger: "!addvip", description: "Ajoute un VIP.", category: "moderator", access: "Modérateur" },
    { trigger: "!extendvip", description: "Prolonge un VIP.", category: "moderator", access: "Modérateur" },
    { trigger: "!revokevip", description: "Retire un VIP.", category: "moderator", access: "Modérateur" },
    { trigger: "!bombstart", description: "Lance la bombe.", category: "moderator", access: "Streamer" },
    { trigger: "!stopbombe", description: "Arrête la bombe.", category: "moderator", access: "Streamer" }
];

document.addEventListener("DOMContentLoaded", async () => {
    checkAuth();
    const db = firebase.database();
    const listEl = document.getElementById("cmd-list");
    const searchInput = document.getElementById("cmd-search");
    const filterSelect = document.getElementById("cmd-filter");
    
    // Vérif Admin
    const token = localStorage.getItem("twitch_token");
    const CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";
    let isAdmin = false;
    
    if (token) {
        try {
            const r = await fetch('https://api.twitch.tv/helix/users', { headers: { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID }});
            const d = await r.json();
            if (d.data && d.data[0].login.toLowerCase() === "masthom_") {
                isAdmin = true;
                document.getElementById("admin-panel").style.display = "block";
                document.getElementById("th-actions").style.display = "table-cell";
            }
        } catch(e) {}
    }

    // 1. RECUPERATION DES COMMANDES (Mixte Static + Firebase)
    let dynamicCommands = [];
    
    // On charge les commandes ajoutées manuellement via l'interface
    try {
        const snapshot = await db.ref('viewer_data/commands').once('value');
        const data = snapshot.val();
        if (data) {
            Object.entries(data).forEach(([key, cmd]) => {
                cmd.id = key;
                dynamicCommands.push(cmd);
            });
        }
    } catch (e) { console.error("Erreur Firebase", e); }

    // Fusion : Liste Statique + Ajouts Dynamiques
    let allCommands = [...STATIC_COMMANDS, ...dynamicCommands];

    // 2. TRI AUTOMATIQUE PAR CATÉGORIE
    // Ordre : Info -> XP -> Fun -> Moderator (à la fin)
    const catOrder = { "info": 1, "xp": 2, "fun": 3, "moderator": 99 };
    
    allCommands.sort((a, b) => {
        const scoreA = catOrder[a.category] || 50;
        const scoreB = catOrder[b.category] || 50;
        
        if (scoreA !== scoreB) return scoreA - scoreB;
        return a.trigger.localeCompare(b.trigger);
    });

    // 3. AFFICHAGE
    renderCommands(allCommands);

    function renderCommands(cmds) {
        listEl.innerHTML = "";
        if (cmds.length === 0) {
            listEl.innerHTML = "<tr><td colspan='5' style='text-align:center; padding:20px;'>Aucune commande trouvée.</td></tr>";
            return;
        }

        cmds.forEach(cmd => {
            const tr = document.createElement("tr");
            
            // Badges
            let badgeColor = "background:rgba(114, 137, 218, 0.2); color:#7289da;"; 
            if(cmd.category === "fun") badgeColor = "background:rgba(233, 30, 99, 0.2); color:#e91e63;";
            if(cmd.category === "xp") badgeColor = "background:rgba(255, 215, 0, 0.1); color:#FFD700;";
            if(cmd.category === "moderator") badgeColor = "background:rgba(240, 71, 71, 0.2); color:#f04747;";

            let actionsHTML = "";
            // On ne peut modifier/supprimer QUE les commandes dynamiques (celles avec un ID)
            if (isAdmin && cmd.id) {
                actionsHTML = `
                    <td class="cmd-actions">
                        <button class="btn-icon btn-delete" onclick="deleteCmd('${cmd.id}')">🗑️</button>
                    </td>`;
            } else if (isAdmin) {
                actionsHTML = `<td><small style="opacity:0.5">Défaut</small></td>`;
            }

            tr.innerHTML = `
                <td><span class="command-trigger">${cmd.trigger}</span></td>
                <td style="color:var(--text-dim)">${cmd.description}</td>
                <td><span style="padding:4px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold; ${badgeColor}">${cmd.category.toUpperCase()}</span></td>
                <td>${cmd.access}</td>
                ${actionsHTML}
            `;
            listEl.appendChild(tr);
        });
    }

    // FILTRES
    function filterCommands() {
        const searchTerm = document.getElementById("cmd-search").value.toLowerCase();
        const category = document.getElementById("cmd-filter").value;
        
        const filtered = allCommands.filter(cmd => {
            const matchesSearch = cmd.trigger.toLowerCase().includes(searchTerm) || 
                                  cmd.description.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || cmd.category === category;
            return matchesSearch && matchesCategory;
        });
        renderCommands(filtered);
    }

    document.getElementById("cmd-search").addEventListener("input", filterCommands);
    document.getElementById("cmd-filter").addEventListener("change", filterCommands);

    // AJOUT MANUEL (Admin)
    document.getElementById("btn-add-cmd").onclick = () => {
        document.getElementById("cmd-form").reset();
        document.getElementById("cmd-modal").style.display = "flex";
    };

    document.getElementById("cmd-form").onsubmit = async (e) => {
        e.preventDefault();
        const newCmd = {
            trigger: document.getElementById("in-trigger").value,
            description: document.getElementById("in-desc").value,
            category: document.getElementById("in-cat").value,
            access: document.getElementById("in-access").value
        };
        await db.ref('viewer_data/commands').push(newCmd);
        window.location.reload(); // Recharge pour voir l'ajout
    };

    window.deleteCmd = async (id) => {
        if(confirm("Supprimer ?")) {
            await db.ref('viewer_data/commands/' + id).remove();
            window.location.reload();
        }
    };
    
    window.closeModal = () => { document.getElementById("cmd-modal").style.display = "none"; };
});