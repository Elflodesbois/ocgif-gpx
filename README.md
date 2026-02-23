# ocgif-gpx
Webapp Angular pour afficher et télécharger les traces GPX du club de VTT de Gif-sur-Yvette

Développeurs:
- BARRET Florian
- CHARRIER Chloé

## Informations utiles

Voici comment installer et lancer les différents composants de l'application

### Base de données
PostgreSQL doit être installé sur le serveur. 

La base de données doit s'appeler `gpxdb`. Les tables peuvent être créées avec le script de création `db/create.sql`.

Si elle est protégée par un mot de passe, il faut renseigner celui-ci dans le fichier `backend/.env`, propriété `PG_PASSWORD`.

### Backend
Ouvrir un terminal.

Se positionner dans le dossier du backend pour toutes les opérations de cette section: `cd backend`.

Installer les dépendances: `npm install express pg bcrypt jsonwebtoken dotenv cors`.

Lancer le backend avec la commande: `node server.js`.

**En cas de problème de ports, ceux-ci sont configurables dans `backend/.env` et dans `src/app/environments/environment.ts`**

### Frontend
Angular doit être installé sur la machine accueillant le frontend.

Ouvrir un terminal à la racine du projet.

Installer les dépendances: `npm i`.

Lancer l'interface avec: `ng serve`.

L'interface devrait être disponible à l'adresse suivante: [https://localhost:4200](https://localhost:4200)
