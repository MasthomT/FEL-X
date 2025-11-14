// Cible le bouton de déconnexion sur le menu latéral
if(document.getElementById("logout-sidebar")) {
    document.getElementById("logout-sidebar").onclick = function() {
        localStorage.removeItem("twitch_token");
        window.location.replace("/index.html");
    };
}
// (Sécurité pour le bouton de la page d'accueil)
if(document.getElementById("logout")) {
    document.getElementById("logout").onclick = function() {
        localStorage.removeItem("twitch_token");
        window.location.replace("/index.html");
    };
}

// =================================================================
// 2. CONFIGURATION FIREBASE (Inchangée)
// =================================================================
const firebaseConfig = {
    apiKey: "AIzaSyAK0b_n1yTPKGKIZ4TuUmpBNPb3aoVvCI8",
    authDomain: "fel-x-503f8.firebaseapp.com",
    databaseURL: "https://fel-x-503f8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fel-x-503f8",
    storageBucket: "fel-x-503f8.firebasestorage.app",
    messagingSenderId: "922613900734",
    appId: "1:922613900734:web:4d192151bebd5e7ac885ef"
};

// Évite l'erreur de "déjà initialisé"
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// =================================================================
// 3. FONCTION DE CALCUL DE NIVEAU (Inchangée)
// =================================================================
function calculateLevel(xp) {
    if (xp < 0) return 1;
    const level = Math.floor(Math.pow(Math.max(0, xp + 1e-9) / 100, 1 / 2.2)) + 1;
    return Math.max(1, level);
}

// =================================================================
// 4. FONCTION PRINCIPALE (CHARGEMENT DU PROFIL) - MISE À JOUR
// =================================================================
// On vérifie que la fonction loadProfile ne s'exécute que sur la page profile.html
if (document.getElementById("profile-content")) {
    (async function loadProfile() {
        const token = localStorage.getItem("twitch_token");
        if (!token) {
            window.location.replace("/index.html");
            return;
        }

        const CLIENT_ID = "8jpfq5497uee7kdrsx4djhb7nw2xec";
        const BROADCASTER_ID = "439356462";
        
        const twitchHeaders = new Headers({
            'Authorization': `Bearer ${token}`,
            'Client-Id': CLIENT_ID
        });

        try {
            // === ÉTAPE A: Récupérer l'identité du viewer (Inchangé) ===
            const twitchResponse = await fetch('https://api.twitch.tv/helix/users', { headers: twitchHeaders });
            if (!twitchResponse.ok) throw new Error("Token Twitch invalide ou expiré.");
            
            const twitchData = await twitchResponse.json();
            const user = twitchData.data[0];
            
            document.getElementById("display-name").textContent = user.display_name;
            document.getElementById("profile-pic").src = user.profile_image_url;


            // === !! NOUVEAU: ÉTAPE B: Récupérer le statut du stream !! ===
            (async function fetchStreamStatus() {
                const banner = document.getElementById("stream-status-banner");
                const statusText = document.getElementById("stream-status-text");
                const detailsText = document.getElementById("stream-details");
                try {
                    const streamResponse = await fetch(`https://api.twitch.tv/helix/streams?user_id=${BROADCASTER_ID}`, { headers: twitchHeaders });
                    if (!streamResponse.ok) throw new Error("Impossible de charger le statut du stream.");
                    
                    const streamData = await streamResponse.json();
                    
                    if (streamData.data.length > 0) {
                        // LE STREAM EST EN LIGNE
                        const stream = streamData.data[0];
                        banner.classList.add("live");
                        statusText.textContent = "EN LIGNE";
                        detailsText.innerHTML = `<strong>${stream.title}</strong><br>Joue à : ${stream.game_name} | ${stream.viewer_count} viewers`;
                    } else {
                        // LE STREAM EST HORS LIGNE
                        banner.classList.add("offline");
                        statusText.textContent = "HORS LIGNE";
                        detailsText.textContent = "La chaîne est actuellement hors ligne. Revenez plus tard !";
                    }
                } catch (error) {
                    console.error("Erreur statut stream:", error);
                    statusText.textContent = "Statut du stream indisponible";
                }
                banner.style.display = "block"; // Affiche la bannière
            })();
            

            // === ÉTAPE C: Récupérer les données XP (Inchangé) ===
            const userKey = user.login.toLowerCase(); 
            const xpRef = db.ref(`viewer_data/xp/${userKey}`);
            const historyRef = db.ref(`viewer_data/history/${userKey}`);

            const xpSnapshot = await xpRef.get();
            const historySnapshot = await historyRef.get();

            if (xpSnapshot.exists()) {
                const xpData = xpSnapshot.val();
                const level = calculateLevel(xpData.xp);
                document.getElementById("level").textContent = level;
                document.getElementById("xp").textContent = xpData.xp.toLocaleString('fr-FR');
            } else {
                document.getElementById("level").textContent = 1;
                document.getElementById("xp").textContent = 0;
            }
            
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
            
            // === ÉTAPE D: Récupérer le statut de Follow (API Corrigée) ===
            (async function fetchFollowStatus() {
                try {
                    const followResponse = await fetch(`https://api.twitch.tv/helix/channels/followed?user_id=${user.id}&broadcaster_id=${BROADCASTER_ID}`, { headers: twitchHeaders });
                    
                    if (!followResponse.ok) throw new Error("Erreur API Follow");
                    
                    const followData = await followResponse.json();
                    
                    if (followData.total > 0 && followData.data.length > 0) {
                        const followDate = new Date(followData.data[0].followed_at).toLocaleDateString('fr-FR');
                        document.getElementById("follow-status").textContent = `Vous suivez la chaîne depuis le ${followDate}`;
                    } else {
                        document.getElementById("follow-status").textContent = "Vous ne suivez pas la chaîne.";
                    }
                } catch (error) {
                     console.error("Erreur API Follow:", error);
                     document.getElementById("follow-status").textContent = "Statut de follow indisponible";
                }
            })();

            // === !! NOUVEAU: ÉTAPE E: Récupérer le statut d'Abonnement !! ===
            (async function fetchSubscriptionStatus() {
                const subStatusEl = document.getElementById("sub-status");
                try {
                    // Cette API renvoie 200 s'ils sont abonnés, et 404 s'ils ne le sont pas
                    const subResponse = await fetch(`https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=${BROADCASTER_ID}&user_id=${user.id}`, { headers: twitchHeaders });
                    
                    if (subResponse.ok) {
                        const subData = await subResponse.json();
                        const tier = subData.data[0].tier;
                        if (tier === "2000") subStatusEl.textContent = "Abonné (Tier 2)";
                        else if (tier === "3000") subStatusEl.textContent = "Abonné (Tier 3)";
                        else subStatusEl.textContent = "Abonné (Tier 1)";
                        
                    } else {
                        // L'erreur 404 est le comportement normal pour "non abonné"
                        subStatusEl.textContent = "Non Abonné";
                    }
                } catch (error) {
                    console.error("Erreur API Subscription:", error);
                    subStatusEl.textContent = "Indisponible";
                }
            })();

            // === ÉTAPE F: Afficher le profil complet (Inchangé) ===
            document.getElementById("loading").style.display = "none";
            document.getElementById("profile-content").style.display = "block";

        } catch (error) {
            console.error("Erreur lors du chargement du profil:", error);
            if (error.message.includes("Token")) {
                // Si le token principal (pour /users) échoue, on redirige
                localStorage.removeItem("twitch_token");
                window.location.replace("/index.html?error=session_expired");
            } else {
                // Pour les autres erreurs (API partielles), on affiche une erreur
                document.getElementById("loading").textContent = "Une erreur est survenue lors du chargement de certaines données.";
            }
        }
    })(); // Exécute la fonction loadProfile
}