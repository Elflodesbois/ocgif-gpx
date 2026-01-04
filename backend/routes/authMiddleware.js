const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) return res.status(401).json({ error: 'Token manquant' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = payload.userId; // stocke l'id utilisateur pour l'utiliser dans les routes
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token invalide' });
    }
}

module.exports = authMiddleware;
