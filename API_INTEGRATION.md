# Documentation d'intégration API NSC1

## Vue d'ensemble

Ce document décrit l'intégration de l'API REST PHP Slim pour le système de porte sécurisée NSC1.

## Configuration de l'API

### Informations de connexion

- **URL de base** : `http://kasalali.alwaysdata.net/API_NSC1`
- **Login JWT** : `NSC1_API`
- **Password JWT** : `Jone_Porte!87-/`

### Base de données

- **URL** : https://phpmyadmin.alwaysdata.com
- **Login** : `kasalali`
- **Mot de passe** : `Blorboblibus`

## Architecture

### Fichiers modifiés

1. **api-config.js** (nouveau)
   - Configuration centralisée de l'API
   - Classe `APIClient` pour gérer toutes les requêtes
   - Gestion automatique des tokens JWT
   - Refresh automatique des tokens expirés

2. **login.js** (modifié)
   - Intégration de l'authentification via API
   - Gestion des demandes d'urgence via API

3. **cardform.js** (modifié)
   - Intégration de l'inscription/demande d'accès via API
   - Gestion des erreurs et messages de retour

4. **login.html** (modifié)
   - Ajout du script `api-config.js`

5. **cardform.html** (modifié)
   - Ajout du script `api-config.js`

## Endpoints API utilisés

### 1. Authentification - Login
- **Endpoint** : `/auth/login`
- **Méthode** : `POST`
- **Body** :
```json
{
  "username": "string",
  "password": "string"
}
```
- **Réponse succès** :
```json
{
  "success": true,
  "token": "jwt_token",
  "refresh_token": "refresh_token",
  "user": {
    "id": 1,
    "username": "user",
    "email": "user@example.com"
  }
}
```

### 2. Inscription / Demande d'accès
- **Endpoint** : `/auth/register`
- **Méthode** : `POST`
- **Body** :
```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "reason": "string"
}
```
- **Réponse succès** :
```json
{
  "success": true,
  "message": "Demande envoyée avec succès"
}
```

### 3. Demande d'urgence
- **Endpoint** : `/access/emergency`
- **Méthode** : `POST`
- **Body** :
```json
{
  "reason": "string"
}
```
- **Réponse succès** :
```json
{
  "success": true,
  "message": "Demande d'urgence envoyée"
}
```

### 4. Refresh Token
- **Endpoint** : `/auth/refresh`
- **Méthode** : `POST`
- **Headers** : `Authorization: Bearer {refresh_token}`
- **Réponse succès** :
```json
{
  "token": "new_jwt_token",
  "refresh_token": "new_refresh_token"
}
```

### 5. Informations utilisateur
- **Endpoint** : `/user/info`
- **Méthode** : `GET`
- **Headers** : `Authorization: Bearer {token}`
- **Réponse succès** :
```json
{
  "id": 1,
  "username": "user",
  "email": "user@example.com",
  "fullName": "User Name",
  "company": "Company Name"
}
```

## Utilisation de l'API Client

### Instance globale

L'instance `apiClient` est disponible globalement dans tous les fichiers JavaScript qui incluent `api-config.js`.

### Méthodes disponibles

#### 1. Connexion
```javascript
const result = await apiClient.login(username, password);
if (result.success) {
    // Token automatiquement stocké
    console.log('Connecté !');
} else {
    console.error(result.message);
}
```

#### 2. Inscription
```javascript
const userData = {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "0612345678",
    company: "ACME Corp",
    reason: "Accès pour maintenance"
};

const result = await apiClient.register(userData);
if (result.success) {
    console.log('Demande envoyée !');
}
```

#### 3. Demande d'urgence
```javascript
const result = await apiClient.emergencyAccess('Urgence médicale');
if (result.success) {
    console.log('Agent contacté !');
}
```

#### 4. Vérifier l'authentification
```javascript
if (apiClient.isAuthenticated()) {
    console.log('Utilisateur connecté');
}
```

#### 5. Déconnexion
```javascript
apiClient.logout();
// Supprime tous les tokens et données utilisateur
```

## Gestion des tokens

### Stockage
Les tokens sont stockés dans le `localStorage` :
- `jwt_token` : Token d'accès principal
- `refresh_token` : Token de rafraîchissement
- `user_info` : Informations de l'utilisateur (JSON)

### Refresh automatique
Le client API gère automatiquement le rafraîchissement des tokens :
- Détecte les erreurs 401 (token expiré)
- Utilise le refresh token pour obtenir un nouveau token
- Réessaie automatiquement la requête avec le nouveau token

### Sécurité
⚠️ **Important** : Les credentials JWT sont actuellement en dur dans `api-config.js`. Pour la production :
- Déplacer les credentials vers des variables d'environnement
- Utiliser HTTPS pour toutes les communications
- Implémenter une rotation régulière des tokens
- Ajouter une validation CORS côté serveur

## Tests

### Test de connexion
1. Ouvrir `login.html`
2. Entrer des identifiants valides
3. Vérifier dans la console du navigateur les appels API
4. Vérifier le stockage des tokens dans `localStorage`

### Test d'inscription
1. Ouvrir `cardform.html`
2. Remplir le formulaire
3. Soumettre et vérifier la réponse de l'API

### Test d'urgence
1. Ouvrir `login.html`
2. Cliquer sur "Demande d'accès"
3. Vérifier l'appel API dans la console

## Débogage

### Console du navigateur
Tous les appels API sont loggés dans la console. Pour déboguer :
```javascript
// Ouvrir la console (F12)
// Vérifier les logs d'erreur
console.log(apiClient.token); // Voir le token actuel
console.log(localStorage.getItem('jwt_token')); // Voir le token stocké
```

### Erreurs courantes

1. **CORS Error**
   - Vérifier que l'API autorise les requêtes depuis votre domaine
   - Configurer les headers CORS côté serveur

2. **401 Unauthorized**
   - Token expiré ou invalide
   - Le refresh automatique devrait gérer ce cas

3. **Network Error**
   - Vérifier que l'URL de l'API est correcte
   - Vérifier la connexion internet

## Prochaines étapes

### Côté serveur (API PHP Slim)
Vous devez implémenter les endpoints suivants dans votre API :

1. **POST /auth/token** - Obtenir un token JWT avec les credentials API
2. **POST /auth/login** - Authentifier un utilisateur
3. **POST /auth/register** - Enregistrer une demande d'accès
4. **POST /auth/refresh** - Rafraîchir un token
5. **POST /access/emergency** - Enregistrer une demande d'urgence
6. **GET /user/info** - Récupérer les infos utilisateur

### Structure de base de données suggérée

```sql
-- Table utilisateurs
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    company VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT FALSE
);

-- Table demandes d'accès
CREATE TABLE access_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table demandes d'urgence
CREATE TABLE emergency_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    reason TEXT,
    status ENUM('pending', 'handled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table tokens de refresh
CREATE TABLE refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Support

Pour toute question ou problème :
- Email : support@nsc1.com
- Urgences : 01 23 45 67 89

---

© 2025 NSC1 - Système de porte sécurisée
