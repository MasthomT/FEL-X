/**
 * COMMANDS.JS - Moteur de recherche et base de données complète
 * Synchronisé avec le design Premium Sombre.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Vérification de l'auth Twitch
    if (typeof checkAuth === 'function') checkAuth();

    const tbody = document.getElementById("cmd-list-body");
    const searchInput = document.getElementById("cmdSearch");
    const catFilter = document.getElementById("catFilter");

    // ==========================================================
    // 📂 BASE DE DONNÉES INTÉGRALE DES COMMANDES
    // ==========================================================
    const allCommands = [
        // --- INFOS & LIENS ---
        { t: "!discord (!dc)", c: "Infos", d: "Envoie le lien d'invitation permanent du serveur Discord.", a: "viewer" },
        { t: "!myinfo (!level)", c: "Infos", d: "Affiche ton niveau actuel, ton EXP et tes stats personnelles.", a: "viewer" },
        { t: "!watchtime", c: "Infos", d: "Consulte ton temps total de visionnage sur la chaîne.", a: "viewer" },
        { t: "!planning", c: "Infos", d: "Affiche le calendrier des prochaines diffusions.", a: "viewer" },
        { t: "!rs (!social)", c: "Infos", d: "Affiche tous les réseaux sociaux officiels de Masthom.", a: "viewer" },
        { t: "!game", c: "Infos", d: "Affiche le nom du jeu ou de la catégorie actuelle.", a: "viewer" },
        { t: "!tips (!don)", c: "Infos", d: "Lien sécurisé pour soutenir financièrement le stream.", a: "viewer" },
        { t: "!bug", c: "Infos", d: "Signaler un problème technique directement au développeur.", a: "viewer" },
        { t: "!commandes (!cmde)", c: "Infos", d: "Affiche le lien vers cette page d'aide.", a: "viewer" },
        { t: "!clip", c: "Infos", d: "Crée instantanément un clip des 30 dernières secondes.", a: "viewer" },

        // --- MODÉRATION ---
        { t: "!so (!shoutout)", c: "Modération", d: "Promotion d'un streamer ami avec affichage d'un clip.", a: "mod" },
        { t: "!ban {pseudo}", c: "Modération", d: "Bannit définitivement un utilisateur perturbateur.", a: "mod" },
        { t: "!clear", c: "Modération", d: "Supprime l'intégralité de l'historique du chat.", a: "mod" },
        { t: "!to30m {pseudo}", c: "Modération", d: "Exclut un utilisateur pendant 30 minutes.", a: "mod" },
        { t: "!to1h {pseudo}", c: "Modération", d: "Exclut un utilisateur pendant 1 heure.", a: "mod" },
        { t: "!untimeout", c: "Modération", d: "Annule une exclusion temporaire en cours.", a: "mod" },
        { t: "!setgame (!sg)", c: "Modération", d: "Change dynamiquement la catégorie du stream.", a: "mod" },
        { t: "!settitle (!st)", c: "Modération", d: "Met à jour le titre officiel du live.", a: "mod" },

        // --- CHAT MODE ---
        { t: "!emoton / !off", c: "Chat Mode", d: "Active ou désactive le mode 'Emotes Uniquement'.", a: "mod" },
        { t: "!followon / !off", c: "Chat Mode", d: "Active ou désactive le mode 'Followers Uniquement'.", a: "mod" },
        { t: "!slow {sec}", c: "Chat Mode", d: "Active le mode lent (ex: !slow 10).", a: "mod" },

        // --- VIP ---
        { t: "!addvip {pseudo}", c: "VIP", d: "Accorde le statut VIP à un utilisateur méritant.", a: "mod" },
        { t: "!extendvip", c: "VIP", d: "Prolonge la durée de validité d'un grade VIP.", a: "mod" },
        { t: "!revokevip", c: "VIP", d: "Retire le statut VIP d'un utilisateur.", a: "mod" },

        // --- FUN & IA ---
        { t: "!felix", c: "Fun", d: "Déclenche une réponse aléatoire (souvent piquante) de Félix.", a: "viewer" },
        { t: "!lurk", c: "Fun", d: "Annonce que tu passes en mode spectateur silencieux.", a: "viewer" },
        { t: "!hug {pseudo}", c: "Fun", d: "Fait un gros câlin virtuel à quelqu'un dans le chat.", a: "viewer" },
        { t: "!love {pseudo}", c: "Fun", d: "Calcule le taux d'affinité avec un autre viewer.", a: "viewer" },
        { t: "!dance", c: "Fun", d: "Déclenche une pluie d'emotes de danse à l'écran.", a: "viewer" },
        { t: "!hype", c: "Fun", d: "Lance une avalanche d'emotes de Hype sur le stream.", a: "viewer" },

        // --- TRADUCTION ---
        { t: "!eng (!en)", c: "Traduction", d: "Traduit automatiquement ton message en Anglais.", a: "viewer" },
        { t: "!esp (!es)", c: "Traduction", d: "Traduit automatiquement ton message en Espagnol.", a: "viewer" },
        { t: "!fr (!fra)", c: "Traduction", d: "Traduit ton message en Français.", a: "viewer" },

        // --- MINI-JEUX ---
        { t: "!bombstart", c: "Jeux", d: "Lance une nouvelle partie du jeu de la Bombe.", a: "mod" },
        { t: "!pass {pseudo}", c: "Jeux", d: "Passe la bombe avant qu'elle n'explose entre tes mains.", a: "viewer" },

        // --- ADMIN ---
        { t: "!renotif", c: "Admin", d: "Force le renvoi de l'alerte de live sur Discord.", a: "admin" },
        { t: "!addxp {p} {v}", c: "Admin", d: "Donne manuellement des points d'expérience.", a: "admin" },
        { t: "!replay", c: "Admin", d: "Relance le dernier clip ou un clip via son ID.", a: "admin" },
        { t: "!checkcopains", c: "Admin", d: "Scanne si des streamers partenaires sont en live.", a: "admin" }
    ];

    // ==========================================================
    // 🛠️ MOTEUR DE RENDU DYNAMIQUE
    // ==========================================================
    function render() {
        if (!tbody) return;
        const q = searchInput.value.toLowerCase();
        const cat = catFilter.value;

        const filtered = allCommands.filter(cmd => {
            const matchesSearch = cmd.t.toLowerCase().includes(q) || cmd.d.toLowerCase().includes(q);
            const matchesCat = cat === "all" || cmd.c === cat;
            return matchesSearch && matchesCat;
        });

        tbody.innerHTML = filtered.map(cmd => {
            let bClass = "badge-viewer"; 
            let bLabel = "Viewer";
            
            if (cmd.a === "mod") { bClass = "badge-mod"; bLabel = "Modérateur"; }
            else if (cmd.a === "vip") { bClass = "badge-vip"; bLabel = "VIP"; }
            else if (cmd.a === "admin") { bClass = "badge-admin"; bLabel = "Admin"; }

            return `
            <tr class="cmd-row">
                <td style="padding-left: 2.5rem;"><span class="cmd-trigger">${cmd.t}</span></td>
                <td><span class="cat-tag">${cmd.c}</span></td>
                <td style="color: var(--text-main); font-weight: 500; font-size: 0.9rem;">${cmd.d}</td>
                <td style="text-align: center;">
                    <span class="badge ${bClass}">${bLabel}</span>
                </td>
            </tr>`;
        }).join('');

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:5rem; color:var(--text-dim); font-style:italic;">Désolé, Félix n'a trouvé aucune commande pour cette recherche...</td></tr>`;
        }
    }

    // Écouteurs pour filtrage instantané
    searchInput.addEventListener("input", render);
    catFilter.addEventListener("change", render);
    
    // Tri initial alphabétique par catégorie puis commande
    allCommands.sort((a, b) => a.c.localeCompare(b.c) || a.t.localeCompare(b.t));
    
    render();
});