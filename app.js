const firebaseConfig = {
    apiKey: "AIzaSyAK0b_n1yTPKGKIZ4TuUmpBNPb3aoVvCI8",
    authDomain: "fel-x-503f8.firebaseapp.com",
    databaseURL: "https://fel-x-503f8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fel-x-503f8",
    storageBucket: "fel-x-503f8.firebasestorage.app",
    messagingSenderId: "922613900734",
    appId: "1:922613900734:web:4d192151bebd5e7ac885ef"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialisé.");
    } catch (e) {
        console.error("Erreur Init Firebase:", e);
    }
}

function checkAuth() {
    const token = localStorage.getItem("twitch_token");
    const path = window.location.pathname;
    
    if (!token && path !== "/index.html" && path !== "/" && path !== "/auth.html") {
        window.location.href = "/index.html";
        return null;
    }
    return token;
}

if (document.getElementById("logout-btn")) {
    document.getElementById("logout-btn").onclick = function(e) {
        e.preventDefault();
        localStorage.removeItem("twitch_token");
        window.location.href = "/index.html";
    };
}

function calculateLevel(xp) {
    if (!xp || xp < 0) return 1;
    return Math.floor(Math.pow(Math.max(0, xp) / 100, 1 / 2.2)) + 1;
}

async function saveToSQL(userId, userName, payload) {
    try {
        await fetch(`${SERVER_URL}/api/update_context`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
                twitch_id: userId,
                username: userName,
                ...payload
            })
        });
        console.log("Synchronisation SQL réussie !");
    } catch (e) {
        console.error("Échec de la synchro SQL:", e);
    }
}