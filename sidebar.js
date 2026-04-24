@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@800&display=swap');

:root {
    --bg: #0b0f1a;
    --surface: rgba(30, 41, 59, 0.4);
    --surface-bright: rgba(51, 65, 85, 0.5);
    --border: rgba(255, 255, 255, 0.06);
    --text-main: #f8fafc;
    --text-dim: #94a3b8;
    --accent: #00f5c3;
    --accent-glow: rgba(0, 245, 195, 0.2);
    --danger: #f43f5e;
    --sidebar-width: 260px;
}

/* --- RESET & LAYOUT --- */
* { margin: 0; padding: 0; box-sizing: border-box; }

body { 
    background-color: var(--bg); 
    color: var(--text-main); 
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
}

main { 
    margin-left: var(--sidebar-width); 
    padding: 3rem 4rem; 
    min-height: 100vh;
    transition: all 0.3s ease;
    position: relative;
    z-index: 10; 
}

/* --- 🌊 LE DÉCOR MATRIX (FLUX DE DONNÉES) --- */
#bg-watermark-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    background-color: var(--bg);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
}

.watermark-row {
    white-space: nowrap;
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.8vh;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: rgba(255, 255, 255, 0.006);
    user-select: none;
    display: flex;
    gap: 3rem;
    line-height: 1;
}

@keyframes scrollLeft {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
}

@keyframes scrollRight {
    from { transform: translateX(-50%); }
    to { transform: translateX(0); }
}

.s-fast { animation: scrollLeft 45s linear infinite; }
.s-slow { animation: scrollLeft 110s linear infinite; }
.s-rev-fast { animation: scrollRight 55s linear infinite; }
.s-rev-slow { animation: scrollRight 130s linear infinite; }

.watermark-row.live-active {
    color: rgba(0, 245, 195, 0.012);
    text-shadow: 0 0 10px rgba(0, 245, 195, 0.05);
}

/* --- SIDEBAR --- */
.sidebar {
    position: fixed; top: 0; left: 0; width: var(--sidebar-width); height: 100vh;
    background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-right: 1px solid var(--border); padding: 2.5rem 1.5rem; display: flex; flex-direction: column; z-index: 2000;
}

.sidebar .logo {
    display: flex; align-items: center; gap: 12px; color: #fff; font-size: 1.4rem; font-weight: 800; 
    text-decoration: none; margin-bottom: 3.5rem; padding-left: 0.5rem; letter-spacing: -1px;
}

.sidebar .logo img { 
    width: 38px; height: 38px; border-radius: 12px; border: 2px solid var(--accent);
    box-shadow: 0 0 15px var(--accent-glow);
}

.nav-link {
    display: flex; align-items: center; gap: 14px; padding: 0.9rem 1.1rem; border-radius: 16px;
    color: var(--text-dim); text-decoration: none; font-size: 0.95rem; font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 6px;
    border: 1px solid transparent;
}

.nav-link svg { width: 20px; height: 20px; stroke-width: 2; opacity: 0.6; }

.nav-link:hover { 
    color: #fff; 
    background: rgba(255, 255, 255, 0.05); 
    border-color: rgba(255, 255, 255, 0.05);
}

/* ✨ L'EFFET SHINY RECTIFIÉ ✨ */
.nav-link.active { 
    color: #fff; 
    background: linear-gradient(90deg, rgba(0, 245, 195, 0.12) 0%, rgba(0, 245, 195, 0.04) 100%);
    font-weight: 800;
    border: 1px solid rgba(0, 245, 195, 0.3);
    box-shadow: 
        0 0 20px rgba(0, 245, 195, 0.1),
        inset 0 0 12px rgba(0, 245, 195, 0.1);
    transform: translateX(4px); /* Petit décalage vers la droite */
}

.nav-link.active svg { 
    opacity: 1; 
    stroke: var(--accent); 
    filter: drop-shadow(0 0 5px var(--accent));
}

.nav-link.logout { margin-top: auto; color: var(--danger); }
.nav-link.logout:hover { background: rgba(244, 63, 94, 0.1); border-color: rgba(244, 63, 94, 0.2); }

/* --- COMPOSANTS (CARDS) --- */
.card {
    background: var(--surface); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--border); border-radius: 24px; padding: 2rem; margin-bottom: 2rem;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
}

.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }

h1 { font-size: 2.4rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 0.5rem; }
.page-desc { color: var(--text-dim); margin-bottom: 3rem; font-size: 1.1rem; }

/* --- STATS BOXES --- */
.stat-box { background: rgba(255, 255, 255, 0.03); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border); }
.stat-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-dim); letter-spacing: 0.1em; margin-bottom: 8px; }
.stat-value { font-size: 1.8rem; font-weight: 900; color: #fff; }

/* --- TABLES --- */
table { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
th { padding: 1rem; text-align: left; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-dim); }
td { padding: 1.25rem 1rem; background: rgba(255,255,255,0.02); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
td:first-child { border-left: 1px solid var(--border); border-radius: 18px 0 0 18px; }
td:last-child { border-right: 1px solid var(--border); border-radius: 0 18px 18px 0; }

/* --- MOBILE OPTIMIZATION --- */
@media (max-width: 900px) {
    main { margin-left: 0; padding: 1.5rem 1rem 100px 1rem; }
    
    .sidebar {
        width: 100%; height: 75px; top: auto; bottom: 0; flex-direction: row; padding: 0.5rem;
        border-right: none; border-top: 1px solid var(--border);
    }
    
    .sidebar .logo, .sidebar .nav-text, .sidebar .logout { display: none; }
    .sidebar .nav-links { display: flex !important; flex-direction: row !important; width: 100%; justify-content: space-around; }
    
    .nav-link { flex-direction: column; gap: 5px; font-size: 0.65rem; padding: 0.5rem; border-radius: 12px; margin-bottom: 0; }
    .nav-link svg { width: 22px; height: 22px; }
    .nav-link.active { 
        background: transparent; 
        border: none; 
        box-shadow: none; 
        border-top: 3px solid var(--accent); 
        border-radius: 0; 
        transform: translateY(-4px); 
    }

    .watermark-row { font-size: 1.2vh; }
}