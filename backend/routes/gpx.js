const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authMiddleware = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || "CléDeTestTemporaire"; // fallback temporaire

// Configuration du stockage disque pour les fichiers GPX
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Chemin vers le dossier uploads/gpx
        const uploadPath = path.join(__dirname, '../uploads/gpx');

        // Création du dossier s'il n'existe pas
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Génère un nom unique pour éviter les doublons
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

// Filtre pour accepter uniquement les fichiers .gpx
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname).toLowerCase() !== '.gpx') {
            return cb(new Error('Seuls les fichiers GPX sont autorisés'));
        }
        cb(null, true);
    }
});


module.exports = function(pool) {
    const router = express.Router();

    router.post('/upload',authMiddleware, upload.single('file'), async (req, res) => {
        try {
           const {
                nom,
                description,
                niveau,
                distance_km,
                denivele,
                date_parcours
            } = req.body;

            if (!nom || !niveau || !req.file) {
                return res.status(400).json({ error: 'Champs obligatoires manquants' });
            }

            // Nom du fichier stocké sur le serveur
            const fichier_path = req.file.filename;


            const sql = `
                INSERT INTO traces
                (nom, description, niveau, distance_km, denivele, date_parcours, fichier_path, user_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;
            `;

            const values = [
                nom,
                description || null,
                niveau,
                distance_km ? parseFloat(distance_km) : null,
                denivele ? parseInt(denivele) : null,
                date_parcours || null,
                fichier_path,
                req.userId
            ];

            const result = await pool.query(sql, values);


            res.json({ success: true, trace: result.rows[0] });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur upload GPX" });
        }
    });

    router.get('/', async (req, res) => {
        try {
            const result = await pool.query(`
            SELECT
                id,
                nom,
                description,
                niveau,
                distance_km,
                denivele,
                date_parcours,
                cree_le
            FROM traces
            ORDER BY cree_le DESC
            `);

            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur récupération traces' });
        }
    });

    router.get('/niveau', async (req, res) => {
        try {
            const result = await pool.query(`
            SELECT UNNEST(enum_range(NULL::niveau_groupe)) AS niveaux
            `);

            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur récupération niveau' });
        }
    });

    // 🔹 Voir toutes ses traces
    router.get('/mes-traces', authMiddleware, async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT id, nom, description, niveau, distance_km, denivele, date_parcours, cree_le
                FROM traces
                WHERE user_id = $1
                ORDER BY cree_le DESC
            `, [req.userId]);

            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur récupération traces' });
        }
    });

    // 🔹 Supprimer une trace
    router.delete('/mes-traces/:id', authMiddleware, async (req, res) => {
        const { id } = req.params;

        try {
            // 1. Récupérer le fichier_path avant suppression
            const selectResult = await pool.query(
                'SELECT fichier_path FROM traces WHERE id = $1 AND user_id = $2',
                [id, req.userId]
            );

            if (!selectResult.rows.length) {
                return res.status(404).json({ error: 'Trace introuvable ou non autorisée' });
            }

            const fichierPath = selectResult.rows[0].fichier_path;

            // 2. Supprimer l'entrée en base
            await pool.query(
                'DELETE FROM traces WHERE id = $1 AND user_id = $2',
                [id, req.userId]
            );

            // 3. Supprimer le fichier du disque
            const fullPath = path.join(__dirname, '../uploads/gpx', fichierPath);

            try {
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            } catch (fileErr) {
                console.error('Erreur suppression fichier:', fileErr);
            }


            res.json({ success: true, message: 'Trace et fichier supprimés' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur suppression trace' });
        }
    });


    router.get('/download/:id', async (req, res) => {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT fichier_path FROM traces WHERE id = $1',
            [id]
        );

        if (!result.rows.length) {
            return res.status(404).send('Fichier introuvable');
        }

        // Reconstruction du chemin complet vers le fichier
        const filePath = path.join(__dirname, '../uploads/gpx', result.rows[0].fichier_path);

        // Vérifie que le fichier existe physiquement
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('Fichier absent du serveur');
        }

        // Envoi du fichier au téléchargement
        res.download(filePath);
    });




    return router;
};
