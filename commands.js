/**
 * COMMANDS.JS - Moteur de recherche et base de données des commandes
 * Ce fichier gère l'affichage dynamique et le filtrage par catégorie.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Vérification de l'authentification Twitch (via app.js)
    if (typeof checkAuth === 'function') {
        checkAuth();
    }

    const tbody = document.getElementById("cmd-list-body");
    const searchInput = document.getElementById("cmdSearch");
    const catFilter = document.getElementById("catFilter");

    // ==========================================================
    // 📂 BASE DE DONNÉES COMPLÈTE DES COMMANDES
    // ==========================================================
    const allCommands = [
        // --- GÉNÉRAL ---
        { t: "!level", c: "Général", d: "Affiche ton niveau actuel et ton EXP totale.", a: "viewer" },
        { t: "!rang", c: "Général", d: "Affiche ta position exacte dans le classement général.", a: "viewer" },
        { t: "!points", c: "Général", d: "Affiche ton solde actuel de points d'expérience.", a: "viewer" },
        { t: "!uptime", c: "Général", d: "Temps écoulé depuis le début de la diffusion.", a: "viewer" },
        { t: "!game", c: "Général", d: "Affiche le jeu ou la catégorie en cours de stream.", a: "viewer" },
        { t: "!followage", c: "Général", d: "Affiche depuis combien de temps tu suis Masthom.", a: "viewer" },
        { t: "!discord", c: "Général", d: "Envoie le lien d'invitation permanent du serveur Discord.", a: "viewer" },
        { t: "!lurk", c: "Général", d: "Annonce ton passage en mode spectateur silencieux.", a: "viewer" },

        // --- FUN & IA ---
        { t: "!felix", c: "Fun", d: "Déclenche une réponse aléatoire (souvent sarcastique) de Félix.", a: "viewer" },
        { t: "!dance", c: "Fun", d: "Fait apparaître une pluie d'emotes de danse sur le stream.", a: "viewer" },
        { t: "!love {pseudo}", c: "Fun", d: "Calcule mathématiquement le taux d'amour entre toi et un autre viewer.", a: "viewer" },

        // --- OUTILS ---
        { t: "!clip", c: "Outils", d: "Crée instantanément un clip des 30 dernières secondes.", a: "viewer" },
        { t: "!bug {message}", c: "Outils", d: "Signale un problème technique directement à Masthom.", a: "viewer" },
        { t: "!socials", c: "Outils", d: "Affiche tous les réseaux sociaux officiels de la chaîne.", a: "viewer" },

        // --- MODÉRATION ---
        { t: "!so {pseudo}", c: "Modération", d: "Lance un Shoutout avec vidéo pour un streamer partenaire.", a: "mod" },
        { t: "!ban {pseudo}", c: "Modération", d: "Bannit définitivement un utilisateur perturbateur du chat.", a: "mod" },
        { t: "!timeout {pseudo}", c: "Modération", d: "Exclut un utilisateur temporairement (10 minutes).", a: "mod" },
        { t: "!clear", c: "Modération", d: "Supprime tous les messages du chat (Vider la zone).", a: "mod" },
        { t: "!slow {sec}", c: "Modération", d: "Active le mode lent pour calmer le chat (ex: !slow 10).", a: "mod" },

        // --- ADMIN ---
        { t: "!renotif", c: "Admin", d: "Force le renvoi de la notification de live sur Discord.", a: "admin" },
        { t: "!checkcopains", c: "Admin", d: "Scanne et alerte si des streamers partenaires sont en live.", a: "admin" },
        { t: "!replay", c: "Admin", d: "Relance le dernier clip diffusé ou un clip spécifique.", a: "admin" },
        { t: "!addxp {pseudo} {val}", c: "Admin", d: "Attribue manuellement des points d'EXP à un viewer spécifique.", a: "admin" }
    ];

    // ==========================================================
    // 🛠️ MOTEUR DE RENDU DYNAMIQUE
    // ==========================================================
    function render() {
        if (!tbody) return;

        const searchText = searchInput.value.toLowerCase();
        const selectedCat = catFilter.value;

        // Filtrage des données
        const filtered = allCommands.filter(cmd => {
            const matchSearch = cmd.t.toLowerCase().includes(searchText) || cmd.d.toLowerCase().includes(searchText);
            const matchCat = selectedCat === "all" || cmd.c === selectedCat;
            return matchSearch && matchCat;
        });

        // Génération du HTML
        tbody.innerHTML = filtered.map(cmd => {
            let badgeClass = "badge-viewer";
            let badgeLabel = "Viewer";

            // Attribution du style selon l'accès
            if (cmd.a === "mod") { 
                badgeClass = "badge-mod"; 
                badgeLabel = "Modérateur"; 
            } else if (cmd.a === "vip") { 
                badgeClass = "badge-vip"; 
                badgeLabel = "VIP"; 
            } else if (cmd.a === "admin") { 
                badgeClass = "badge-admin"; 
                badgeLabel = "Admin"; 
            }

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

        // Affichage du message si aucun résultat
        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:4rem; color:var(--text-dim); font-style:italic;">Aucune commande ne correspond à votre recherche...</td></tr>`;
        }
    }

    // Écouteurs d'événements pour le filtrage en temps réel
    if (searchInput) searchInput.addEventListener("input", render);
    if (catFilter) catFilter.addEventListener("change", render);

    // Premier rendu au chargement
    render();
});