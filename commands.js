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
            if (d.data && d.data[0].login === "masthom_") {
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
            renderCommands(allCommands);
        } else {
            listEl.innerHTML = "<tr><td colspan='5' style='text-align:center'>Aucune commande.</td></tr>";
        }
    });

    // RENDU DU TABLEAU
    function renderCommands(cmds) {
        listEl.innerHTML = "";
        cmds.forEach(cmd => {
            const tr = document.createElement("tr");
            
            let badgeColor = "background:rgba(114, 137, 218, 0.2); color:#7289da;";
            if(cmd.category === "fun") badgeColor = "background:rgba(233, 30, 99, 0.2); color:#e91e63;";
            if(cmd.category === "xp") badgeColor = "background:rgba(255, 215, 0, 0.1); color:#FFD700;";

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
            // Modif
            await db.ref('viewer_data/commands/' + id).update(newCmd);
        } else {
            // Création
            await db.ref('viewer_data/commands').push(newCmd);
        }
        closeModal();
    };

    // Éditer (remplir le formulaire)
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

    // INITIALISATION MASSIVE (Bouton secret pour remplir la base la 1ère fois)
    document.getElementById("btn-init-db").onclick = async () => {
        if(confirm("Cela va écraser/ajouter toutes les commandes par défaut basées sur tes screens. Continuer ?")) {
            const defaults = [
                { trigger: "!discord", description: "Lien du Discord", category: "info", access: "Viewer" },
                { trigger: "!reseaux", description: "Liste des réseaux", category: "info", access: "Viewer" },
                { trigger: "!twitter", description: "Mon Twitter", category: "info", access: "Viewer" },
                { trigger: "!instagram", description: "Mon Insta", category: "info", access: "Viewer" },
                { trigger: "!tiktok", description: "Mon TikTok", category: "info", access: "Viewer" },
                { trigger: "!youtube", description: "Ma chaîne YouTube", category: "info", access: "Viewer" },
                { trigger: "!boutique", description: "La boutique du stream", category: "info", access: "Viewer" },
                { trigger: "!don", description: "Me soutenir", category: "info", access: "Viewer" },
                { trigger: "!level", description: "Voir son niveau", category: "xp", access: "Viewer" },
                { trigger: "!classement", description: "Lien du Leaderboard", category: "xp", access: "Viewer" },
                { trigger: "!top", description: "Top 3 chat", category: "xp", access: "Viewer" },
                { trigger: "!prime", description: "Comment sub avec Prime", category: "soutien", access: "Viewer" },
                { trigger: "!sub", description: "Lien d'abonnement", category: "soutien", access: "Viewer" },
                { trigger: "!setup", description: "Config PC", category: "matos", access: "Viewer" },
                { trigger: "!souris", description: "Ma souris", category: "matos", access: "Viewer" },
                { trigger: "!clavier", description: "Mon clavier", category: "matos", access: "Viewer" },
                { trigger: "!ecran", description: "Mes écrans", category: "matos", access: "Viewer" },
                { trigger: "!bonjour", description: "Saluer le stream", category: "fun", access: "Viewer" },
                { trigger: "!gg", description: "Bravo !", category: "fun", access: "Viewer" },
                { trigger: "!love", description: "Envoyer de l'amour", category: "fun", access: "Viewer" },
                { trigger: "!raid", description: "Lancer un raid (Streamer)", category: "fun", access: "Streamer" },
                { trigger: "!uptime", description: "Temps de live", category: "info", access: "Viewer" },
                { trigger: "!followage", description: "Temps de follow", category: "info", access: "Viewer" }
            ];
            
            // On envoie tout
            defaults.forEach(c => db.ref('viewer_data/commands').push(c));
            alert("Commandes ajoutées !");
        }
    };
});