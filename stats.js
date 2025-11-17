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
        if (!response.ok) throw new Error("Impossible de récupérer les profils Twitch.");
        
        const data = await response.json();
        return data.data.reduce((acc, user) => {
            acc[user.login] = {
                display_name: user.display_name,
                avatar: user.profile_image_url
            };
            return acc;
        }, {});
    } catch (error) {
        console.error("Erreur lors de la récupération des infos Twitch:", error);
        return {};
    }
}

(async function loadStats() {
    const token = localStorage.getItem("twitch_token");
    if (!token) {
        window.location.replace("/index.html");
        return;
    }

    try {
        const xpRef = db.ref('viewer_data/xp');
        const xpSnapshot = await xpRef.get();
        let totalXP = 0;
        let viewerCount = 0;
        let maxLevel = 1;

        if (xpSnapshot.exists()) {
            const xpData = xpSnapshot.val();
            viewerCount = Object.keys(xpData).length;
            
            Object.values(xpData).forEach(user => {
                const xp = user.xp || 0;
                totalXP += xp;
                maxLevel = Math.max(maxLevel, calculateLevel(xp));
            });
        }

        document.getElementById("stat-viewer-count").textContent = viewerCount.toLocaleString('fr-FR');
        document.getElementById("stat-total-xp").textContent = totalXP.toLocaleString('fr-FR');
        document.getElementById("stat-max-level").textContent = maxLevel;

        
        const clipHeaders = new Headers({
            'Authorization': `Bearer ${token}`,
            'Client-Id': CLIENT_ID
        });

        const clipsResponse = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${BROADCASTER_ID}&first=100`, { headers: clipHeaders });
        if (!clipsResponse.ok) throw new Error("Impossible de récupérer les clips.");
        
        const clipsData = await clipsResponse.json();
        const clips = clipsData.data;

        document.getElementById("stat-total-clips").textContent = clips.length.toLocaleString('fr-FR');

        const creatorCounts = {};
        const creatorLogins = new Set();
        clips.forEach(clip => {
            const login = clip.creator_name.toLowerCase();
            creatorCounts[login] = (creatorCounts[login] || 0) + 1;
            creatorLogins.add(login);
        });

        const topCreators = Object.entries(creatorCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 5);
        
        const topCreatorLogins = topCreators.map(([login]) => login);
        const twitchUsersInfo = await getTwitchUserInfo(topCreatorLogins, token);
        
        const topClipCreatorsEl = document.getElementById("top-clip-creators");
        topClipCreatorsEl.innerHTML = "";
        
        if (topCreators.length > 0) {
            topCreators.forEach(([login, count]) => {
                const info = twitchUsersInfo[login] || { display_name: login, avatar: '/logo-felix.png' }; 
                
                const item = document.createElement("li");
                item.className = "top-users-item";
                item.innerHTML = `
                    <img src="${info.avatar}" alt="${info.display_name}" class="avatar">
                    <span class="name">${info.display_name}</span>
                    <span class="count">${count} clips</span>
                `;
                topClipCreatorsEl.appendChild(item);
            });
        } else {
            document.getElementById("no-clip-data").style.display = 'block';
        }
        
        loadingEl.style.display = "none";
        statsContentEl.style.display = "block";

    } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
        loadingEl.textContent = "Une erreur est survenue lors du chargement des statistiques.";
        if (error.message.includes("Token")) {
            localStorage.removeItem("twitch_token");
            window.location.replace("/index.html?error=session_expired");
        }
    }
})();