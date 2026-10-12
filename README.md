# Annuaire – démo en lecture seule
Application React + Vite. Connexion en un clic, aucune écriture : seules les requêtes **GET** sont possibles (garde-fou dans `src/api.js`).

```
npm install
cp .env.example .env   # adapter l'URL de l'API
npm run dev
```
Le backend doit exposer `GET /demo/users` et `GET /demo/evenements` (voir `Backend-demo-patch`). Sans serveur, des données d’exemple s’affichent.
Pensez à activer le CORS pour `http://localhost:5173` côté backend.
