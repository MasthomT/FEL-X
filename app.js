// Cible le bouton de déconnexion sur le menu latéral
if(document.getElementById("logout-sidebar")) {
    document.getElementById("logout-sidebar").onclick = function() {
        localStorage.removeItem("twitch_token");
        window.location.replace("/index.html");
    };
}
// (Ajout d'une sécurité pour le bouton de la page d'accueil)
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

firebase.initializeApp(firebaseConfig);
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
// 4. FONCTION PRINCIPALE (CHARGEMENT DU PROFIL) - CORRIGÉE
// =================================================================
async function loadProfile() {
    const token = localStorage.getItem("twitch_token");
    if (!token) {
        window.location.replace("/index.html");
        return;
    }

    const CLIENT_ID = "8jpfq5497uee7kdrsx4djhb7nw2xec";
    const BROADCASTER_ID = "439356462";

    try {
        // === ÉTAPE A: Récupérer l'identité du viewer (Inchangé) ===
        const twitchHeaders = new Headers({
            'Authorization': `Bearer ${token}`,
            'Client-Id': CLIENT_ID
        });
        
        const twitchResponse = await fetch('https://api.twitch.tv/helix/users', { headers: twitchHeaders });
        if (!twitchResponse.ok) throw new Error("Token Twitch invalide ou expiré.");
        
        const twitchData = await twitchResponse.json();
        const user = twitchData.data[0];
        
        document.getElementById("display-name").textContent = user.display_name;
        document.getElementById("profile-pic").src = user.profile_image_url;

        // === ÉTAPE B: Récupérer les données XP (CORRIGÉ) ===
        
        // CORRECTION N°1 : Forcer le nom en minuscules pour correspondre à Firebase
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
        
        // === ÉTAPE C: Récupérer le statut de Follow (CORRIGÉ) ===
        
        // CORRECTION N°2 : Utilisation de la bonne API (/users/follows)
        const followResponse = await fetch(`https://api.twitch.tv/helix/users/follows?from_id=${user.id}&to_id=${BROADCASTER_ID}`, { headers: twitchHeaders });
        
        if (!followResponse.ok) {
            console.error("Erreur API Follow:", await followResponse.text());
            document.getElementById("follow-status").textContent = "Erreur - Statut de follow indisponible";
        } else {
            const followData = await followResponse.json();
            
            if (followData.total > 0 && followData.data.length > 0) {
                const followDate = new Date(followData.data[0].followed_at).toLocaleDateString('fr-FR');
                document.getElementById("follow-status").textContent = `Vous suivez la chaîne depuis le ${followDate}`;
            } else {
                document.getElementById("follow-status").textContent = "Vous ne suivez pas la chaîne.";
            }
        }

        // === ÉTAPE D: Afficher le profil complet (Inchangé) ===
        document.getElementById("loading").style.display = "none";
        document.getElementById("profile-content").style.display = "block";

    } catch (error) {
        console.error("Erreur lors du chargement du profil:",