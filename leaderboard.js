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

function calculateLevel(xp) {
    if (xp < 0) return 1;
    const level = Math.floor(Math.pow(Math.max(0, xp + 1e-9) / 100, 1 / 2.2)) + 1;
    return Math.max(1, level);
}

(async function loadLeaderboard() {
    const token = localStorage.getItem("twitch_token");
    if (!token) {
        window.location.replace("/index.html");
        return;
    }

    const CLIENT_ID = "8jpfq5497uee7kdrsx4djhb7nw2xec";
    const twitchHeaders = new Headers({
        'Authorization': `Bearer ${token}`,
        'Client-Id': CLIENT_ID
    });
    
    const loadingEl = document.getElementById("loading");
    const listEl = document.getElementById("leaderboard-list");

    try {
        const xpRef = db.ref('viewer_data/xp');
        const xpSnapshot = await xpRef.get();

        if (!xpSnapshot.exists()) {
            throw new Error("Aucune donnée d'XP trouvée dans Firebase.");
        }
        
        const xpData = xpSnapshot.val();

        const sortedUsers = Object.entries(xpData)
            .map(([login, data]) => ({
                login: login,
                xp: data.xp
            }))
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 50); 

        const loginQuery = sortedUsers.map(u => `login=${encodeURIComponent(u.login)}`).join('&');
        
        const twitchResponse = await fetch(`https://api.twitch.tv/helix/users?${loginQuery}`, { headers: twitchHeaders });
        if (!twitchResponse.ok) {
            throw new Error("Impossible de récupérer les profils Twitch.");
        }
        
        const twitchData = await twitchResponse.json();
        const twitchUsers = twitchData.data.reduce((acc, user) => {
            acc[user.login] = {
                display_name: user.display_name,
                avatar: user.profile_image_url
            };
            return acc;
        }, {});

        listEl.innerHTML = "";
        
        sortedUsers.forEach((user, index) => {
            const rank = index + 1;
            const twitchInfo = twitchUsers[user.login];
            
            if (!twitchInfo) return; 
            
            const level = calculateLevel(user.xp);

            const item = document.createElement("li");
            item.className = "leaderboard-item";
            item.innerHTML = `
                <span class="rank">#${rank}</span>
                <img src="${twitchInfo.avatar}" alt="" class="avatar">
                <div class="user-info">
                    <span class="name">${twitchInfo.display_name}</span>
                    <span class="level">Niveau ${level}</span>
                </div>
                <div class="xp-info">
                    ${user.xp.toLocaleString('fr-FR')} <span>XP</span>
                </div>
            `;
            listEl.appendChild(item);
        });

        loadingEl.style.display = "none";
        listEl.style.display = "flex";

    } catch (error) {
        console.error("Erreur lors du chargement du classement:", error);
        loadingEl.textContent = "Une erreur est survenue lors du chargement du classement.";
        if (error.message.includes("Token")) {
            localStorage.removeItem("twitch_token");
            window.location.replace("/index.html?error=session_expired");
        }
    }
})();