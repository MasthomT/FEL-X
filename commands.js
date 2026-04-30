/**
 * COMMANDS.JS - Version Intégrale Streamer.bot + Raspberry Pi
 * Basée sur les captures d'écran et la logique du bot.
 */

document.addEventListener("DOMContentLoaded", () => {
    if (typeof checkAuth === 'function') checkAuth();

    const tbody = document.getElementById("cmd-list-body");
    const searchInput = document.getElementById("cmdSearch");
    const catFilter = document.getElementById("catFilter");

    const allCommands = [
        // --- COMMANDES INFO ---
        { t: "!discord (!dc)", c: "Infos", d: "Lien d'invitation permanent pour rejoindre la communauté sur Discord.", a: "viewer" },
        { t: "!myinfo (!fc / !level / !nv)", c: "Infos", d: "Affiche ton niveau, ton EXP globale et ton rang sur la chaîne.", a: "viewer" },
        { t: "!watchtime", c: "Infos", d: "Affiche ton temps de présence total sur le live depuis tes débuts.", a: "viewer" },
        { t: "!planning", c: "Infos", d: "Affiche le calendrier des prochains lives et événements prévus.", a: "viewer" },
        { t: "!rs (!réseaux / !social)", c: "Infos", d: "Affiche tous les réseaux sociaux (Insta, Twitter, etc.).", a: "viewer" },
        { t: "!tiktok", c: "Infos", d: "Lien direct vers le compte TikTok de Masthom.", a: "viewer" },
        { t: "!youtube", c: "Infos", d: "Lien direct vers la chaîne YouTube (Replays et vidéos).", a: "viewer" },
        { t: "!team", c: "Infos", d: "Affiche les membres de la team de stream actuelle.", a: "viewer" },
        { t: "!infogame (!game)", c: "Infos", d: "Affiche les détails du jeu actuellement diffusé.", a: "viewer" },
        { t: "!giveaway (!roue)", c: "Infos", d: "Détails sur le concours ou le tirage au sort en cours.", a: "viewer" },
        { t: "!onlyfan (!of)", c: "Infos", d: "Pour les plus curieux... Lien vers le 'OnlyFans'.", a: "viewer" },
        { t: "!bug", c: "Infos", d: "Signale un problème technique pour que Masthom puisse le réparer.", a: "viewer" },
        { t: "!clip", c: "Infos", d: "Crée un clip des 30 dernières secondes du live.", a: "viewer" },
        { t: "!top3", c: "Infos", d: "Affiche le podium des viewers les plus actifs.", a: "viewer" },

        // --- MODÉRATION ---
        { t: "!so (!shoutout)", c: "Modération", d: "Donne de la force à un streamer avec affichage de clip sur OBS.", a: "mod" },
        { t: "!ban {pseudo}", c: "Modération", d: "Bannit définitivement un utilisateur du chat.", a: "mod" },
        { t: "!clear", c: "Modération", d: "Efface tout l'historique du chat actuel.", a: "mod" },
        { t: "!permit / !unpermit", c: "Modération", d: "Autorise ou interdit l'envoi de liens pour un viewer.", a: "mod" },
        { t: "!taistoi", c: "Modération", d: "Fait taire un utilisateur bruyant instantanément.", a: "mod" },
        { t: "!to1s / !toMax", c: "Modération", d: "Time-out rapide ou maximum pour calmer les esprits.", a: "mod" },
        { t: "!setgame (!sg)", c: "Modération", d: "Change la catégorie du stream via le bot.", a: "mod" },
        { t: "!settitle (!st)", c: "Modération", d: "Modifie le titre du live en temps réel.", a: "mod" },
        { t: "!oral", c: "Modération", d: "Active le mode lecture vocale du chat.", a: "mod" },

        // --- CHAT MODE ---
        { t: "!emoteon / !emotoff", c: "Chat Mode", d: "Active ou désactive le mode 'Emotes uniquement'.", a: "mod" },
        { t: "!followon / !folloff", c: "Chat Mode", d: "Active ou désactive le mode 'Followers uniquement'.", a: "mod" },
        { t: "!subon", c: "Chat Mode", d: "Active le mode 'Abonnés uniquement'.", a: "mod" },
        { t: "!shieldOn / !shieldOff", c: "Chat Mode", d: "Active ou désactive le bouclier de protection Twitch.", a: "mod" },

        // --- TRADUCTION ---
        { t: "!fr / !fra", c: "Traduction", d: "Traduit ton message en Français.", a: "viewer" },
        { t: "!eng / !en / !ang", c: "Traduction", d: "Traduit ton message en Anglais.", a: "viewer" },
        { t: "!esp / !es", c: "Traduction", d: "Traduit ton message en Espagnol.", a: "viewer" },
        { t: "!ger / !all", c: "Traduction", d: "Traduit ton message en Allemand.", a: "viewer" },
        { t: "!it / !ita", c: "Traduction", d: "Traduit ton message en Italien.", a: "viewer" },
        { t: "!ja / !jap", c: "Traduction", d: "Traduit ton message en Japonais.", a: "viewer" },
        { t: "!ar / !ara", c: "Traduction", d: "Traduit ton message en Arabe.", a: "viewer" },
        { t: "!ch / !chi", c: "Traduction", d: "Traduit ton message en Chinois.", a: "viewer" },

        // --- MINI-JEUX ---
        { t: "!bombstart", c: "Mini-Jeux", d: "Lance une partie du jeu de la bombe dans le chat.", a: "mod" },
        { t: "!pass {pseudo}", c: "Mini-Jeux", d: "Passe la bombe à un autre viewer avant qu'elle n'explose.", a: "viewer" },
        { t: "!stopbombe", c: "Mini-Jeux", d: "Arrête immédiatement le jeu de la bombe.", a: "mod" },
        { t: "!mot {devinette}", c: "Mini-Jeux", d: "Tente de deviner le mot secret pour gagner de l'EXP.", a: "viewer" },

        // --- SONS & FUN ---
        { t: "!felix", c: "Sons & Fun", d: "Invoque Félix pour une réponse IA ou un son aléatoire.", a: "viewer" },
        { t: "!roast {1-10}", c: "Sons & Fun", d: "Règle l'agressivité de Félix (1: Gentil, 10: Sauvage).", a: "viewer" },
        { t: "!lurk", c: "Sons & Fun", d: "Passe en mode fantôme (tu gagnes quand même de l'EXP).", a: "viewer" },
        { t: "!first / !deuz / !troiz", c: "Sons & Fun", d: "Revendique ta place sur le podium du début de live.", a: "viewer" },
        { t: "!dance / !hype", c: "Sons & Fun", d: "Lance une pluie d'emotes animées sur l'écran.", a: "viewer" },
        { t: "!love {pseudo}", c: "Sons & Fun", d: "Calcule l'amour entre deux personnes.", a: "viewer" },
        { t: "!raid", c: "Sons & Fun", d: "Affiche le message de raid à copier-coller.", a: "viewer" },
        { t: "!salope / !tg / !dodo", c: "Sons & Fun", d: "Déclenche un son spécifique sur le stream.", a: "viewer" },
        { t: "!faim / !seul / !purge", c: "Sons & Fun", d: "Déclenche un son spécifique sur le stream.", a: "viewer" },
        { t: "!anniversaire / !ohe", c: "Sons & Fun", d: "Sons de célébration.", a: "viewer" },

        // --- ADMIN ---
        { t: "!renotif", c: "Admin", d: "Relance l'annonce de live sur Discord.", a: "admin" },
        { t: "!replay", c: "Admin", d: "Relance le dernier clip ou un clip spécifique via URL/ID.", a: "admin" },
        { t: "!checkcopains", c: "Admin", d: "Vérifie si les streamers partenaires sont en ligne.", a: "admin" },
        { t: "!settimer / !stoptimer", c: "Admin", d: "Gère le compte à rebours visible à l'écran.", a: "admin" }
    ];

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
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:5rem; color:var(--text-dim); font-style:italic;">Félix n'a rien trouvé pour cette recherche...</td></tr>`;
        }
    }

    searchInput.addEventListener("input", render);
    catFilter.addEventListener("change", render);
    
    // Tri par catégorie puis par nom
    allCommands.sort((a, b) => a.c.localeCompare(b.c) || a.t.localeCompare(b.t));
    
    render();
});