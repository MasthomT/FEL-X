// Liste des commandes (Vous pouvez en ajouter ici)
const ALL_COMMANDS = [
    { 
        trigger: "!bug", 
        description: "Signaler un bug ou une erreur au Streamer.", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!clip", 
        description: "Créer un clip du stream en cours.", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!commandes", 
        description: "Affiche le lien vers cette page.", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!discord", 
        description: "Rejoindre le serveur Discord de la communauté.", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!tips", 
        description: "Lien pour faire un don/tip au Streamer.", 
        category: "info", 
        access: "Viewer" 
    },
    { 
        trigger: "!level", 
        description: "Connaître votre niveau actuel et l'XP manquant.", 
        category: "xp", 
        access: "Viewer" 
    },
    { 
        trigger: "!classement", 
        description: "Affiche le lien vers le classement XP.", 
        category: "xp", 
        access: "Viewer" 
    },
    { 
        trigger: "!top", 
        description: "Affiche le top 3 des viewers dans le chat.", 
        category: "xp", 
        access: "Viewer" 
    },
    { 
        trigger: "!chapeau", 
        description: "Commande Fun (Testez pour voir !).", 
        category: "fun", 
        access: "Viewer" 
    },
    { 
        trigger: "!gg", 
        description: "Félicitations générale.", 
        category: "fun", 
        access: "Viewer" 
    }
];

document.addEventListener("DOMContentLoaded", () => {
    checkAuth(); // Vérifie la connexion via app.js

    const listEl = document.getElementById("cmd-list");
    const searchInput = document.getElementById("cmd-search");
    const filterSelect = document.getElementById("cmd-filter");
    const noResultsEl = document.getElementById("no-results");

    function renderCommands(commands) {
        listEl.innerHTML = "";
        
        if (commands.length === 0) {
            noResultsEl.style.display = 'block';
            return;
        }
        
        noResultsEl.style.display = 'none';

        commands.forEach(cmd => {
            const row = document.createElement("tr");
            
            // Badge catégorie
            let badgeClass = "badge-info";
            if (cmd.category === "xp") badgeClass = "badge-xp";
            if (cmd.category === "fun") badgeClass = "badge-fun";

            row.innerHTML = `
                <td><span class="command-trigger">${cmd.trigger}</span></td>
                <td style="color: var(--text-dim);">${cmd.description}</td>
                <td><span class="badge ${badgeClass}">${cmd.category.toUpperCase()}</span></td>
                <td>${cmd.access}</td>
            `;
            listEl.appendChild(row);
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