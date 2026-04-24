/**
 * SIDEBAR.JS - Système de Navigation et Fond Dynamique FEL-X
 * Ce fichier gère l'injection du menu latéral et le décompte du prochain live.
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. INJECTION DU MENU LATÉRAL ---
    injectSidebar();
    
    // --- 2. INJECTION DU FOND DYNAMIQUE (WATERMARK) ---
    injectWatermark();

    // --- 3. DÉMARRAGE DU COMPTEUR ---
    setInterval(updateLiveCountdown, 1000);
    updateLiveCountdown();
});

/**
 * Génère le HTML de la sidebar et l'insère dans le body.
 */
function injectSidebar() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const sidebarHTML = `
    <div class="sidebar">
        <a href="index.html" class="logo">
            <img src="logo-felix.png" alt="FEL-X">
            <span>FEL-X</span>
        </a>

        <div class="nav-links" style="display: flex; flex-direction: column; flex-grow: 1;">
            <a href="profile.html" class="nav-link ${currentPage === 'profile.html' ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span class="nav-text">Mon Profil</span>
            </a>
            <a href="felix.html" class="nav-link ${currentPage === 'felix.html' ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span class="nav-text">Félix et moi</span>
            </a>
            <a href="leaderboard.html" class="nav-link ${currentPage === 'leaderboard.html' ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span class="nav-text">Classement</span>
            </a>
            <a href="commands.html" class="nav-link ${currentPage === 'commands.html' ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                <span class="nav-text">Commandes</span>
            </a>
            <a href="clips.html" class="nav-link ${currentPage === 'clips.html' ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
                <span class="nav-text">Clips</span>
            </a>
            <a href="faq.html" class="nav-link ${currentPage === 'faq.html' ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span class="nav-text">FAQ Secrets</span>
            </a>
            <a href="infos.html" class="nav-link ${currentPage === 'infos.html' ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span class="nav-text">Infos</span>
            </a>
            
            <a href="#" id="logout-btn" class="nav-link logout" style="margin-top: auto;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                <span class="nav-text">Déconnexion</span>
            </a>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
}

/**
 * Injecte le conteneur du fond dynamique.
 */
function injectWatermark() {
    if (!document.getElementById('bg-watermark-container')) {
        const watermarkHTML = `
            <div id="bg-watermark-container">
                <div id="bg-countdown" class="watermark-text">SYNCHRONISATION...</div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', watermarkHTML);
    }
}

/**
 * Calcule le temps restant jusqu'au prochain live et met à jour le texte de fond.
 */
function updateLiveCountdown() {
    // Horaires officiels (0=Dimanche, 1=Lundi, 2=Mardi, 3=Mercredi, 4=Jeudi, 5=Vendredi, 6=Samedi)
    const schedules = [
        { day: 2, hour: 18, min: 0 }, // Mardi 18h
        { day: 3, hour: 18, min: 0 }, // Mercredi 18h
        { day: 5, hour: 18, min: 0 }, // Vendredi 18h
        { day: 6, hour: 18, min: 0 }, // Samedi 18h
        { day: 0, hour: 10, min: 0 }  // Dimanche 10h
    ];

    const now = new Date();
    let nextLive = null;
    let minDiff = Infinity;

    schedules.forEach(s => {
        let target = new Date();
        target.setHours(s.hour, s.min, 0, 0);
        
        let dayDiff = (s.day - now.getDay() + 7) % 7;
        
        // Si c'est aujourd'hui mais que l'heure est passée, on vise la semaine prochaine
        if (dayDiff === 0 && now > target) {
            dayDiff = 7;
        }
        
        target.setDate(now.getDate() + dayDiff);
        let diff = target - now;
        
        if (diff < minDiff) {
            minDiff = diff;
            nextLive = target;
        }
    });

    const el = document.getElementById('bg-countdown');
    if (!el) return;

    // Seuil "Live en cours" : si on est entre l'heure de début et 4h après
    // On vérifie si on est juste après un créneau de démarrage
    let isLiveNow = false;
    schedules.forEach(s => {
        let start = new Date();
        start.setHours(s.hour, s.min, 0, 0);
        let end = new Date(start.getTime() + (4 * 60 * 60 * 1000)); // Fin théorique +4h
        
        if (now >= start && now <= end && s.day === now.getDay()) {
            isLiveNow = true;
        }
    });

    if (isLiveNow) {
        el.innerText = "LIVE EN COURS 🐾";
        el.classList.add('live');
        return;
    }

    el.classList.remove('live');

    // Calcul des unités de temps
    const days = Math.floor(minDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((minDiff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((minDiff / 1000 / 60) % 60);
    const secs = Math.floor((minDiff / 1000) % 60);

    let timeStr = "";
    if (days > 0) timeStr += `${days}D `;
    timeStr += `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    el.innerText = `NEXT LIVE IN ${timeStr}`;
}   