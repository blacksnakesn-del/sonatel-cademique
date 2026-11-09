# Orange Digital Center — API d’authentification

Cette application est une API REST construite avec **Node.js**, **Express**, **TypeScript** et **MySQL**. Elle fournit l’inscription et la connexion des utilisateurs, la gestion de leurs profils et rôles, ainsi qu’une authentification par access token JWT et refresh token.

## Sommaire

- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Routes HTTP](#routes-http)
- [Installation et lancement](#installation-et-lancement)
- [Configuration](#configuration)
- [Migrations et base de données](#migrations-et-base-de-données)
- [Référence des fichiers](#référence-des-fichiers)
- [Tests](#tests)

## Architecture

Le traitement d’une requête suit généralement ce chemin :

```text
Client HTTP
  → route Express (src/router)
  → middleware d’authentification/autorisation (si nécessaire)
  → contrôleur HTTP (src/controller)
  → service métier (src/service)
  → modèle Sequelize (src/models)
  → base de données MySQL
```

- Les **routes** associent une URL et une méthode HTTP à un contrôleur.
- Les **middlewares** vérifient l’identité et les rôles avant l’accès aux routes protégées.
- Les **contrôleurs** gèrent les objets Express `Request` et `Response` : ils appellent les services et traduisent les résultats ou erreurs en réponses HTTP.
- Les **services** contiennent les règles métier et coordonnent validation, base de données, tokens et audit.
- Les **modèles** décrivent les tables manipulées par Sequelize.

L’application Express est construite dans `src/server.ts`. `src/app.ts` connecte la base de données, vérifie la configuration JWT et démarre le serveur.

## Fonctionnalités

### Inscription et gestion des utilisateurs

- L’inscription valide le nom, l’email et le mot de passe, normalise l’email et vérifie son unicité.
- Le mot de passe est stocké sous forme de hash `bcrypt`, jamais sous forme de texte brut.
- Un nouveau compte reçoit le rôle `LEARNER`.
- Un utilisateur authentifié peut lire et modifier son profil (nom et email).
- Un administrateur peut consulter jusqu’à 100 utilisateurs et modifier leur rôle.
- Les réponses de profil excluent le hash du mot de passe.

Les rôles existants sont `ADMIN`, `TEACHER` et `LEARNER`.

### Connexion et sessions

- La connexion vérifie les identifiants avec `bcrypt`.
- Une connexion réussie crée une session persistée en base et renvoie un access token et un refresh token.
- L’access token est un JWT signé qui contient l’identifiant utilisateur (`sub`) et l’identifiant de session (`sid`).
- Le refresh token est aléatoire. Seul son hash SHA-256 est stocké en base.
- Le renouvellement remplace le refresh token précédent par un nouveau.
- La déconnexion révoque la session courante.
- Les routes protégées vérifient le JWT **et** l’état de la session en base.

Par défaut, l’access token expire après 15 minutes et le refresh token après 30 jours. Ces durées sont configurables (voir [Configuration](#configuration)).

### Sécurité et audit

- Les connexions échouées sont suivies par email et adresse IP.
- Après plusieurs tentatives échouées, le compte/IP est temporairement verrouillé.
- Les succès, échecs de connexion et déconnexions sont inscrits dans `auth_logs` avec le contexte disponible (email, utilisateur, IP et agent utilisateur).
- Les erreurs métier sont renvoyées avec un code HTTP adapté.

## Routes HTTP

Toutes les routes sont préfixées par `/auth`.

| Méthode | Route | Accès | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Créer un compte. Corps : `{ "name": "...", "email": "...", "password": "..." }`. |
| `POST` | `/auth/login` | Public | Se connecter. Corps : `{ "email": "...", "password": "..." }`. Renvoie l’utilisateur et les tokens. |
| `POST` | `/auth/refresh` | Public, avec refresh token | Renouveler les tokens. Corps : `{ "refreshToken": "..." }`. |
| `POST` | `/auth/logout` | Authentifié | Révoquer la session courante. |
| `GET` | `/auth/profile` | Authentifié | Obtenir son profil. |
| `PATCH` | `/auth/profile` | Authentifié | Modifier le nom et/ou l’email. |
| `GET` | `/auth/users` | `ADMIN` | Lister jusqu’à 100 utilisateurs. |
| `PATCH` | `/auth/users/:userId/role` | `ADMIN` | Modifier le rôle d’un utilisateur. Corps : `{ "role": "TEACHER" }`, par exemple. |

Pour les routes authentifiées, envoyer l’access token dans l’en-tête :

```http
Authorization: Bearer <accessToken>
```

Le serveur écoute sur `127.0.0.1` et utilise le port défini par `PORT` (5000 par défaut).

## Installation et lancement

### Prérequis

- Node.js et npm
- MySQL
- Une base de données MySQL créée et accessible avec les identifiants configurés

### Installation

```bash
npm install
```

Créer un fichier `.env` à la racine du projet (voir [Configuration](#configuration)), puis lancer :

```bash
npm run dev
```

La commande `dev` exécute les migrations, puis démarre l’application TypeScript avec redémarrage automatique.

Pour construire et lancer la version compilée :

```bash
npm run build
npm start
```

Le script `start` compile le projet, exécute les migrations et lance `dist/app.js`.

## Configuration

Les variables sont chargées depuis `.env` par `src/config/env.ts`. Exemple de configuration locale :

```dotenv
NODE_ENV=development
PORT=5000

DB_NAME=orange_digital_center
DB_USER=root
DB_PASSWORD=remplacer_par_votre_mot_de_passe
DB_HOST=localhost
DB_PORT=3306

JWT_SECRET=remplacer_par_une_cle_secrete_longue_et_aleatoire
ACCESS_TOKEN_TTL_SECONDS=900
REFRESH_TOKEN_TTL_DAYS=30
```

`JWT_SECRET` est obligatoire au démarrage. Ne publiez pas le fichier `.env` et n’utilisez pas les valeurs d’exemple telles quelles en production.

## Migrations et base de données

Les modèles Sequelize correspondent aux tables suivantes :

| Table | Modèle | Utilisation |
|---|---|---|
| `users` | `User` | Comptes, mots de passe hachés et rôles. |
| `user_sessions` | `UserSession` | Sessions, hash du refresh token, date d’expiration et révocation. |
| `login_attempts` | `LoginAttempt` | Compteur et verrouillage des connexions échouées. |
| `auth_logs` | `AuthLog` | Journal des connexions et déconnexions. |

Les migrations du dossier `migrations/` créent la table `users`, puis ajoutent les données et tables nécessaires à l’authentification. Elles sont exécutées avec :

```bash
npm run migrate
```

La configuration utilisée par Sequelize CLI se trouve dans `config/config.cjs`. La connexion utilisée par l’application est créée dans `src/config/database.ts`.

## Référence des fichiers

### Entrée et configuration

| Fichier | Rôle |
|---|---|
| `src/app.ts` | Point de démarrage : vérifie `JWT_SECRET`, ouvre la connexion MySQL et démarre le serveur. |
| `src/server.ts` | Crée l’application Express, active le parseur JSON et monte les routes d’authentification sous `/auth`. |
| `src/config/env.ts` | Charge et expose les variables d’environnement et les valeurs par défaut. |
| `src/config/database.ts` | Configure Sequelize/MySQL, enregistre les modèles et expose `connectDatabase()`. |
| `config/config.cjs` | Fournit la configuration de connexion utilisée par Sequelize CLI pour les migrations. |
| `tsconfig.json` | Configure la compilation TypeScript : sources dans `src/`, sortie dans `dist/`, mode strict et décorateurs. |
| `package.json` | Déclare les dépendances et les commandes npm (`dev`, `build`, `migrate`, `start`). |

### Routes, contrôleur et middleware

| Fichier | Rôle |
|---|---|
| `src/router/authRouter.ts` | Déclare les routes HTTP et associe les routes protégées aux middlewares adéquats. |
| `src/controller/authController.ts` | Implémente les gestionnaires HTTP : inscription, connexion, renouvellement, déconnexion, profil et opérations administrateur. Transforme les erreurs en réponses JSON. |
| `src/midleware/authMidleware.ts` | `authenticate` valide le Bearer JWT et la session en base ; `authorize` vérifie le rôle requis. |
| `src/type/express.d.ts` | Étend le type `Express.Request` pour y ajouter les informations d’authentification (`userId`, `sessionId`, `role`). |

### Services métier (`src/service/`)

| Fichier | Rôle et principales fonctions |
|---|---|
| `authentificate.ts` | Façade importée par le contrôleur. Réexporte les services utilisateurs, sessions, erreurs et types. |
| `authUsers.ts` | `register` crée un compte ; `getProfile` lit un profil ; `updateProfile` modifie nom/email ; `listUsers` liste les utilisateurs ; `setUserRole` change un rôle. |
| `authSessions.ts` | `login` contrôle les identifiants et ouvre une session ; `refresh` renouvelle les tokens ; `logout` révoque la session. |
| `authTokens.ts` | Crée les refresh tokens, les hache, calcule leur expiration et signe les access tokens JWT. |
| `authValidation.ts` | Fournit les validations partagées : objet, chaîne requise, email, mot de passe, identifiants et rôle utilisateur. |
| `loginAttempts.ts` | `isLoginLocked` vérifie un verrouillage actif ; `recordFailedAttempt` incrémente et gère la fenêtre de tentatives en base. |
| `authAudit.ts` | `writeAuthLog` écrit un événement d’authentification en base, éventuellement dans une transaction. |
| `authErrors.ts` | Définit `AuthServiceError`, une erreur métier portant un message et un statut HTTP. |
| `authTypes.ts` | Définit `AuthContext`, le contexte IP/agent utilisateur transmis aux services. |

### Modèles et migrations

| Fichier | Rôle |
|---|---|
| `src/models/User.ts` | Modèle de la table `users` et définition des rôles autorisés. |
| `src/models/UserSession.ts` | Modèle des sessions de connexion et des refresh tokens. |
| `src/models/LoginAttempt.ts` | Modèle du suivi des tentatives de connexion, indexé par email et IP. |
| `src/models/AuthLog.ts` | Modèle du journal d’audit des événements d’authentification. |
| `src/models/utilisateur.ts` | Ancienne définition Sequelize commentée ; elle n’est pas utilisée par la configuration actuelle. |
| `migrations/20261102165000-create-users.js` | Crée la table `users` si elle n’existe pas. |
| `migrations/20261107133000-add-auth-security.js` | Ajoute les rôles et crée les tables de sessions, tentatives et journaux. |

`src/userController.ts` contient un contrôleur de démonstration qui renvoie un texte statique ; il n’est pas monté dans les routes actuelles.

## Tests

Le script `npm test` n’est pas encore configuré : il affiche actuellement « Error: no test specified ». La commande de compilation TypeScript disponible est :

```bash
npm run build
```
