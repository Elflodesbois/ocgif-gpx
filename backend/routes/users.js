const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = function(pool) {
    const router = express.Router();

    // Enregistrement utilisateur
    router.post('/register', async (req, res) => {
        const { username, password } = req.body;

        const hash = await bcrypt.hash(password, 10);

        const result = await pool.query(`
            INSERT INTO users (username, password_hash)
            VALUES ($1, $2)
            RETURNING id, username;
        `, [username, hash]);

        res.json(result.rows[0]);
    });

    // Connexion
    router.post('/login', async (req, res) => {
        const { username, password } = req.body;

        const result = await pool.query(`SELECT * FROM users WHERE username = $1;`, [username]);
        if (result.rows.length === 0)
            return res.status(401).json({ error: "Utilisateur inconnu" });

        const user = result.rows[0];

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok)
            return res.status(401).json({ error: "Mot de passe incorrect" });

        res.json({
            message: "Connexion ok",
            userId: user.id
        });
    });

    return router;
};
