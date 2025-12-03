const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à PostgreSQL
const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});

app.get("/", (req, res) => {
    res.send("API OK");
});

// Import des routes
app.use('/api/gpx', require('./routes/gpx')(pool));
app.use('/api/users', require('./routes/users')(pool));

app.listen(3000, () => console.log("➡ API démarrée sur http://localhost:3000"));
