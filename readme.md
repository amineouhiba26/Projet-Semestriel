🚗 Rental Agency Backend – API REST NodeJS + MongoDB

Système complet de gestion d’agence de location de véhicules avec authentification JWT, gestion de véhicules, réservations, contrats, paiements, maintenance + upload Cloudinary + génération PDF.

🛠 Technologies utilisées
Technologie	Rôle
Node.js / Express	Backend REST API
MongoDB + Mongoose	Base de données
JWT	Authentification sécurisée
Multer + Cloudinary	Upload d’images de véhicules
PDFKit	Génération automatique de contrats PDF
Swagger UI	Documentation API interactive
Render / Ngrok	Déploiement & accès public
📁 Architecture du projet
📦 projet-location-vehicules
 ┣ 📂 config          → connexion MongoDB
 ┣ 📂 controllers     → logique métier API
 ┣ 📂 models          → schémas mongoose
 ┣ 📂 routes          → routes organisées par module
 ┣ 📂 middleware      → auth, upload, permissions
 ┣ 📂 uploads         → PDF générés
 ┣ 📄 swagger.js      → configuration de Swagger UI
 ┣ 📄 index.js        → point d’entrée du serveur
 ┗ 📄 README.md       → documentation

🔐 Authentification & Rôles
Type	Route	Description
Client	/api/auth/client/register	inscription
Client	/api/auth/client/login	connexion
Admin	/api/auth/admin/register	création admin
Admin	/api/auth/admin/login	connexion
Tous	/api/auth/me	profil utilisateur connecté

✔ Tokens basés sur JWT
✔ Gestion des rôles ADMIN / CLIENT
✔ Middlewares protect, isAdmin, isClient

🚗 Gestion des véhicules + catégories

Fonctionnalités admin :

Action	Route
Créer catégorie	POST /api/vehicles/categories
Lister catégories	GET /api/vehicles/categories
Créer véhicule (avec photo Cloudinary)	POST /api/vehicles
Mettre à jour véhicule	PUT /api/vehicles/:id
Modifier statut (AVAILABLE / RENTED / MAINTENANCE)	PATCH /api/vehicles/:id/status
Supprimer véhicule	DELETE /api/vehicles/:id

Fonctionnalités publiques :

Action	Route
Voir tous les véhicules	GET /api/vehicles
Filtrer par statut/catégorie	?status=AVAILABLE&categoryId=ID
Voir un véhicule	GET /api/vehicles/:id
📅 Réservations des véhicules
Action	Route
Client → réserver	POST /api/reservations
Voir mes réservations	GET /api/reservations/my
Admin → voir toutes les réservations	GET /api/reservations
Admin → approuver réservation	PATCH /api/reservations/:id/approve
Client → annuler réservation	DELETE /api/reservations/:id

🔁 Lors d’une approbation → véhicule = RENTED
🔁 Lors d’une annulation → véhicule = AVAILABLE

🔧 Maintenance des véhicules
Action	Route
Créer maintenance	POST /api/maintenance
Lister toutes	GET /api/maintenance
Voir par véhicule	GET /api/maintenance/vehicle/:id
Modifier statut (IN_PROGRESS / DONE)	PATCH /api/maintenance/:id/status

✔ À la fin maintenance DONE → véhicule peut redevenir AVAILABLE

📄 Contrats PDF Automatiques
Action	Route
Générer contrat depuis réservation approuvée	POST /api/contracts/from-reservation/:id
Voir tous les contrats	GET /api/contracts
Télécharger contrat PDF	GET /api/contracts/:id/pdf
Clôturer contrat	PATCH /api/contracts/:id/close

🟢 Contrat PDF contient :

infos client

véhicule

dates

prix total

signature automatique & numéro unique

💳 Paiement
Action	Route
Ajouter paiement	POST /api/payments
Voir tous	GET /api/payments
Voir paiement d’un contrat	GET /api/payments/contract/:id

✔ Montant lié au contrat
✔ Mode de paiement (CASH/CARD/TRANSFER)
✔ Traçabilité complète

📘 Swagger API Docs

Dès que le serveur tourne :

http://localhost:3000/api-docs


Documentation interactive permettant de tester toutes les routes.

🔥 Déploiement
Option	Usage
Ngrok	Accès public rapide temps réel
Render	Hébergement Cloud permanent

Swagger via Render devient :

https://ton-backend.onrender.com/api-docs

🎯 Résultat final du projet

✔ Backend complet, sécurisé, structuré
✔ Gestion complète d’une agence de location
✔ Auth + véhicules + réservation + paiement + PDF + cloud
✔ API documentée & exploitable par front web/mobile
