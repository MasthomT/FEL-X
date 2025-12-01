document.addEventListener("DOMContentLoaded", async () => {
    checkAuth(); // Vérifie la connexion
    const db = firebase.database();
    const listEl = document.getElementById("cmd-list");
    
    // --- VÉRIFICATION ADMIN ---
    const token = localStorage.getItem("twitch_token");
    const CLIENT_ID = "kgyfzs0k3wk8enx7p3pd6299ro4izv";
    let isAdmin = false;
    
    if (token) {
        try {
            const r = await fetch('https://api.twitch.tv/helix/users', { headers: { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID }});
            const d = await r.json();
            if (d.data && d.data[0].login.toLowerCase() === "masthom_") {
                isAdmin = true;
                document.getElementById("admin-panel").style.display = "flex"; // Affiche les boutons Admin
                document.getElementById("th-actions").style.display = "table-cell"; // Affiche la colonne Actions
            }
        } catch(e) { console.log("Mode Viewer"); }
    }

    // --- LECTURE DES COMMANDES (FIREBASE) ---
    let allCommands = [];

    db.ref('viewer_data/commands').on('value', (snapshot) => {
        const data = snapshot.val();
        listEl.innerHTML = "";
        allCommands = [];

        if (data) {
            Object.entries(data).forEach(([key, cmd]) => {
                cmd.id = key;
                allCommands.push(cmd);
            });
            
            // Tri par Catégorie puis par Nom
            allCommands.sort((a, b) => a.category.localeCompare(b.category) || a.trigger.localeCompare(b.trigger));
            renderCommands(allCommands);
        } else {
            listEl.innerHTML = "<tr><td colspan='5' style='text-align:center; padding:20px;'>Aucune commande. Cliquez sur 'Restaurer la liste officielle' si vous êtes admin.</td></tr>";
        }
    });

    // --- AFFICHAGE ---
    function renderCommands(cmds) {
        listEl.innerHTML = "";
        cmds.forEach(cmd => {
            const tr = document.createElement("tr");
            
            // Gestion des couleurs de badges selon VOS catégories
            let badgeColor = "background:rgba(128,128,128,0.2); color:#ccc;"; // Défaut
            const cat = cmd.category;

            if(cat === "Modération") badgeColor = "background:rgba(240, 71, 71, 0.2); color:#f04747;"; 
            if(cat === "Chat Mode") badgeColor = "background:rgba(255, 165, 0, 0.2); color:#FFA500;";
            if(cat === "VIP") badgeColor = "background:rgba(255, 215, 0, 0.2); color:#FFD700;";
            if(cat === "Infos") badgeColor = "background:rgba(114, 137, 218, 0.2); color:#7289da;";
            if(cat === "Traduction") badgeColor = "background:rgba(0, 255, 255, 0.2); color:#00FFFF;";
            if(cat === "Timer") badgeColor = "background:rgba(255, 255, 255, 0.1); color:#fff;";
            if(cat === "Emotes") badgeColor = "background:rgba(233, 30, 99, 0.2); color:#e91e63;";
            if(cat === "Sons") badgeColor = "background:rgba(155, 89, 182, 0.2); color:#9b59b6;";
            if(cat === "Game Bomb") badgeColor = "background:rgba(46, 204, 113, 0.2); color:#2ecc71;";

            // Boutons d'action (Edit/Delete)
            let actionsHTML = "";
            if (isAdmin) {
                actionsHTML = `
                    <td class="cmd-actions">
                        <button class="btn-icon btn-edit" onclick="editCmd('${cmd.id}')" title="Modifier">✏️</button>
                        <button class="btn-icon btn-delete" onclick="deleteCmd('${cmd.id}')" title="Supprimer">🗑️</button>
                    </td>`;
            }

            tr.innerHTML = `
                <td><span class="command-trigger">${cmd.trigger}</span></td>
                <td style="color:var(--text-dim)">${cmd.description}</td>
                <td><span style="padding:4px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold; ${badgeColor}">${cat}</span></td>
                <td>${cmd.access}</td>
                ${actionsHTML}
            `;
            listEl.appendChild(tr);
        });
    }

    // --- FILTRES ---
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

    // --- GESTION ADMIN (Ajout / Modif / Init) ---

    // Bouton "Ajouter"
    document.getElementById("btn-add-cmd").onclick = () => {
        document.getElementById("cmd-form").reset();
        document.getElementById("cmd-id").value = "";
        document.getElementById("modal-title").textContent = "Ajouter une commande";
        document.getElementById("cmd-modal").style.display = "flex";
    };

    // Soumission formulaire
    document.getElementById("cmd-form").onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById("cmd-id").value;
        const newCmd = {
            trigger: document.getElementById("in-trigger").value,
            description: document.getElementById("in-desc").value,
            category: document.getElementById("in-cat").value,
            access: document.getElementById("in-access").value
        };

        if (id) { await db.ref('viewer_data/commands/' + id).update(newCmd); } 
        else { await db.ref('viewer_data/commands').push(newCmd); }
        closeModal();
    };

    // Fonctions Globales (pour le HTML)
    window.editCmd = (id) => {
        const cmd = allCommands.find(c => c.id === id);
        if(cmd) {
            document.getElementById("cmd-id").value = id;
            document.getElementById("in-trigger").value = cmd.trigger;
            document.getElementById("in-desc").value = cmd.description;
            document.getElementById("in-cat").value = cmd.category;
            document.getElementById("in-access").value = cmd.access;
            document.getElementById("modal-title").textContent = "Modifier";
            document.getElementById("cmd-modal").style.display = "flex";
        }
    };

    window.deleteCmd = async (id) => {
        if(confirm("Supprimer définitivement cette commande ?")) {
            await db.ref('viewer_data/commands/' + id).remove();
        }
    };

    window.closeModal = () => { document.getElementById("cmd-modal").style.display = "none"; };

    // --- INITIALISATION : VOTRE LISTE EXACTE ---
    document.getElementById("btn-init-db").onclick = async () => {
        if(confirm("⚠️ ATTENTION : Cela va effacer toutes les commandes actuelles et remettre votre liste officielle propre. Continuer ?")) {
            
            // 1. Vider la table
            await db.ref('viewer_data/commands').remove();
            
            // 2. La Liste EXACTE demandée
            const officialList = [
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
                { trigger: "!oral / !taistoi", description: "Action personnalisée.", category: "Modération", access: "Modérateur" },

                // Chat Mode
                { trigger: "!emoton / !emotoff", description: "Active/Désactive le mode Emotes Seules.", category: "Chat Mode", access: "Modérateur" },
                { trigger: "!followon / !followoff", description: "Active/Désactive le mode Abonnés Seules.", category: "Chat Mode", access: "Modérateur" },
                { trigger: "!shieldOn / !shieldOff", description: "Active/Désactive le mode Shield.", category: "Chat Mode", access: "Modérateur" },
                { trigger: "!subon", description: "Active le mode Abonnés Payants Seules.", category: "Chat Mode", access: "Modérateur" },

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
                { trigger: "!game (!gameinfo)", description: "Jeu actuel.", category: "Infos", access: "Viewer" },
                { trigger: "!giveaway (!roue)", description: "Info concours.", category: "Infos", access: "Viewer" },
                { trigger: "!myinfo (!level)", description: "Vos stats (XP, Niveau).", category: "Infos", access: "Viewer" },
                { trigger: "!onlyfan (!of)", description: "Lien OnlyFans.", category: "Infos", access: "Viewer" },
                { trigger: "!planning", description: "Calendrier des streams.", category: "Infos", access: "Viewer" },
                { trigger: "!rs (!social)", description: "Réseaux sociaux.", category: "Infos", access: "Viewer" },
                { trigger: "!team", description: "Info équipe Twitch.", category: "Infos", access: "Viewer" },
                { trigger: "!tiktok", description: "Lien TikTok.", category: "Infos", access: "Viewer" },
                { trigger: "!top3", description: "Classement top 3.", category: "Infos", access: "Viewer" },
                { trigger: "!watchtime", description: "Temps de visionnage.", category: "Infos", access: "Viewer" },
                { trigger: "!youtube", description: "Lien YouTube.", category: "Infos", access: "Viewer" },

                // Traduction
                { trigger: "!ar (!ara)", description: "Traduire en Arabe.", category: "Traduction", access: "Viewer" },
                { trigger: "!ch (!chi)", description: "Traduire en Chinois.", category: "Traduction", access: "Viewer" },
                { trigger: "!eng (!en)", description: "Traduire en Anglais.", category: "Traduction", access: "Viewer" },
                { trigger: "!esp (!es)", description: "Traduire en Espagnol.", category: "Traduction", access: "Viewer" },
                { trigger: "!fr (!fra)", description: "Traduire en Français.", category: "Traduction", access: "Viewer" },
                { trigger: "!ge (!all)", description: "Traduire en Allemand.", category: "Traduction", access: "Viewer" },
                { trigger: "!it (!ita)", description: "Traduire en Italien.", category: "Traduction", access: "Viewer" },
                { trigger: "!ja (!jap)", description: "Traduire en Japonais.", category: "Traduction", access: "Viewer" },

                // Timer
                { trigger: "!settimer", description: "Définit un timer.", category: "Timer", access: "Modérateur" },
                { trigger: "!stoptimer", description: "Arrête un timer.", category: "Timer", access: "Modérateur" },

                // Emotes
                { trigger: "!dance", description: "Avalanche d'emote Danse.", category: "Emotes", access: "Viewer" },
                { trigger: "!hype", description: "Avalanche d'emote Hype.", category: "Emotes", access: "Viewer" },
                { trigger: "!love", description: "Avalanche d'emote Love.", category: "Emotes", access: "Viewer" },
                { trigger: "!raid", description: "Avalanche d'emote Raid.", category: "Emotes", access: "Viewer" },
                { trigger: "!sub", description: "Avalanche d'emote Money.", category: "Emotes", access: "Viewer" },

                // Sons
                { trigger: "!anniversaire", description: "Son: Joyeux Anniversaire.", category: "Sons", access: "Viewer" },
                { trigger: "!dodo", description: "Son: Dodo.", category: "Sons", access: "Viewer" },
                { trigger: "!faim", description: "Son: Faim.", category: "Sons", access: "Viewer" },
                { trigger: "!felix", description: "Son: Félix.", category: "Sons", access: "Viewer" },
                { trigger: "!fouet", description: "Son: Fouet.", category: "Sons", access: "Viewer" },
                { trigger: "!honte", description: "Son: Honte.", category: "Sons", access: "Viewer" },
                { trigger: "!lurk", description: "Mode Lurk.", category: "Sons", access: "Viewer" },
                { trigger: "!magnifique", description: "Son: Magnifique.", category: "Sons", access: "Viewer" },
                { trigger: "!ohe", description: "Son: Réveil.", category: "Sons", access: "Viewer" },
                { trigger: "!purge", description: "Alerte Purge (Son).", category: "Sons", access: "Modérateur" },
                { trigger: "!salope", description: "Son: Humoristique.", category: "Sons", access: "Viewer" },
                { trigger: "!seul", description: "Son: Solitude.", category: "Sons", access: "Viewer" },
                { trigger: "!tg", description: "Son: Faire taire.", category: "Sons", access: "Viewer" },
                { trigger: "!deshonneur", description: "Son: Déshonneur.", category: "Sons", access: "Viewer" },

                // Game Bomb
                { trigger: "!bombstart", description: "Lancer la bombe.", category: "Game Bomb", access: "Modérateur" },
                { trigger: "!stopbombe", description: "Arrêter la bombe.", category: "Game Bomb", access: "Modérateur" },
                { trigger: "!pass {pseudo}", description: "Passer la bombe.", category: "Game Bomb", access: "Viewer" }
            ];

            // Injection en base
            officialList.forEach(c => db.ref('viewer_data/commands').push(c));
            alert("✅ Liste restaurée avec succès !");
        }
    };
});