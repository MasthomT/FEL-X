// Cette fonction s'exécutera sur les serveurs de Vercel, pas dans le navigateur.
export default async function handler(req, res) {
    
    // 1. Récupérer les clés secrètes depuis les variables d'environnement de Vercel
    const CLIENT_ID = process.env.VITE_TWITCH_CLIENT_ID;
    const CLIENT_SECRET = process.env.VITE_TWITCH_CLIENT_SECRET;
    const REDIRECT_URI = process.env.VITE_REDIRECT_URI;

    // 2. Récupérer le "code" envoyé par la page auth.html
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code manquant' });
    }

    try {
        // 3. Échanger le code contre un VRAI token (appel sécurisé serveur-à-serveur)
        const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URI,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error(tokenData.message || 'Erreur Twitch');
        }

        // 4. Renvoyer le token (et seulement le token) au navigateur
        res.status(200).json({ 
            access_token: tokenData.access_token 
        });

    } catch (error) {
        console.error('Erreur dans la fonction /api/auth:', error);
        res.status(500).json({ error: error.message });
    }
}