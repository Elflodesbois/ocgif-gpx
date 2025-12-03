const express = require('express');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

module.exports = function(pool) {
    const router = express.Router();

    router.post('/upload', upload.single('file'), async (req, res) => {
        try {
            const { name, description } = req.body;
            const fileContent = req.file.buffer.toString('utf-8');

            const sql = `
                INSERT INTO traces (name, description, gpx_file)
                VALUES ($1, $2, $3) RETURNING *;
            `;

            const result = await pool.query(sql, [name, description, fileContent]);

            res.json({ success: true, trace: result.rows[0] });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur upload GPX" });
        }
    });

    return router;
};
