# 🚀 Guide de démarrage rapide - NSC1 API Integration

## ⚡ Démarrage en 3 minutes

### 1. Vérifier les fichiers
Assurez-vous que tous ces fichiers sont présents :
- ✅ `api-config.js` - Configuration API
- ✅ `login.html` / `login.js` - Page de connexion
- ✅ `cardform.html` / `cardform.js` - Formulaire d'inscription
- ✅ `test-api.html` - Interface de test

### 2. Tester l'intégration client

#### Option A : Interface de test (Recommandé)
```bash
# Ouvrir dans un navigateur
test-api.html
```

1. Vérifiez que l'URL API s'affiche correctement
2. Testez chaque fonctionnalité avec les boutons
3. Observez les résultats dans l'interface

#### Option B : Pages réelles
```bash
# Ouvrir dans un navigateur
login.html
```

1. Ouvrez la console (F12)
2. Essayez de vous connecter
3. Vérifiez les appels API dans l'onglet Network

### 3. Vérifier la configuration

Ouvrez `api-config.js` et vérifiez :
```javascript
BASE_URL: 'http://kasalali.alwaysdata.net/API_NSC1'  // ✅ Correct ?
JWT_USERNAME: 'NSC1_API'                              // ✅ Correct ?
JWT_PASSWORD: 'Jone_Porte!87-/'                       // ✅ Correct ?
```

## 🔧 Configuration côté serveur

### Étape 1 : Créer la base de données

Connectez-vous à phpMyAdmin :
- URL : https://phpmyadmin.alwaysdata.com
- Login : `kasalali`
- Password : `Blorboblibus`

Exécutez ce SQL :

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

-- Table refresh tokens
CREATE TABLE refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Étape 2 : Implémenter les endpoints dans votre API Slim

Créez ces routes dans votre API PHP Slim :

#### 1. POST /auth/login
```php
$app->post('/auth/login', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    
    // Vérifier les credentials dans la DB
    // Générer un JWT
    // Retourner le token
    
    $result = [
        'success' => true,
        'token' => 'generated_jwt_token',
        'refresh_token' => 'generated_refresh_token',
        'user' => [
            'id' => 1,
            'username' => $username,
            'email' => 'user@example.com'
        ]
    ];
    
    $response->getBody()->write(json_encode($result));
    return $response->withHeader('Content-Type', 'application/json');
});
```

#### 2. POST /auth/register
```php
$app->post('/auth/register', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    
    // Insérer dans access_requests
    // INSERT INTO access_requests (full_name, email, phone, company, reason)
    
    $result = [
        'success' => true,
        'message' => 'Demande envoyée avec succès'
    ];
    
    $response->getBody()->write(json_encode($result));
    return $response->withHeader('Content-Type', 'application/json');
});
```

#### 3. POST /access/emergency
```php
$app->post('/access/emergency', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    
    // Insérer dans emergency_requests
    
    $result = [
        'success' => true,
        'message' => 'Demande d\'urgence envoyée'
    ];
    
    $response->getBody()->write(json_encode($result));
    return $response->withHeader('Content-Type', 'application/json');
});
```

### Étape 3 : Configurer CORS

Dans votre API Slim, ajoutez ce middleware :

```php
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

// Gérer les requêtes OPTIONS
$app->options('/{routes:.+}', function ($request, $response) {
    return $response;
});
```

## 🧪 Tester l'intégration complète

### 1. Tester avec test-api.html

```bash
# Ouvrir test-api.html
# Cliquer sur "Tester l'inscription"
# Vérifier dans phpMyAdmin que la ligne est insérée dans access_requests
```

### 2. Tester avec curl

```bash
# Test de connexion
curl -X POST http://kasalali.alwaysdata.net/API_NSC1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Test d'inscription
curl -X POST http://kasalali.alwaysdata.net/API_NSC1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName":"John Doe",
    "email":"john@example.com",
    "phone":"0612345678",
    "company":"ACME",
    "reason":"Test"
  }'
```

### 3. Tester avec Postman

1. Importer cette collection :
   - URL : `http://kasalali.alwaysdata.net/API_NSC1`
   - Endpoints : `/auth/login`, `/auth/register`, `/access/emergency`

## ✅ Checklist de vérification

### Côté client (déjà fait ✅)
- [x] api-config.js créé et configuré
- [x] login.js modifié pour utiliser l'API
- [x] cardform.js modifié pour utiliser l'API
- [x] HTML mis à jour avec les scripts
- [x] Interface de test créée
- [x] Documentation complète

### Côté serveur (à faire)
- [ ] Base de données créée
- [ ] Endpoint /auth/login implémenté
- [ ] Endpoint /auth/register implémenté
- [ ] Endpoint /access/emergency implémenté
- [ ] CORS configuré
- [ ] JWT configuré
- [ ] Tests effectués

## 🐛 Problèmes courants

### Erreur CORS
**Symptôme** : "Access to fetch has been blocked by CORS policy"
**Solution** : Configurer CORS dans votre API (voir Étape 3)

### Erreur 404
**Symptôme** : "404 Not Found"
**Solution** : Vérifier que l'URL de l'API est correcte et que les routes existent

### Erreur Network
**Symptôme** : "Failed to fetch"
**Solution** : Vérifier que l'API est accessible et en ligne

### Token non stocké
**Symptôme** : Connexion réussie mais token null
**Solution** : Vérifier que l'API retourne bien `token` ou `access_token`

## 📚 Documentation complète

Pour plus de détails :
- **API_INTEGRATION.md** - Documentation technique complète
- **INTEGRATION_SUMMARY.md** - Résumé de l'intégration
- **README.md** - Vue d'ensemble du projet

## 🎯 Résultat attendu

Après avoir suivi ce guide :
1. ✅ Le client web peut se connecter à l'API
2. ✅ Les utilisateurs peuvent s'inscrire
3. ✅ Les demandes d'urgence fonctionnent
4. ✅ Les tokens sont gérés automatiquement

## 📞 Besoin d'aide ?

1. Ouvrez la console du navigateur (F12)
2. Vérifiez l'onglet Network pour voir les requêtes
3. Consultez la documentation dans API_INTEGRATION.md
4. Utilisez test-api.html pour déboguer

---

**Temps estimé** : 30-60 minutes pour l'implémentation serveur complète

Bon courage ! 🚀
