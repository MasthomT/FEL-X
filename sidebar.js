/**
 * SIDEBAR.JS - Système de Navigation et Décor Matrix FEL-X
 */

document.addEventListener("DOMContentLoaded", () => {
    injectSidebar();
    injectWatermark();
    setInterval(updateLiveCountdown, 1000);
    updateLiveCountdown();
});

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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span class="nav-text">Mon Profil</span>
            </a>
            <a href="felix.html" class="nav-link ${currentPage === 'felix.html' ? 'active' : ''}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span class="nav-text">Félix et moi</span>
            </a>
            <a href="stats.html" class="nav-link ${currentPage === 'stats.html' ? 'active' : ''}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                <span class="nav-text">Statistiques</span>
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
                <span class="nav-text">FAQ Secrets</span>
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

    // Liaison du bouton logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            if (typeof logout === 'function') {
                logout();
            } else {
                localStorage.removeItem("twitch_token");
                window.location.href = "index.html";
            }
        };
    }
}

function injectWatermark() {
    if (!document.getElementById('bg-watermark-container')) {
        let rowsHTML = "";
        const styles = ['s-fast', 's-rev-slow', 's-slow', 's-rev-fast'];
        for(let i=1; i<=18; i++) {
            const animClass = styles[i % 4];
            rowsHTML += `<div class="watermark-row ${animClass}" id="row-${i}"></div>`;
        }
        const watermarkHTML = `<div id="bg-watermark-container">${rowsHTML}</div>`;
        document.body.insertAdjacentHTML('afterbegin', watermarkHTML);
    }
}

function updateLiveCountdown() {
    const schedules = [
        { d: 2, h: 18 }, { d: 3, h: 18 }, { d: 5, h: 18 }, { d: 6, h: 18 }, { d: 0, h: 10 }
    ];
    const now = new Date();
    let minDiff = Infinity;
    schedules.forEach(s => {
        let t = new Date(); t.setHours(s.h, 0, 0, 0);
        let diff = (s.d - now.getDay() + 7) % 7;
        if (diff === 0 && now > t) diff = 7;
        t.setDate(now.getDate() + diff);
        let delta = t - now;
        if (delta < minDiff) minDiff = delta;
    });

    let isLiveNow = false;
    schedules.forEach(s => {
        let start = new Date(); start.setHours(s.h, 0, 0, 0);
        let end = new Date(start.getTime() + (4 * 3600000));
        if (now >= start && now <= end && s.d === now.getDay()) isLiveNow = true;
    });

    const binary = () => Math.random().toString(2).substring(2, 12);
    const hex = () => "0x" + Math.floor(Math.random()*16777215).toString(16).toUpperCase();
    const system = ["FELIX_V2", "SYSTEM_READY", "CORE_LOADED", "ROAST_ENGINE_ON", "LURKER_DETECTED", "FETCH_DATA", "MASTHOM_LIVE"];

    const days = Math.floor(minDiff / 86400000);
    const hours = Math.floor((minDiff % 86400000) / 3600000);
    const mins = Math.floor((minDiff % 3600000) / 60000);
    const secs = Math.floor((minDiff % 60000) / 1000);
    const countdownStr = isLiveNow ? "LIVE_NOW_ONLINE_🐾_" : `NEXT_LIVE_${days}D_${hours}H_${mins}M_${secs}S_`;

    for (let i = 1; i <= 18; i++) {
        const el = document.getElementById(`row-${i}`);
        if (!el) continue;
        let content = "";
        if (i % 3 === 0) content = (countdownStr + " — ").repeat(10);
        else if (i % 2 === 0) content = (binary() + " " + system[Math.floor(Math.random()*system.length)] + " " + hex() + " ").repeat(15);
        else content = (hex() + " " + binary() + " " + binary() + " ").repeat(20);
        el.innerText = content;
        if (isLiveNow) el.classList.add('live-active');
        else el.classList.remove('live-active');
    }
}