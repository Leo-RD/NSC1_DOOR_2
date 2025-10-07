# 📝 Notes d'adaptation - Intégration API NSC1

## ✅ Adaptation terminée

L'intégration côté client a été **adaptée pour correspondre exactement à votre API existante** sans la modifier.

---

## 🔄 Modifications apportées à `api-config.js`

### 1. **Endpoints adaptés**

#### Avant (générique) :
```javascript
ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    EMERGENCY: '/access/emergency'
}
```

#### Après (adapté à votre API) :
```javascript
ENDPOINTS: {
    LOGIN: '/login',                    // Votre endpoint JWT existant
    PERSONNES: '/personnes',            // CRUD personnes
    ACCES_LOG: '/acces_log',           // Logs d'accès
    REGISTER: '/personnes',             // Utilise POST /personnes
    EMERGENCY: '/acces_log'             // Utilise POST /acces_log
}
```

---

### 2. **Méthode `login()` adaptée**

**Votre API** : Authentification JWT avec credentials fixes (`NSC1_API` / `Jone_Porte!87-/`)

**Adaptation** :
- Appelle `POST /login` avec les credentials API
- Récupère le token JWT
- Stocke le token pour les requêtes suivantes
- Les champs username/password du formulaire sont ignorés (car votre API n'a qu'un seul utilisateur JWT)

```javascript
// Le formulaire de login obtient simplement le token JWT
const token = await this.getAPIToken();
```

---

### 3. **Méthode `register()` adaptée**

**Votre API** : `POST /personnes` pour créer une personne

**Adaptation** :
- Transforme les données du formulaire web en format `personne`
- Mappe les champs :
  - `fullName` → `prenom` + `nom`
  - `email` → `email`
  - `company` → `organisation`
  - `reason` → `motif_demande`
  - `phone` → `telephone`
- Définit `type_personne: 'visiteur'`
- Définit `actif: 0` (inactif, en attente d'approbation)

```javascript
const personneData = {
    prenom: userData.fullName.split(' ')[0],
    nom: userData.fullName.split(' ').slice(1).join(' '),
    email: userData.email,
    organisation: userData.company,
    motif_demande: userData.reason,
    telephone: userData.phone,
    type_personne: 'visiteur',
    actif: 0
};
```

---

### 4. **Méthode `emergencyAccess()` adaptée**

**Votre API** : `POST /acces_log` pour enregistrer un log

**Adaptation** :
- Crée un log d'accès avec `evenement: 'ERREUR'`
- Stocke les détails dans le champ JSON `details`
- Permet de tracer les demandes d'urgence

```javascript
const logData = {
    id_personne: null,
    id_porte: null,
    evenement: 'ERREUR',
    lecteur_uid: null,
    details: JSON.stringify({
        type: 'DEMANDE_URGENCE',
        reason: reason,
        timestamp: new Date().toISOString(),
        source: 'web_interface'
    })
};
```

---

### 5. **Nouvelles méthodes ajoutées**

Pour exploiter votre API existante :

#### `getAllPersonnes()`
```javascript
// Récupère toutes les personnes via GET /personnes
const result = await apiClient.getAllPersonnes();
```

#### `getUserInfo(id_personne)`
```javascript
// Récupère une personne spécifique via GET /personnes/{id}
const result = await apiClient.getUserInfo(1);
```

#### `getAccessLogs()`
```javascript
// Récupère les logs d'accès via GET /acces_log
const result = await apiClient.getAccessLogs();
```

---

## 🎯 Fonctionnement actuel

### Page de connexion (`login.html`)

1. **Utilisateur clique sur "Ouvrir"**
2. Le client obtient un token JWT via `POST /login`
3. Le token est stocké dans localStorage
4. L'utilisateur est redirigé vers `homepage.html`

**Note** : Les champs username/password du formulaire ne sont pas utilisés car votre API utilise des credentials fixes.

---

### Page d'inscription (`cardform.html`)

1. **Utilisateur remplit le formulaire**
   - Nom complet
   - Email
   - Téléphone
   - Entreprise
   - Motif de la demande

2. **Soumission du formulaire**
   - Les données sont transformées au format `personne`
   - Appel à `POST /personnes` avec le token JWT
   - Une nouvelle personne est créée dans la base de données

3. **Résultat dans la base de données** :
```sql
INSERT INTO personne (
    prenom, nom, email, organisation, 
    motif_demande, telephone, 
    type_personne, actif
) VALUES (
    'John', 'Doe', 'john@example.com', 'ACME Corp',
    'Demande d\'accès pour maintenance', '0612345678',
    'visiteur', 0
);
```

---

### Bouton d'urgence

1. **Utilisateur clique sur "Demande d'accès"**
2. Appel à `POST /acces_log` avec un log spécial
3. Un log est créé avec `evenement: 'ERREUR'` et les détails en JSON

**Résultat dans la base de données** :
```sql
INSERT INTO acces_log (
    id_personne, id_porte, evenement, details
) VALUES (
    NULL, NULL, 'ERREUR', 
    '{"type":"DEMANDE_URGENCE","reason":"...","source":"web_interface"}'
);
```

---

## 🔍 Vérification dans la base de données

### Voir les demandes d'accès (inscriptions)
```sql
SELECT * FROM personne 
WHERE type_personne = 'visiteur' 
AND actif = 0
ORDER BY date_creation DESC;
```

### Voir les demandes d'urgence
```sql
SELECT * FROM acces_log 
WHERE evenement = 'ERREUR'
AND details LIKE '%DEMANDE_URGENCE%'
ORDER BY ts_event DESC;
```

### Approuver une demande d'accès
```sql
-- Activer la personne
UPDATE personne 
SET actif = 1 
WHERE id_personne = ?;

-- Optionnel : Donner des droits d'accès à une porte
INSERT INTO droit_acces (id_personne, id_porte, date_debut, raison)
VALUES (?, ?, NOW(), 'Demande approuvée');
```

---

## 🧪 Tests effectués

### ✅ Test 1 : Obtention du token JWT
```javascript
const token = await apiClient.getAPIToken();
console.log(token); // Affiche le JWT
```

### ✅ Test 2 : Inscription d'une personne
```javascript
const result = await apiClient.register({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '0612345678',
    company: 'ACME Corp',
    reason: 'Test d\'inscription'
});
console.log(result.success); // true
```

### ✅ Test 3 : Demande d'urgence
```javascript
const result = await apiClient.emergencyAccess('Urgence test');
console.log(result.success); // true
```

---

## 📊 Mapping des données

### Formulaire web → Table `personne`

| Champ formulaire | Champ BDD | Type | Notes |
|------------------|-----------|------|-------|
| `fullName` | `prenom` + `nom` | VARCHAR | Séparé au premier espace |
| `email` | `email` | VARCHAR(100) | Unique |
| `phone` | `telephone` | VARCHAR(20) | - |
| `company` | `organisation` | VARCHAR(100) | - |
| `reason` | `motif_demande` | VARCHAR(512) | - |
| - | `type_personne` | ENUM | Fixé à 'visiteur' |
| - | `actif` | TINYINT(1) | Fixé à 0 (inactif) |
| - | `date_creation` | TIMESTAMP | Auto |

---

## ⚠️ Points importants

### 1. **Authentification simplifiée**
Votre API utilise un seul utilisateur JWT (`NSC1_API`). Le formulaire de login obtient simplement ce token. Pour une vraie authentification multi-utilisateurs, il faudrait :
- Ajouter un champ `password_hash` dans la table `personne`
- Modifier `routesJWT.php` pour vérifier les credentials dans la base de données

### 2. **Pas de refresh token**
Votre API ne gère pas les refresh tokens. Si le token expire, le client en génère un nouveau automatiquement avec les credentials API.

### 3. **Demandes en attente**
Les nouvelles inscriptions sont créées avec `actif = 0`. Vous devez les approuver manuellement dans la base de données ou créer une interface d'administration.

### 4. **Demandes d'urgence**
Les demandes d'urgence sont stockées dans `acces_log` avec `evenement = 'ERREUR'`. Vous pouvez les consulter via :
```javascript
const logs = await apiClient.getAccessLogs();
const urgences = logs.data.filter(log => {
    try {
        const details = JSON.parse(log.details);
        return details.type === 'DEMANDE_URGENCE';
    } catch {
        return false;
    }
});
```

---

## 🚀 Utilisation

### Dans le navigateur
```javascript
// Connexion (obtient le token JWT)
await apiClient.login();

// Inscription
await apiClient.register({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '0612345678',
    company: 'ACME Corp',
    reason: 'Demande d\'accès'
});

// Urgence
await apiClient.emergencyAccess('Besoin d\'aide');

// Récupérer toutes les personnes
const personnes = await apiClient.getAllPersonnes();

// Récupérer les logs
const logs = await apiClient.getAccessLogs();
```

---

## ✅ Résultat

L'intégration est **100% compatible** avec votre API existante. Aucune modification de l'API n'est nécessaire. Le client web peut maintenant :

- ✅ S'authentifier via JWT
- ✅ Créer des demandes d'accès (nouvelles personnes)
- ✅ Enregistrer des demandes d'urgence
- ✅ Consulter les personnes et les logs

---

© 2025 NSC1 - Système de porte sécurisée
