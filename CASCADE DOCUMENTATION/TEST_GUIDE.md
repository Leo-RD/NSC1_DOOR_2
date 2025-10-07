# 🧪 Guide de test - Intégration API NSC1

## ⚡ Tests rapides (5 minutes)

### Test 1 : Interface de test (Recommandé)

1. **Ouvrir le fichier**
   ```
   test-api.html
   ```

2. **Vérifier l'état**
   - État de connexion : "Non connecté"
   - URL API : `http://kasalali.alwaysdata.net/API_NSC1`

3. **Test de connexion**
   - Cliquer sur "🔐 Tester la connexion"
   - Résultat attendu : `{"success": true, "token": "eyJ..."}`
   - État devient : "Connecté ✓"

4. **Test d'inscription**
   - Remplir les champs (valeurs pré-remplies)
   - Cliquer sur "📝 Tester l'inscription"
   - Résultat attendu : `{"success": true, "data": {"id": ...}}`

5. **Test d'urgence**
   - Cliquer sur "🚨 Tester demande d'urgence"
   - Résultat attendu : `{"success": true, "message": "..."}`

6. **Vérifier les tokens**
   - Cliquer sur "🔍 Vérifier les tokens"
   - Voir le JWT stocké

---

### Test 2 : Page de connexion

1. **Ouvrir le fichier**
   ```
   login.html
   ```

2. **Ouvrir la console**
   - Appuyer sur `F12`
   - Aller dans l'onglet "Console"

3. **Tester la connexion**
   - Cliquer sur le bouton "Ouvrir"
   - Observer dans la console :
     ```
     Connexion...
     Token obtenu
     ```

4. **Vérifier dans Network**
   - Onglet "Network" (F12)
   - Voir la requête `POST /login`
   - Status : `200 OK`
   - Response : `{"token": "eyJ..."}`

5. **Vérifier le localStorage**
   - Console (F12) :
     ```javascript
     localStorage.getItem('jwt_token')
     // → "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     ```

---

### Test 3 : Page d'inscription

1. **Ouvrir le fichier**
   ```
   cardform.html
   ```

2. **Remplir le formulaire**
   - Nom complet : `John Doe`
   - Email : `john.doe@example.com`
   - Téléphone : `0612345678`
   - Entreprise : `ACME Corp`
   - Motif : `Test d'inscription`
   - Cocher la case de consentement

3. **Soumettre**
   - Cliquer sur "Envoyer la demande"
   - Message attendu : "✓ Demande envoyée avec succès !"

4. **Vérifier dans la console (F12)**
   ```
   POST /personnes
   Status: 200 OK
   Response: {"id": 2}
   ```

---

## 🗄️ Vérification dans la base de données

### Connexion à phpMyAdmin

1. **Ouvrir phpMyAdmin**
   ```
   https://phpmyadmin.alwaysdata.com
   ```

2. **Se connecter**
   - Login : `kasalali`
   - Password : `Blorboblibus`

3. **Sélectionner la base**
   - Base de données : `neo_door`

---

### Vérifier les inscriptions

**SQL à exécuter** :
```sql
SELECT 
    id_personne,
    CONCAT(prenom, ' ', nom) as nom_complet,
    email,
    organisation,
    motif_demande,
    telephone,
    type_personne,
    actif,
    date_creation
FROM personne 
WHERE type_personne = 'visiteur'
ORDER BY date_creation DESC
LIMIT 10;
```

**Résultat attendu** :
```
id_personne | nom_complet | email              | organisation | type_personne | actif
------------|-------------|--------------------|--------------|--------------|---------
2           | John Doe    | john.doe@...       | ACME Corp    | visiteur     | 0
```

**Note** : `actif = 0` signifie que la demande est en attente d'approbation.

---

### Vérifier les demandes d'urgence

**SQL à exécuter** :
```sql
SELECT 
    id_log,
    id_personne,
    id_porte,
    ts_event,
    evenement,
    details
FROM acces_log 
WHERE evenement = 'ERREUR'
ORDER BY ts_event DESC
LIMIT 10;
```

**Résultat attendu** :
```
id_log | evenement | details
-------|-----------|--------------------------------------------------
3      | ERREUR    | {"type":"DEMANDE_URGENCE","reason":"...","source":"web_interface"}
```

**Pour voir le contenu JSON** :
```sql
SELECT 
    id_log,
    ts_event,
    JSON_EXTRACT(details, '$.type') as type,
    JSON_EXTRACT(details, '$.reason') as reason,
    JSON_EXTRACT(details, '$.source') as source
FROM acces_log 
WHERE JSON_EXTRACT(details, '$.type') = 'DEMANDE_URGENCE'
ORDER BY ts_event DESC;
```

---

## 🔧 Tests avec curl

### Test 1 : Authentification JWT

```bash
curl -X POST http://kasalali.alwaysdata.net/API_NSC1/login \
  -H "Content-Type: application/json" \
  -d '{"username":"NSC1_API","password":"Jone_Porte!87-/"}'
```

**Résultat attendu** :
```json
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

---

### Test 2 : Créer une personne

**Étape 1 : Obtenir le token**
```bash
TOKEN=$(curl -s -X POST http://kasalali.alwaysdata.net/API_NSC1/login \
  -H "Content-Type: application/json" \
  -d '{"username":"NSC1_API","password":"Jone_Porte!87-/"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo $TOKEN
```

**Étape 2 : Créer la personne**
```bash
curl -X POST http://kasalali.alwaysdata.net/API_NSC1/personnes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "prenom": "Jane",
    "nom": "Smith",
    "email": "jane.smith@example.com",
    "organisation": "Test Corp",
    "motif_demande": "Test via curl",
    "telephone": "0698765432",
    "type_personne": "visiteur",
    "actif": 0
  }'
```

**Résultat attendu** :
```json
{"id":3}
```

---

### Test 3 : Créer un log d'urgence

```bash
curl -X POST http://kasalali.alwaysdata.net/API_NSC1/acces_log \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id_personne": null,
    "id_porte": null,
    "evenement": "ERREUR",
    "lecteur_uid": null,
    "details": "{\"type\":\"DEMANDE_URGENCE\",\"reason\":\"Test curl\",\"source\":\"curl_test\"}"
  }'
```

**Résultat attendu** :
```json
{"status":"log ajouté"}
```

---

## 🐛 Résolution de problèmes

### Erreur : CORS

**Symptôme** :
```
Access to fetch at 'http://...' has been blocked by CORS policy
```

**Solution** :
Ajouter dans votre API (routes.php ou middleware.php) :
```php
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});
```

---

### Erreur : 401 Unauthorized

**Symptôme** :
```
POST /personnes → 401 Unauthorized
```

**Cause** : Token JWT manquant ou expiré

**Solution** :
1. Vérifier que le token est stocké :
   ```javascript
   console.log(localStorage.getItem('jwt_token'));
   ```

2. Obtenir un nouveau token :
   ```javascript
   await apiClient.login();
   ```

---

### Erreur : Network Error

**Symptôme** :
```
Failed to fetch
```

**Causes possibles** :
1. API non accessible
2. URL incorrecte
3. Problème de connexion internet

**Vérification** :
```bash
# Tester si l'API répond
curl http://kasalali.alwaysdata.net/API_NSC1/

# Devrait afficher le poème "Yesterday, upon the stair..."
```

---

### Erreur : Token null

**Symptôme** :
```javascript
apiClient.token // → null
```

**Solution** :
```javascript
// Forcer l'obtention d'un nouveau token
await apiClient.getAPIToken();

// Vérifier
console.log(apiClient.token);
```

---

## ✅ Checklist de test

### Tests fonctionnels
- [ ] Connexion via `login.html` fonctionne
- [ ] Token JWT est stocké dans localStorage
- [ ] Inscription via `cardform.html` fonctionne
- [ ] Nouvelle personne créée dans la BDD
- [ ] Bouton d'urgence fonctionne
- [ ] Log d'urgence créé dans la BDD

### Tests techniques
- [ ] `test-api.html` - Tous les tests passent
- [ ] Console (F12) - Pas d'erreurs
- [ ] Network (F12) - Requêtes en 200 OK
- [ ] localStorage - Token présent
- [ ] phpMyAdmin - Données insérées

### Tests API
- [ ] `curl POST /login` retourne un token
- [ ] `curl POST /personnes` crée une personne
- [ ] `curl POST /acces_log` crée un log
- [ ] CORS configuré (pas d'erreur)

---

## 📊 Résultats attendus

### Après tous les tests

**Dans la table `personne`** :
- Au moins 2-3 nouvelles personnes
- `type_personne = 'visiteur'`
- `actif = 0`

**Dans la table `acces_log`** :
- Au moins 1-2 logs d'urgence
- `evenement = 'ERREUR'`
- `details` contient `"type":"DEMANDE_URGENCE"`

**Dans localStorage** :
- `jwt_token` présent
- `user_info` présent

---

## 🎯 Test complet (script)

Copiez-collez dans la console du navigateur (F12) :

```javascript
// Test complet de l'intégration
async function testComplet() {
    console.log('🧪 Début des tests...\n');
    
    // Test 1 : Connexion
    console.log('1️⃣ Test de connexion...');
    const loginResult = await apiClient.login();
    console.log('✅ Connexion:', loginResult.success ? 'OK' : 'ERREUR');
    console.log('Token:', apiClient.token ? 'Présent' : 'Absent');
    
    // Test 2 : Inscription
    console.log('\n2️⃣ Test d\'inscription...');
    const registerResult = await apiClient.register({
        fullName: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        phone: '0612345678',
        company: 'Test Corp',
        reason: 'Test automatique'
    });
    console.log('✅ Inscription:', registerResult.success ? 'OK' : 'ERREUR');
    
    // Test 3 : Urgence
    console.log('\n3️⃣ Test d\'urgence...');
    const emergencyResult = await apiClient.emergencyAccess('Test urgence automatique');
    console.log('✅ Urgence:', emergencyResult.success ? 'OK' : 'ERREUR');
    
    // Test 4 : Récupération des données
    console.log('\n4️⃣ Test de récupération...');
    const personnes = await apiClient.getAllPersonnes();
    console.log('✅ Personnes:', personnes.success ? `${personnes.data.length} trouvées` : 'ERREUR');
    
    const logs = await apiClient.getAccessLogs();
    console.log('✅ Logs:', logs.success ? `${logs.data.length} trouvés` : 'ERREUR');
    
    console.log('\n🎉 Tests terminés !');
}

// Lancer les tests
testComplet();
```

---

## 📞 Support

Si un test échoue :
1. Vérifier la console (F12) pour les erreurs
2. Vérifier l'onglet Network pour les requêtes
3. Consulter `ADAPTATION_NOTES.md` pour les détails
4. Vérifier que l'API est accessible

---

© 2025 NSC1 - Système de porte sécurisée
