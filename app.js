if(document.getElementById("logout-sidebar")) {
    document.getElementById("logout-sidebar").onclick = function() {
        localStorage.removeItem("twitch_token");
        window.location.replace("/index.html");
    };
}
if(document.getElementById("logout")) {
    document.getElementById("logout").onclick = function() {
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

function calculateXpForLevel(level) {
    if (level <= 1) return 0;
    const xp = Math.ceil(Math.pow(level - 1, 2.2) * 100);
    return xp;
}


if (document.getElementById("profile-content")) {
    (async function loadProfile() {
        const token = localStorage.getItem("twitch_token");
        if (!token) {
            window.location.replace("/index.html");
            return;
        }

        const CLIENT_ID = ""kgyfzs0k3wk8enx7p3pd6299ro4izv"";
        const BROADCASTER_ID = "439356462";
        
        const twitchHeaders = new Headers({
            'Authorization': `Bearer ${token}`,
            'Client-Id': CLIENT_ID
        });

        try {
            const twitchResponse = await fetch('https://api.twitch.tv/helix/users', { headers: twitchHeaders });
            if (!twitchResponse.ok) throw new Error("Token Twitch invalide ou expiré.");
            
            const twitchData = await twitchResponse.json();
            const user = twitchData.data[0];
            
            document.getElementById("display-name").textContent = user.display_name;
            document.getElementById("profile-pic").src = user.profile_image_url;


            fetchStreamStatus(twitchHeaders, BROADCASTER_ID);
            fetchFollowStatus(twitchHeaders, user.id, BROADCASTER_ID);
            fetchSubscriptionStatus(twitchHeaders, user.id, BROADCASTER_ID);
            loadUserClips(user.id, token, CLIENT_ID, BROADCASTER_ID);
            

            const userKey = user.login.toLowerCase(); 
            const xpRef = db.ref(`viewer_data/xp`);
            const historyRef = db.ref(`viewer_data/history/${userKey}`);

            const xpSnapshot = await xpRef.get();
            const historySnapshot = await historyRef.get();

            let currentXp = 0;
            let currentLevel = 1;

            if (xpSnapshot.exists()) {
                const allXpData = xpSnapshot.val();
                const userXpData = allXpData[userKey];

                if (userXpData) {
                    currentXp = userXpData.xp || 0;
                    currentLevel = calculateLevel(currentXp);
                    
                    document.getElementById("level").textContent = currentLevel;
                    document.getElementById("xp").textContent = currentXp.toLocaleString('fr-FR');
                    
                    if (userXpData.first_seen) {
                         const date = new Date(userXpData.first_seen);
                         document.getElementById("user-first-seen").textContent = "Membre depuis le " + 
                             date.toLocaleDateString('fr-FR', {
                                 year: 'numeric', month: 'long', day: 'numeric'
                             });
                    }
                } else {
                    document.getElementById("level").textContent = 1;
                    document.getElementById("xp").textContent = 0;
                }

                const sortedViewers = Object.entries(allXpData)
                    .map(([login, data]) => ({ login, xp: data.xp || 0 }))
                    .sort((a, b) => b.xp - a.xp);
                    
                const userRank = sortedViewers.findIndex(v => v.login === userKey) + 1;
                
                document.getElementById("rank").textContent = (userRank > 0) ? `#${userRank}` : "#N/A";

            } else {
                document.getElementById("level").textContent = 1;
                document.getElementById("xp").textContent = 0;
                document.getElementById("rank").textContent = "#N/A";
            }
            
            // NOUVEAU: Mettre à jour la barre de progression XP
            const xpStartOfCurrentLevel = calculateXpForLevel(currentLevel);
            const xpForNextLevel = calculateXpForLevel(currentLevel + 1);
            const totalXpNeededForThisLevel = xpForNextLevel - xpStartOfCurrentLevel;
            const xpEarnedThisLevel = currentXp - xpStartOfCurrentLevel;
            const progressPercent = Math.max(0, Math.min(100, (xpEarnedThisLevel / totalXpNeededForThisLevel) * 100));
            
            document.getElementById("xp-fill").style.width = `${progressPercent}%`;
            document.getElementById("xp-current-label").textContent = `${xpStartOfCurrentLevel.toLocaleString('fr-FR')} XP`;
            document.getElementById("xp-next-label").textContent = `Niv. ${currentLevel + 1}`;
            document.getElementById("xp-total-label").textContent = 
                `${currentXp.toLocaleString('fr-FR')} / ${xpForNextLevel.toLocaleString('fr-FR')} XP`;


            const historyList = document.getElementById("xp-history");
            historyList.innerHTML = "";
            
            if (historySnapshot.exists()) {
                const historyData = historySnapshot.val();
                const recentEntries = Object.values(historyData).reverse().slice(0, 20);
                
                recentEntries.forEach(entry => {
                    const li = document.createElement("li");
                    const date = new Date(entry.timestamp).toLocaleString('fr-FR');
                    const gain = entry.amount > 0;
                    li.className = gain ? "xp-gain" : "xp-loss";
                    li.textContent = `[${date}] ${entry.reason} (${gain ? '+' : ''}${entry.amount} XP)`;
                    historyList.appendChild(li);
                });
            } else {
                historyList.innerHTML = "<li>Aucun historique d'XP trouvé.</li>";
            }

            document.getElementById("loading").style.display = "none";
            document.getElementById("profile-content").style.display = "block";

        } catch (error) {
            console.error("Erreur critique lors du chargement du profil:", error);
            if (error.message.includes("Token")) {
                localStorage.removeItem("twitch_token");
                window.location.replace("/index.html?error=session_expired");
            } else {
                document.getElementById("loading").textContent = "Une erreur est survenue lors du chargement du profil.";
            }
        }
    })();
}

async function fetchStreamStatus(twitchHeaders, BROADCASTER_ID) {
    const banner = document.getElementById("stream-status-banner");
    const statusText = document.getElementById("stream-status-text");
    const detailsText = document.getElementById("stream-details");
    try {
        const streamResponse = await fetch(`https://api.twitch.tv/helix/streams?user_id=${BROADCASTER_ID}`, { headers: twitchHeaders });
        if (!streamResponse.ok) throw new Error("Impossible de charger le statut du stream.");
        
        const streamData = await streamResponse.json();
        
        if (streamData.data.length > 0) {
            const stream = streamData.data[0];
            banner.classList.add("live");
            statusText.textContent = "EN LIGNE";
            detailsText.innerHTML = `<strong>${stream.title}</strong><br>Joue à : ${stream.game_name} | ${stream.viewer_count} viewers`;
        } else {
            banner.classList.add("offline");
            statusText.textContent = "HORS LIGNE";
            detailsText.textContent = "La chaîne est actuellement hors ligne. Revenez plus tard !";
        }
    } catch (error) {
        console.error("Erreur statut stream:", error);
        statusText.textContent = "Statut du stream indisponible";
    }
    banner.style.display = "block";
}

async function fetchFollowStatus(twitchHeaders, userId, BROADCASTER_ID) {
    const followIndicator = document.getElementById("follow-indicator");
    const followStatusEl = document.getElementById("follow-status");
    
    try {
        const followResponse = await fetch(`https://api.twitch.tv/helix/channels/followed?user_id=${userId}&broadcaster_id=${BROADCASTER_ID}`, { headers: twitchHeaders });
        
        if (!followResponse.ok) throw new Error("Erreur API Follow");
        
        const followData = await followResponse.json();
        
        if (followData.total > 0 && followData.data.length > 0) {
            const followDate = new Date(followData.data[0].followed_at).toLocaleDateString('fr-FR');
            followStatusEl.textContent = `Vous suivez la chaîne depuis le ${followDate}`;
            followIndicator.style.backgroundColor = "var(--color-accent)";
        } else {
            followStatusEl.textContent = "Vous ne suivez pas la chaîne.";
            followIndicator.style.backgroundColor = "var(--color-danger)";
        }
    } catch (error) {
         console.error("Erreur API Follow:", error);
         followStatusEl.textContent = "Statut de follow indisponible";
         followIndicator.style.backgroundColor = "var(--color-text-secondary)";
    }
}

async function fetchSubscriptionStatus(twitchHeaders, userId, BROADCASTER_ID) {
    const subStatusEl = document.getElementById("sub-status");
    const subTierEl = document.getElementById("sub-tier");
    const subDurationEl = document.getElementById("sub-duration");
    
    try {
        const subResponse = await fetch(`https://api.twitch.tv/helix/subscriptions?broadcaster_id=${BROADCASTER_ID}&user_id=${userId}`, { headers: twitchHeaders });
        
        if (subResponse.ok) {
            const subData = await subResponse.json();
            
            if (subData.data.length > 0) {
                const tier = subData.data[0].tier;
                
                subStatusEl.textContent = "Abonné"; 
                
                if (tier === "2000") subTierEl.textContent = "(Tier 2)";
                else if (tier === "3000") subTierEl.textContent = "(Tier 3)";
                else subTierEl.textContent = "(Tier 1)";
                
                subDurationEl.textContent = "";
                
            } else {
                subStatusEl.textContent = "Non Abonné";
                subTierEl.textContent = ""; 
            }
        } else {
            subStatusEl.textContent = "Non Abonné";
            subTierEl.textContent = "";
        }
    } catch (error) {
        console.error("Erreur API Subscription:", error);
        subStatusEl.textContent = "Indisponible";
        subTierEl.textContent = "";
    }
}

async function loadUserClips(userId, token, clientId, broadcasterId) {
    document.getElementById("user-clips-loading").style.display = "block";
    
    const twitchHeaders = new Headers({
        'Authorization': `Bearer ${token}`,
        'Client-Id': clientId
    });
    
    try {
        const url = `https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}&creator_id=${userId}&first=6`;
        const response = await fetch(url, { headers: twitchHeaders });
        
        if (!response.ok) {
            throw new Error("Erreur API Clips");
        }
        
        const data = await response.json();
        const gridEl = document.getElementById("user-clips-grid");
        
        if (data.data.length === 0) {
            document.getElementById("user-clips-none").style.display = "block";
        } else {
            data.data.forEach(clip => {
                const card = document.createElement("a");
                card.className = "clip-card";
                card.href = clip.url;
                card.target = "_blank";
                card.rel = "noopener noreferrer";
                
                card.innerHTML = `
                    <div class="clip-thumbnail" style="background-image: url('${clip.thumbnail_url}')"></div>
                    <div class="clip-info">
                        <span class="title">${clip.title}</span>
                    </div>
                `;
                gridEl.appendChild(card);
            });
        }
        
    } catch (error) {
        console.error("Erreur chargement clips perso:", error);
        document.getElementById("user-clips-none").textContent = "Erreur lors du chargement de vos clips.";
        document.getElementById("user-clips-none").style.display = "block";
    } finally {
        document.getElementById("user-clips-loading").style.display = "none";
    }
}