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

    // Ouvrir Modal Ajout
    document.getElementById("btn-add-cmd").onclick = () => {
        document.getElementById("cmd-form").reset();
        document.getElementById("cmd-id").value = "";
        document.getElementById("modal-title").textContent = "Ajouter une commande";
        document.getElementById("cmd-modal").style.display = "flex";
    };

    // Sauvegarder (Ajout ou Modif)
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

    // Éditer
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

    // Supprimer
    window.deleteCmd = async (id) => {
        if(confirm("Supprimer cette commande ?")) {
            await db.ref('viewer_data/commands/' + id).remove();
        }
    };

    window.closeModal = () => {
        document.getElementById("cmd-modal").style.display = "none";
    };

    // INITIALISATION MASSIVE (VOTRE LISTE OFFICIELLE)
    document.getElementById("btn-init-db").onclick = async () => {
        if(confirm("ATTENTION : Cela va ajouter toutes les commandes des screenshots à la base de données Firebase. Continuer ?")) {
            
            // Je vide d'abord la liste actuelle pour éviter les doublons
            await db.ref('viewer_data/commands').remove();

            const officialCommands = [
                // --- MODÉRATION ---
                { trigger: "!ban", description: "Bannit un utilisateur de manière permanente.", category: "moderator", access: "Modérateur" },
                { trigger: "!clear", description: "Efface tous les messages visibles.", category: "moderator", access: "Modérateur" },
                { trigger: "!setgame (!sg)", description: "Définit le jeu en cours.", category: "moderator", access: "Modérateur" },
                { trigger: "!settitle (!st)", description: "Définit le titre du stream.", category: "moderator", access: "Modérateur" },
                { trigger: "!so", description: "Fait la promotion d'un autre diffuseur.", category: "moderator", access: "Modérateur" },
                { trigger: "!to30m", description: "Timeout 30 minutes.", category: "moderator", access: "Modérateur" },
                { trigger: "!to1h", description: "Timeout 1 heure.", category: "moderator", access: "Modérateur" },
                { trigger: "!to12h", description: "Timeout 12 heures.", category: "moderator", access: "Modérateur" },
                { trigger: "!to24h", description: "Timeout 24 heures.", category: "moderator", access: "Modérateur" },
                { trigger: "!to1s", description: "Timeout 1 semaine.", category: "moderator", access: "Modérateur" },
                { trigger: "!toMax", description: "Timeout Max (2 semaines).", category: "moderator", access: "Modérateur" },
                { trigger: "!torando", description: "Timeout un utilisateur aléatoire (Fun).", category: "moderator", access: "Modérateur" },
                { trigger: "!untimeout (!unto)", description: "Annule une exclusion temporaire.", category: "moderator", access: "Modérateur" },
                { trigger: "!permit", description: "Autorise un utilisateur à poster un lien.", category: "moderator", access: "Modérateur" },
                { trigger: "!unpermit", description: "Retire la permission de lien.", category: "moderator", access: "Modérateur" },
                { trigger: "!tts (!oral)", description: "Active le Text-to-Speech.", category: "moderator", access: "Modérateur" },
                
                // --- CHAT MODES ---
                { trigger: "!emoton / !emotoff", description: "Active/Désactive le mode Emotes Only.", category: "moderator", access: "Modérateur" },
                { trigger: "!followon / !followoff", description: "Active/Désactive le mode Followers Only.", category: "moderator", access: "Modérateur" },
                { trigger: "!shieldOn / !shieldOff", description: "Active/Désactive le bouclier.", category: "moderator", access: "Modérateur" },
                { trigger: "!subon", description: "Active le mode Abonnés Only.", category: "moderator", access: "Modérateur" },

                // --- VIP ---
                { trigger: "!addvip", description: "Ajoute un VIP.", category: "moderator", access: "Modérateur" },
                { trigger: "!extendvip", description: "Prolonge un VIP.", category: "moderator", access: "Modérateur" },
                { trigger: "!revokevip", description: "Retire un VIP.", category: "moderator", access: "Modérateur" },
                { trigger: "!myvip", description: "Vérifier son statut VIP.", category: "xp", access: "Viewer" },

                // --- INFOS ---
                { trigger: "!bug", description: "Signaler un problème.", category: "info", access: "Viewer" },
                { trigger: "!clip", description: "Créer un clip des 30 dernières secondes.", category: "info", access: "Viewer" },
                { trigger: "!commandes", description: "Affiche cette liste.", category: "info", access: "Viewer" },
                { trigger: "!discord", description: "Lien du Discord.", category: "info", access: "Viewer" },
                { trigger: "!tips (!don)", description: "Faire un don.", category: "info", access: "Viewer" },
                { trigger: "!followinfo", description: "Depuis quand vous suivez la chaîne.", category: "info", access: "Viewer" },
                { trigger: "!game", description: "Jeu actuel.", category: "info", access: "Viewer" },
                { trigger: "!giveaway", description: "Info concours.", category: "info", access: "Viewer" },
                { trigger: "!myinfo", description: "Vos stats personnelles.", category: "xp", access: "Viewer" },
                { trigger: "!level (!niveau)", description: "Votre niveau actuel.", category: "xp", access: "Viewer" },
                { trigger: "!onlyfan", description: "Lien OnlyFans (Humour ?).", category: "info", access: "Viewer" },
                { trigger: "!planning", description: "Calendrier des streams.", category: "info", access: "Viewer" },
                { trigger: "!rs (!social)", description: "Réseaux sociaux.", category: "info", access: "Viewer" },
                { trigger: "!team", description: "Info équipe Twitch.", category: "info", access: "Viewer" },
                { trigger: "!tiktok", description: "Lien TikTok.", category: "info", access: "Viewer" },
                { trigger: "!top3", description: "Classement des meilleurs viewers.", category: "xp", access: "Viewer" },
                { trigger: "!watchtime", description: "Votre temps de visionnage.", category: "xp", access: "Viewer" },
                { trigger: "!youtube", description: "Lien YouTube.", category: "info", access: "Viewer" },

                // --- TRADUCTION ---
                { trigger: "!fr", description: "Traduire en Français.", category: "info", access: "Viewer" },
                { trigger: "!eng", description: "Traduire en Anglais.", category: "info", access: "Viewer" },
                { trigger: "!esp", description: "Traduire en Espagnol.", category: "info", access: "Viewer" },
                { trigger: "!it", description: "Traduire en Italien.", category: "info", access: "Viewer" },
                { trigger: "!ge", description: "Traduire en Allemand.", category: "info", access: "Viewer" },
                { trigger: "!jp", description: "Traduire en Japonais.", category: "info", access: "Viewer" },
                { trigger: "!ar", description: "Traduire en Arabe.", category: "info", access: "Viewer" },
                { trigger: "!ch", description: "Traduire en Chinois.", category: "info", access: "Viewer" },

                // --- TIMERS ---
                { trigger: "!settimer", description: "Définir un timer.", category: "moderator", access: "Modérateur" },
                { trigger: "!stoptimer", description: "Arrêter un timer.", category: "moderator", access: "Modérateur" },

                // --- EMOTES ---
                { trigger: "!dance", description: "Avalanche d'emotes Danse.", category: "fun", access: "Viewer" },
                { trigger: "!hype", description: "Avalanche d'emotes Hype.", category: "fun", access: "Viewer" },
                { trigger: "!love", description: "Avalanche d'emotes Amour.", category: "fun", access: "Viewer" },
                { trigger: "!raid", description: "Avalanche d'emotes Raid.", category: "fun", access: "Viewer" },
                { trigger: "!sub", description: "Avalanche d'emotes Money.", category: "fun", access: "Viewer" },

                // --- SONS ---
                { trigger: "!anniversaire", description: "Joyeux Anniversaire !", category: "fun", access: "Viewer" },
                { trigger: "!dodo", description: "Bonne nuit !", category: "fun", access: "Viewer" },
                { trigger: "!faim", description: "J'ai faim !", category: "fun", access: "Viewer" },
                { trigger: "!felix", description: "Appel à Félix.", category: "fun", access: "Viewer" },
                { trigger: "!fouet", description: "Bruit de fouet.", category: "fun", access: "Viewer" },
                { trigger: "!honte", description: "Son de la honte.", category: "fun", access: "Viewer" },
                { trigger: "!lurk", description: "Passage en mode Lurk.", category: "fun", access: "Viewer" },
                { trigger: "!magnifique", description: "C'est magnifique !", category: "fun", access: "Viewer" },
                { trigger: "!ohe", description: "Réveiller le streamer.", category: "fun", access: "Viewer" },
                { trigger: "!purge", description: "Alerte purge (Modo).", category: "moderator", access: "Modérateur" },
                { trigger: "!salope", description: "Son humoristique.", category: "fun", access: "Viewer" },
                { trigger: "!seul", description: "Moment solitude.", category: "fun", access: "Viewer" },
                { trigger: "!tg", description: "Faire taire.", category: "fun", access: "Viewer" },
                { trigger: "!deshonneur", description: "Déshonneur !", category: "fun", access: "Viewer" },

                // --- JEU DE LA BOMBE ---
                { trigger: "!bombstart", description: "Lancer une bombe.", category: "fun", access: "Streamer" },
                { trigger: "!stopbombe", description: "Arrêter la bombe.", category: "fun", access: "Streamer" },
                { trigger: "!pass", description: "Passer la bombe à un autre viewer.", category: "fun", access: "Viewer" }
            ];
            
            // Envoi vers Firebase
            officialCommands.forEach(c => db.ref('viewer_data/commands').push(c));
            alert("Base de données mise à jour avec la liste officielle !");
        }
    };
});