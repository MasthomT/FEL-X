if(document.getElementById("logout-sidebar")) {
    document.getElementById("logout-sidebar").onclick = function() {
        localStorage.removeItem("twitch_token");
        window.location.replace("/index.html");
    };
}

const firebaseConfig = {
    apiKey: "AIzaSyAK0b_n1yTPKGKIZ4TuUmpBNPb3aoVvCI8",
    authDomain: "fel-x-503f8.firebaseapp.com",
    databaseURL: "https://fel-x-503f8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fel-x-503f8",
    storageBucket: "fel-x-503f8.firebasestorage.app",
    messagingSenderId: "922613900734",
    appId: "1:922613900734:web:4d192151bebd5e7ac885ef"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const CLIENT_ID = "8jpfq5497uee7kdrsx4djhb7nw2xec";
const BROADCASTER_ID = "439356462"; 
const FOLLOWERS_GOAL = 1500;

function calculateLevel(xp) {
    if (xp < 0) return 1;
    const level = Math.floor(Math.pow(Math.max(0, xp + 1e-9) / 100, 1 / 2.2)) + 1;
    return Math.max(1, level);
}

const loadingEl = document.getElementById("loading");
const statsContentEl = document.getElementById("stats-content");

async function getTwitchUserInfo(logins, token) {
    if (logins.length === 0) return {};
    
    const loginQuery = logins.map(l => `login=${encodeURIComponent(l)}`).join('&');
    
    const twitchHeaders = new Headers({
        'Authorization': `Bearer ${token}`,
        'Client-Id': CLIENT_ID
    });
    
    try {
        const response = await fetch(`https://api.twitch.tv/helix/users?${loginQuery}`, { headers: twitchHeaders });
        if (!response.ok) {
             console.error(`[TWITCH ERROR] Erreur API users: Statut ${response.status}`);
             return {};
        }
        
        const data = await response.json();
        return data.data.reduce((acc, user) => {
            acc[user.login] = {
                display_name: user.display_name,
                avatar: user.profile_image_url
            };
            return acc;
        }, {});
    } catch (error) {
        console.error("[TWITCH ERROR] Erreur lors de la récupération des infos Twitch:", error);
        return {};
    }
}

async function getTwitchStats(token) {
    const twitchHeaders = new Headers({
        'Authorization': `Bearer ${token}`,
        'Client-Id': CLIENT_ID
    });
    
    const stats = { followers: 0, isLive: false, totalClips: 0 };

    try {
        const followersResponse = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${BROADCASTER_ID}`, { headers: twitchHeaders });
        if (followersResponse.ok) {
            const data = await followersResponse.json();
            stats.followers = data.total;
        } 
    } catch (e) {
        console.warn("[TWITCH WARN] Impossible de récupérer les followers.");
    }
    
    try {
        const streamResponse = await fetch(`https://api.twitch.tv/helix/streams?user_id=${BROADCASTER_ID}`, { headers: twitchHeaders });
        if (streamResponse.ok) {
            const data = await streamResponse.json();
            stats.isLive = data.data.length > 0;
        }
    } catch (e) {
        console.warn("[TWITCH WARN] Impossible de vérifier le statut du stream.");
    }
    
try {
        const cachedClips = localStorage.getItem("twitch_clip_count");
        if (cachedClips !== null) {
            stats.totalClips = parseInt(cachedClips, 10) || 0; 
        }
    } catch (e) {
        console.warn("[STATS] Impossible de lire le cache des clips.", e);
        stats.totalClips = 0;
    }

    return stats;
}


(async function loadStats() {
    const token = localStorage.getItem("twitch_token");
    if (!token) {
        window.location.replace("/index.html");
        return;
    }

    try {
        
        const twitchStats = await getTwitchStats(token);
        
        const currentFollowers = twitchStats.followers;
        const goalPercent = Math.min(100, (currentFollowers / FOLLOWERS_GOAL) * 100);
        
        document.getElementById("stat-followers-current").textContent = currentFollowers.toLocaleString('fr-FR');
        document.getElementById("stat-followers-goal-label").textContent = `Objectif : ${currentFollowers.toLocaleString('fr-FR')} / ${FOLLOWERS_GOAL.toLocaleString('fr-FR')}`;
        document.getElementById("stat-followers-progress").style.width = `${goalPercent}%`;
        
        const statusEl = document.getElementById("stat-stream-status");
        if (twitchStats.isLive) {
            statusEl.textContent = "EN LIGNE";
            statusEl.style.color = "var(--color-accent)";
        } else {
            statusEl.textContent = "HORS LIGNE";
            statusEl.style.color = "var(--color-danger)";
        }
        
        const clipsDisplayValue = twitchStats.totalClips > 0 ? twitchStats.totalClips.toLocaleString('fr-FR') : 'N/A';
        document.getElementById("stat-total-clips").textContent = clipsDisplayValue;


        const xpRef = db.ref('viewer_data/xp');
        const xpSnapshot = await xpRef.get();
        let totalXP = 0;
        let viewerCount = 0;
        let maxLevel = 1;
        let totalLevels = 0;

        if (xpSnapshot.exists()) {
            const xpData = xpSnapshot.val();
            viewerCount = Object.keys(xpData).length;
            
            Object.entries(xpData).forEach(([login, user]) => {
                const xp = user.xp || 0;
                const level = calculateLevel(xp);

                totalXP += xp;
                totalLevels += level;
                maxLevel = Math.max(maxLevel, level);
            });
        }
        
        const avgLevel = viewerCount > 0 ? (totalLevels / viewerCount).toFixed(1) : 1;
        const avgXP = viewerCount > 0 ? (totalXP / viewerCount).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) : 0;
        
        document.getElementById("stat-viewer-count").textContent = viewerCount.toLocaleString('fr-FR');
        document.getElementById("stat-total-xp").textContent = totalXP.toLocaleString('fr-FR');
        document.getElementById("stat-max-level").textContent = maxLevel;

        document.getElementById("stat-avg-level").textContent = avgLevel;
        document.getElementById("stat-avg-xp").textContent = avgXP;
        document.getElementById("stat-total-clips-aggregated").textContent = clipsDisplayValue;

        
        loadingEl.style.display = "none";
        statsContentEl.style.display = "block";

    } catch (error) {
        console.error("Erreur critique lors du chargement des statistiques:", error);
        loadingEl.textContent = "Une erreur est survenue lors du chargement des statistiques.";
        if (error.message.includes("401") || error.message.includes("Token") || error.message.includes("session_expired")) {
            localStorage.removeItem("twitch_token");
            loadingEl.textContent = "Session expirée. Veuillez vous reconnecter.";
            setTimeout(() => window.location.replace("/index.html?error=session_expired"), 2000);
        }
    }
})();