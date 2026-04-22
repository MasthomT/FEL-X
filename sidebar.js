document.addEventListener("DOMContentLoaded", () => {
    // 1. Injection des Styles "Épurés" (Minimalistes, Glassmorphism, Icônes)
    const styles = `
        <style>
            #felx-sidebar {
                position: fixed; top: 0; left: 0; width: 240px; height: 100vh;
                background: rgba(15, 23, 42, 0.7);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-right: 1px solid rgba(255, 255, 255, 0.05);
                padding: 2rem 1.25rem;
                display: flex; flex-direction: column;
                z-index: 1000; font-family: 'Inter', sans-serif;
            }
            #felx-sidebar .logo {
                display: flex; align-items: center; gap: 15px;
                color: #fff; font-size: 1.15rem; font-weight: 800; text-decoration: none;
                letter-spacing: 1px; margin-bottom: 2.5rem; padding-left: 0.5rem;
            }
            #felx-sidebar .logo img { 
                width: 32px; height: 32px; border-radius: 50%; 
                box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); 
            }
            #felx-sidebar .nav-links { 
                display: flex; flex-direction: column; gap: 0.4rem; flex-grow: 1; 
            }
            #felx-sidebar .nav-link {
                display: flex; align-items: center; gap: 14px;
                padding: 0.8rem 1rem; border-radius: 12px;
                color: #94a3b8; text-decoration: none; font-size: 0.9rem; font-weight: 500;
                transition: all 0.2s ease;
            }
            #felx-sidebar .nav-link svg { 
                stroke: currentColor; opacity: 0.7; transition: 0.2s; width: 18px; height: 18px; 
            }
            #felx-sidebar .nav-link:hover { 
                color: #f8fafc; background: rgba(255, 255, 255, 0.05); 
            }
            #felx-sidebar .nav-link:hover svg { opacity: 1; }
            #felx-sidebar .nav-link.active { 
                color: #fff; 
                background: linear-gradient(90deg, rgba(139, 92, 246, 0.15), transparent); 
                border-left: 3px solid #8b5cf6; 
                padding-left: calc(1rem - 3px); 
                font-weight: 600; 
            }
            #felx-sidebar .nav-link.active svg { opacity: 1; stroke: #8b5cf6; }
            #felx-sidebar .logout { margin-top: auto; color: #f43f5e; }
            #felx-sidebar .logout:hover { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }
            
            /* Optimisation Mobile ultra-propre */
            @media (max-width: 800px) {
                #felx-sidebar {
                    width: 100%; height: 75px; top: auto; bottom: 0;
                    flex-direction: row; justify-content: space-around; padding: 0.5rem;
                    border-right: none; border-top: 1px solid rgba(255,255,255,0.05);
                }
                #felx-sidebar .logo, #felx-sidebar .nav-text, #felx-sidebar .logout { display: none; }
                #felx-sidebar .nav-links { flex-direction: row; width: 100%; justify-content: space-around; gap: 0; }
                #felx-sidebar .nav-link { flex-direction: column; gap: 5px; padding: 0.5rem; border-radius: 8px; align-items: center; justify-content: center; }
                #felx-sidebar .nav-link.active { background: transparent; border-left: none; border-top: 3px solid #8b5cf6; padding-left: 0.5rem; padding-top: calc(0.5rem - 3px); }
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);

    // 2. Icônes SVG Minimalistes (Lucide)
        const icons = {
        profile: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        infos: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
        leaderboard: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
        stats: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
        brain: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
        commands: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
        clips: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`,
        logout: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
    };

    // 3. Définition du menu HTML épuré
    const sidebarHTML = `
    <nav id="felx-sidebar">
        <a href="profile.html" class="logo"><img src="logo-felix.png" onerror="this.style.display='none'"> FEL-X</a>
        <div class="nav-links">
            <a href="profile.html" class="nav-link ${location.pathname.includes('profile') ? 'active' : ''}">
                ${icons.profile} <span class="nav-text">Profil</span>
            </a>
            <a href="infos.html" class="nav-link ${location.pathname.includes('infos') ? 'active' : ''}">
                ${icons.infos} <span class="nav-text">Infos</span>
            </a>
            <a href="leaderboard.html" class="nav-link ${location.pathname.includes('leaderboard') ? 'active' : ''}">
                ${icons.leaderboard} <span class="nav-text">Classement</span>
            </a>
            <a href="stats.html" class="nav-link ${location.pathname.includes('stats') ? 'active' : ''}">
                ${icons.stats} <span class="nav-text">Statistiques</span>
            </a>
            <a href="felix.html" class="nav-link ${location.pathname.includes('felix') ? 'active' : ''}">
                ${icons.brain} <span class="nav-text">Félix et moi</span>
            </a>
            <a href="commands.html" class="nav-link ${location.pathname.includes('commands') ? 'active' : ''}">
                ${icons.commands} <span class="nav-text">Commandes</span>
            </a>
            <a href="clips.html" class="nav-link ${location.pathname.includes('clips') ? 'active' : ''}">
                ${icons.clips} <span class="nav-text">Clips</span>
            </a>
        </div>
        <a href="#" id="logout-btn-sidebar" class="nav-link logout">
            ${icons.logout} <span class="nav-text">Déconnexion</span>
        </a>
    </nav>
    `;
    
    // 4. Injection du menu
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    
    // 5. Reconnexion de la déconnexion
    const logoutBtn = document.getElementById("logout-btn-sidebar");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if(typeof logout === 'function') logout();
        });
    }
});