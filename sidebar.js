/**
 * SIDEBAR.JS - Système de Navigation et Décor Dynamique FEL-X
 * Ce script gère l'injection du menu et l'animation du fond d'écran.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Mise en place de la structure
    injectSidebar();
    injectWatermark();

    // 2. Lancement du moteur de mise à jour (chaque seconde)
    setInterval(updateLiveCountdown, 1000);
    updateLiveCountdown();
});

/**
 * Génère et injecte la barre de navigation latérale.
 */
function injectSidebar() {
    // On détecte la page actuelle pour mettre le lien en surbrillance
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const sidebarHTML = `
    <div class="sidebar">
        <a href="index.html" class="logo">
            <img src="logo-felix.png" alt="FEL-X">
            <span>FEL-X</span>
        </a>

        <div class="nav-links" style="display: flex; flex-direction: column; flex-grow: 1;">
            <a href="profile.html" class="nav-link ${currentPage === 'profile.html' ? 'active' : ''}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span class="nav-text">Mon Profil</span>
            </a>
            <a href="felix.html" class="nav-link ${currentPage === 'felix.html' ? 'active' : ''}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span class="nav-text">Félix et moi</span>
            </a>
            <a href="leaderboard.html" class="nav-link ${currentPage === 'leaderboard.html' ? 'active' : ''}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span class="nav-text">Classement</span>
            </a>
            <a href="commands.html" class="nav-link ${currentPage === 'commands.html' ? 'active' : ''}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                <span class="nav-text">Commandes</span>
            </a>
            <a href="clips.html" class="nav-link ${currentPage === 'clips.html' ? 'active' : ''}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line></svg>
                <span class="nav-text">Clips</span>
            </a>
            <a href="faq.html" class="nav-link ${currentPage === 'faq.html' ? 'active' : ''}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span class="nav-text">FAQ</span>
            </a>
            <a href="infos.html" class="nav-link ${currentPage === 'infos.html' ? 'active' : ''}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span class="nav-text">Infos</span>
            </a>
            
            <a href="#" id="logout-btn" class="nav-link logout" style="margin-top: auto;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline></svg>
                <span class="nav-text">Déconnexion</span>
            </a>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
}

/**
 * Injecte le conteneur de fond avec les lignes de texte animées.
 */
function injectWatermark() {
    if (!document.getElementById('bg-watermark-container')) {
        // On crée 5 lignes pour un effet de remplissage complet
        const watermarkHTML = `
            <div id="bg-watermark-container">
                <div class="watermark-row scroll-left" id="row-1"></div>
                <div class="watermark-row scroll-right" id="row-2"></div>
                <div class="watermark-row scroll-left" id="row-3"></div>
                <div class="watermark-row scroll-right" id="row-4"></div>
                <div class="watermark-row scroll-left" id="row-5"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', watermarkHTML);
    }
}

/**
 * Calcule le prochain live et anime le texte de fond.
 */
function updateLiveCountdown() {
    // --- TES HORAIRES ---
    const schedules = [
        { day: 2, hour: 18, min: 0 }, // Mardi
        { day: 3, hour: 18, min: 0 }, // Mercredi
        { day: 5, hour: 18, min: 0 }, // Vendredi
        { day: 6, hour: 18, min: 0 }, // Samedi
        { day: 0, hour: 10, min: 0 }  // Dimanche
    ];

    const now = new Date();
    let minDiff = Infinity;

    // Calcul du prochain live
    schedules.forEach(s => {
        let target = new Date();
        target.setHours(s.hour, s.min, 0, 0);
        let dayDiff = (s.day - now.getDay() + 7) % 7;
        if (dayDiff === 0 && now > target) dayDiff = 7;
        target.setDate(now.getDate() + dayDiff);
        let diff = target - now;
        if (diff < minDiff) minDiff = diff;
    });

    // Détection si live en cours (Fenêtre de 4 heures après le début)
    let isLiveNow = false;
    schedules.forEach(s => {
        let start = new Date();
        start.setHours(s.hour, s.min, 0, 0);
        let end = new Date(start.getTime() + (4 * 60 * 60 * 1000));
        if (now >= start && now <= end && s.day === now.getDay()) isLiveNow = true;
    });

    let displayStr = "";
    if (isLiveNow) {
        displayStr = "LIVE EN COURS 🐾 FEL-X SYSTEM ONLINE 🐾 ";
    } else {
        const days = Math.floor(minDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((minDiff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((minDiff / 1000 / 60) % 60);
        const secs = Math.floor((minDiff / 1000) % 60);
        
        let time = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        displayStr = `PROCHAIN LIVE ${days > 0 ? days + 'D ' : ''}${time} — RESTEZ CONNECTÉS — `;
    }

    // On répète le texte pour que le défilement soit infini et sans trou
    const finalContent = displayStr.repeat(15);

    // Mise à jour de chaque ligne de fond
    for (let i = 1; i <= 5; i++) {
        const el = document.getElementById(`row-${i}`);
        if (el) {
            el.innerText = finalContent;
            if (isLiveNow) el.classList.add('live-active');
            else el.classList.remove('live-active');
        }
    }
}