/**
 * COMMANDS.JS - Gestion dynamique de la liste complète
 */

document.addEventListener("DOMContentLoaded", () => {
    // Vérification de sécurité
    if (typeof checkAuth === 'function') checkAuth();

    const tbody = document.getElementById("cmd-list-body");
    const searchInput = document.getElementById("cmdSearch");
    const catFilter = document.getElementById("catFilter");

    // ==========================================================
    // 📂 TOUTES LES COMMANDES (BASE DE DONNÉES)
    // ==========================================================
    const allCommands = [
        // --- GÉNÉRAL ---
        { t: "!level", c: "Général", d: "Affiche ton niveau actuel et ton EXP totale.", a: "viewer" },
        { t: "!rang", c: "Général", d: "Affiche ta position exacte dans le classement.", a: "viewer" },
        { t: "!points", c: "Général", d: "Affiche ton solde actuel de points d'expérience.", a: "viewer" },
        { t: "!uptime", c: "Général", d: "Temps écoulé depuis le début du live.", a: "viewer" },
        { t: "!game", c: "Général", d: "Affiche le jeu ou la catégorie en cours.", a: "viewer" },
        { t: "!followage", c: "Général", d: "Affiche depuis combien de temps tu suis la chaîne.", a: "viewer" },
        { t: "!discord", c: "Général", d: "Envoie le lien d'invitation permanent du serveur Discord.", a: "viewer" },
        { t: "!lurk", c: "Général", d: "Annonce que tu passes en mode spectateur silencieux.", a: "viewer" },

        // --- FUN & IA ---
        { t: "!felix", c: "Fun", d: "Déclenche une réponse aléatoire (IA) de Félix.", a: "viewer" },
        { t: "!dance", c: "Fun", d: "Fait apparaître une pluie d'emotes à l'écran.", a: "viewer" },
        { t: "!love {pseudo}", c: "Fun", d: "Calcule le taux d'amour avec un autre viewer.", a: "viewer" },
        { t: "!hug {pseudo}", c: "Fun", d: "Fait un gros câlin virtuel à quelqu'un.", a: "viewer" },

        // --- OUTILS ---
        { t: "!clip", c: "Outils", d: "Crée instantanément un clip des 30 dernières secondes.", a: "viewer" },
        { t: "!bug {message}", c: "Outils", d: "Signale un problème technique directement au bot.", a: "viewer" },
        { t: "!socials", c: "Outils", d: "Affiche les réseaux sociaux officiels de Masthom.", a: "viewer" },
        { t: "!planning", c: "Outils", d: "Affiche l'emploi du temps des prochains streams.", a: "viewer" },

        // --- MODÉRATION ---
        { t: "!so {pseudo}", c: "Modération", d: "Lance un Shoutout avec vidéo pour un streamer ami.", a: "mod" },
        { t: "!ban {pseudo}", c: "Modération", d: "Bannit définitivement un utilisateur.", a: "mod" },
        { t: "!timeout {pseudo}", c: "Modération", d: "Exclut un utilisateur temporairement (10 min).", a: "mod" },
        { t: "!clear", c: "Modération", d: "Supprime tous les messages visibles du chat.", a: "mod" },
        { t: "!slow {sec}", c: "Modération", d: "Active le mode lent (ex: !slow 10).", a: "mod" },
        { t: "!unban {pseudo}", c: "Modération", d: "Réhabilite un utilisateur banni.", a: "mod" },

        // --- ADMIN ---
        { t: "!renotif", c: "Admin", d: "Force le renvoi de l'alerte de live sur Discord.", a: "admin" },
        { t: "!checkcopains", c: "Admin", d: "Scanne si des partenaires sont actuellement en live.", a: "admin" },
        { t: "!replay", c: "Admin", d: "Relance le dernier clip diffusé sur l'overlay.", a: "admin" },
        { t: "!addxp {pseudo} {val}", c: "Admin", d: "Donne manuellement des points d'EXP.", a: "admin" },
        { t: "!setlevel {pseudo} {lvl}", c: "Admin", d: "Définit directement le niveau d'un viewer.", a: "admin" }
    ];

    // ==========================================================
    // 🛠️ MOTEUR DE RENDU
    // ==========================================================
    function render() {
        if (!tbody) return;

        const searchText = searchInput.value.toLowerCase();
        const selectedCat = catFilter.value;

        const filtered = allCommands.filter(cmd => {
            const matchSearch = cmd.t.toLowerCase().includes(searchText) || cmd.d.toLowerCase().includes(searchText);
            const matchCat = selectedCat === "all" || cmd.c === selectedCat;
            return matchSearch && matchCat;
        });

        tbody.innerHTML = filtered.map(cmd => {
            let badgeClass = "badge-viewer";
            let badgeLabel = "Viewer";

            if (cmd.a === "mod") { badgeClass = "badge-mod"; badgeLabel = "Modérateur"; }
            else if (cmd.a === "vip") { badgeClass = "badge-vip"; badgeLabel = "VIP"; }
            else if (cmd.a === "admin") { badgeClass = "badge-admin"; badgeLabel = "Admin"; }

            return `
            <tr class="cmd-row">
                <td style="padding-left: 2.5rem;"><span class="cmd-trigger">${cmd.t}</span></td>
                <td><span class="cat-tag">${cmd.c}</span></td>
                <td style="color: var(--text-main); font-weight: 500; font-size: 0.9rem;">${cmd.d}</td>
                <td style="text-align: center;">
                    <span class="badge ${badgeClass}">${badgeLabel}</span>
                </td>
            </tr>`;
        }).join('');

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:4rem; color:var(--text-dim); font-style:italic;">Aucune commande ne correspond à votre recherche...</td></tr>`;
        }
    }

    // Écouteurs pour filtrage en direct
    if (searchInput) searchInput.addEventListener("input", render);
    if (catFilter) catFilter.addEventListener("change", render);

    // Premier rendu
    render();
});