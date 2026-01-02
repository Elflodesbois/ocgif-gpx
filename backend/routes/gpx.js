const express = require('express');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

module.exports = function(pool) {
    const router = express.Router();

    router.post('/upload', upload.single('file'), async (req, res) => {
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

            // Contenu du fichier GPX stocké tel quel
            const fichier_gpx = req.file.buffer.toString('utf-8');

            const sql = `
                INSERT INTO traces
                (nom, description, niveau, distance_km, denivele, date_parcours, fichier_gpx)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *;
            `;

            const values = [
                nom,
                description || null,
                niveau,
                distance_km ? parseFloat(distance_km) : null,
                denivele ? parseInt(denivele) : null,
                date_parcours || null,
                fichier_gpx
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

    router.get('/download/:id', async (req, res) => {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT fichier_gpx FROM traces WHERE id = $1',
            [id]
        );

        if (!result.rows.length) {
            return res.status(404).send('Fichier introuvable');
        }

        res.setHeader('Content-Type', 'application/gpx+xml');
        res.setHeader('Content-Disposition', 'attachment; filename="trace.gpx"');
        res.send(result.rows[0].fichier_gpx);
    });



    return router;
};
