-- Table des utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);



CREATE TYPE niveau_groupe AS ENUM (
  'groupe balade',
  'groupe 1',
  'groupe 2',
  'groupe 3',
  'groupe 4',
  'groupe 5',
  'groupe sportif',
  'groupe école',
  'groupe evo',
  'groupe perf'
);

CREATE TABLE traces (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    niveau niveau_groupe NOT NULL,
    distance_km NUMERIC(6,2),
    denivele INT,
    date_parcours DATE,
    fichier_gpx TEXT NOT NULL,   -- on garde comme actuellement
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);