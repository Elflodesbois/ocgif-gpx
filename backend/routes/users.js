const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = function(pool) {
    const router = express.Router();

    // 🔹 Inscription
    router.post('/register', async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: "Champs manquants" });
            }

            // Vérifie si l'utilisateur existe déjà
            const exists = await pool.query(`SELECT id FROM users WHERE username = $1`, [username]);
            if (exists.rows.length > 0) {
                return res.status(400).json({ error: "Utilisateur déjà existant" });
            }

            const hash = await bcrypt.hash(password, 10);

            const result = await pool.query(`
                INSERT INTO users (username, password_hash)
                VALUES ($1, $2)
                RETURNING id, username;
            `, [username, hash]);

            res.json({ success: true, user: result.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur inscription" });
        }
    });

    // 🔹 Connexion
    router.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body;

            const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
            if (result.rows.length === 0) return res.status(401).json({ error: "Utilisateur inconnu" });

            const user = result.rows[0];
            const ok = await bcrypt.compare(password, user.password_hash);
            if (!ok) return res.status(401).json({ error: "Mot de passe incorrect" });

            // Création du token JWT
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

            res.json({ success: true, token, userId: user.id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur connexion" });
        }
    });

    return router;
};
