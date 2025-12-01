document.addEventListener("DOMContentLoaded", async () => {
    const token = checkAuth();
    const db = firebase.database();
    
    // VÉRIFICATION ADMIN (Masthom_)
    let isAdmin = false;
    const CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";
    
    if (token) {
        try {
            const r = await fetch('https://api.twitch.tv/helix/users', { headers: { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID }});
            const d = await r.json();
            if (d.data && d.data[0].login.toLowerCase() === "masthom_") {
                isAdmin = true;
                document.getElementById("admin-panel").style.display = "block";
                document.getElementById("th-actions").style.display = "table-cell";
            }
        } catch(e) { console.log("Pas admin"); }
    }

    // LISTE DES COMMANDES (Lecture Firebase)
    const listEl = document.getElementById("cmd-list");
    let allCommands = [];

    db.ref('viewer_data/commands').on('value', (snapshot) => {
        const data = snapshot.val();
        listEl.innerHTML = "";
        allCommands = [];

        if (data) {
            Object.entries(data).forEach(([key, cmd]) => {
                cmd.id = key; // On stocke la clé Firebase
                allCommands.push(cmd);
            });
            // Tri par catégorie puis par trigger
            allCommands.sort((a, b) => a.category.localeCompare(b.category) || a.trigger.localeCompare(b.trigger));
            renderCommands(allCommands);
        } else {
            // Si la base est vide, on affiche un message
            listEl.innerHTML = "<tr><td colspan='5' style='text-align:center'>Aucune commande trouvée.</td></tr>";
        }
    });

    // RENDU DU TABLEAU
    function renderCommands(cmds) {
        listEl.innerHTML = "";
        cmds.forEach(cmd => {
            const tr = document.createElement("tr");
            
            // Couleurs des badges
            let badgeColor = "background:rgba(114, 137, 218, 0.2); color:#7289da;"; // Info (Bleu)
            if(cmd.category === "fun") badgeColor = "background:rgba(233, 30, 99, 0.2); color:#e91e63;"; // Fun (Rose)
            if(cmd.category === "xp") badgeColor = "background:rgba(255, 215, 0, 0.1); color:#FFD700;"; // XP (Or)
            if(cmd.category === "moderator") badgeColor = "background:rgba(240, 71, 71, 0.2); color:#f04747;"; // Modo (Rouge)
            if(cmd.category === "game") badgeColor = "background:rgba(46, 204, 113, 0.2); color:#2ecc71;"; // Jeu (Vert)

            let actionsHTML = "";
            if (isAdmin) {
                actionsHTML = `
                    <td class="cmd-actions">
                        <button class="btn-icon btn-edit" onclick="editCmd('${cmd.id}')">✏️</button>
                        <button class="btn-icon btn-delete" onclick="deleteCmd('${cmd.id}')">🗑️</button>
                    </td>`;
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

    // --- FONCTIONS ADMIN ---

    document.getElementById("btn-add-cmd").onclick = () => {
        document.getElementById("cmd-form").reset();
        document.getElementById("cmd-id").value = "";
        document.getElementById("modal-title").textContent = "Ajouter une commande";
        document.getElementById("cmd-modal").style.display = "flex";
    };

    document.getElementById("cmd-form").onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById("cmd-id").value;
        const newCmd = {
            trigger: document.getElementById("in-trigger").value,
            description: document.getElementById("in-desc").value,
            category: document.getElementById("in-cat").value,
            access: document.getElementById("in-access").value
        };

        if (id) {
            await db.ref('viewer_data/commands/' + id).update(newCmd);
        } else {
            await db.ref('viewer_data/commands').push(newCmd);
        }
        closeModal();
    };

    window.editCmd = (id) => {
        const cmd = allCommands.find(c => c.id === id);
        if(cmd) {
            document.getElementById("cmd-id").value = id;
            document.getElementById("in-trigger").value = cmd.trigger;
            document.getElementById("in-desc").value = cmd.description;
            document.getElementById("in-cat").value = cmd.category;
            document.getElementById("in-access").value = cmd.access;
            document.getElementById("modal-title").textContent = "Modifier la commande";
            document.getElementById("cmd-modal").style.display = "flex";
        }
    };

    window.deleteCmd = async (id) => {
        if(confirm("Supprimer cette commande ?")) {
            await db.ref('viewer_data/commands/' + id).remove();
        }
    };

    window.closeModal = () => {
        document.getElementById("cmd-modal").style.display = "none";
    };

    // --- INITIALISATION UNIQUE (VOTRE LISTE STRICTE) ---
    // Ce bouton est caché, vous pouvez l'appeler via la console JS : initMyCommands()
    // OU l'ajouter temporairement pour cliquer une fois.
    window.initMyCommands = async () => {
        if(confirm("ACTION IRRÉVERSIBLE : Cela va effacer la base et mettre VOTRE liste exacte. Continuer ?")) {
            
            // 1. VIDER LA BASE
            await db.ref('viewer_data/commands').remove();

            // 2. LA LISTE STRICTE
            const myOfficialList = [
                // MODÉRATION
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

                // CHAT MODE
                { trigger: "!emotoff / !emoton", description: "Active/Désactive le mode Emotes Seules.", category: "moderator", access: "Modérateur" },
                { trigger: "!followoff / !followon", description: "Active/Désactive le mode Abonnés Seules.", category: "moderator", access: "Modérateur" },
                { trigger: "!shieldOff / !shieldOn", description: "Active/Désactive le mode Shield.", category: "moderator", access: "Modérateur" },
                { trigger: "!subon", description: "Active le mode Abonnés Payants Seules.", category: "moderator", access: "Modérateur" },

                // VIP
                { trigger: "!addvip", description: "Ajoute un utilisateur à la liste des VIP.", category: "moderator", access: "Modérateur" },
                { trigger: "!extendvip", description: "Prolonge la durée du statut VIP.", category: "moderator", access: "Modérateur" },
                { trigger: "!revokevip (!unvip)", description: "Retire le statut VIP.", category: "moderator", access: "Modérateur" },
                { trigger: "!myvip", description: "Permet de vérifier le statut VIP.", category: "xp", access: "Viewer" },

                // INFO GÉNÉRALES
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

                // TRADUCTION
                { trigger: "!ar (!ara)", description: "Traduire en Arabe.", category: "info", access: "Viewer" },
                { trigger: "!ch (!chi)", description: "Traduire en Chinois.", category: "info", access: "Viewer" },
                { trigger: "!eng (!en)", description: "Traduire en Anglais.", category: "info", access: "Viewer" },
                { trigger: "!esp (!es)", description: "Traduire en Espagnol.", category: "info", access: "Viewer" },
                { trigger: "!fr (!fra)", description: "Traduire en Français.", category: "info", access: "Viewer" },
                { trigger: "!ge (!all)", description: "Traduire en Allemand.", category: "info", access: "Viewer" },
                { trigger: "!it (!ita)", description: "Traduire en Italien.", category: "info", access: "Viewer" },
                { trigger: "!ja (!jap)", description: "Traduire en Japonais.", category: "info", access: "Viewer" },

                // TIMER
                { trigger: "!settimer", description: "Définit ou active un timer.", category: "moderator", access: "Modérateur" },
                { trigger: "!stoptimer", description: "Arrête ou désactive un timer.", category: "moderator", access: "Modérateur" },

                // EMOTES
                { trigger: "!dance", description: "Avalanche d'emote Danse.", category: "fun", access: "Viewer" },
                { trigger: "!hype", description: "Avalanche d'emote Hype.", category: "fun", access: "Viewer" },
                { trigger: "!love", description: "Avalanche d'emote Love.", category: "fun", access: "Viewer" },
                { trigger: "!raid", description: "Avalanche d'emote Raid.", category: "fun", access: "Viewer" },
                { trigger: "!sub", description: "Avalanche d'emote Money.", category: "fun", access: "Viewer" },

                // SONS
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

                // GAME BOMB
                { trigger: "!bombstart", description: "Lancer la bombe.", category: "game", access: "Streamer" },
                { trigger: "!stopbombe", description: "Arrêter la bombe.", category: "game", access: "Streamer" },
                { trigger: "!pass {pseudo}", description: "Passer la bombe.", category: "game", access: "Viewer" }
            ];
            
            // ENVOI MASSIF
            officialCommands.forEach(c => db.ref('viewer_data/commands').push(c));
            alert("✅ Liste officielle restaurée avec succès !");
        }
    };
});