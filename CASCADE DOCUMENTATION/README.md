# 📁 CASCADE DOCUMENTATION

Ce dossier contient toute la documentation technique de votre API et de l'intégration.

---

## 📄 Fichiers présents

### 🔧 Fichiers de votre API

#### **routesJWT.php**
- Routes d'authentification JWT de votre API
- Endpoint `POST /login` pour obtenir un token
- Credentials : `NSC1_API` / `Jone_Porte!87-/`

#### **routes.php**
- Routes CRUD de votre API
- Gestion des personnes, portes, logs, etc.
- Architecture DAO propre

#### **neo_door.sql**
- Script SQL complet de votre base de données
- Structure des tables
- Données de test
- Contraintes et index

#### **NSC1_BDD_SCHEMA.png**
- Schéma visuel de la base de données
- Relations entre les tables
- Types de données

---

### 📖 Documentation de l'intégration

#### **FINAL_SUMMARY.md** ⭐ COMMENCER ICI
- **Résumé complet de l'intégration**
- Comment ça fonctionne
- Mapping des données
- Tests à effectuer
- **Lecture recommandée en premier**

#### **ADAPTATION_NOTES.md**
- Détails techniques de l'adaptation
- Modifications apportées à `api-config.js`
- Méthodes adaptées
- Points importants

#### **TEST_GUIDE.md**
- Guide de test complet
- Tests rapides (5 minutes)
- Vérification dans la BDD
- Tests avec curl
- Résolution de problèmes

---

## 🚀 Par où commencer ?

### 1. **Comprendre l'intégration**
```
Lire : FINAL_SUMMARY.md
```
→ Vue d'ensemble complète de ce qui a été fait

### 2. **Comprendre les adaptations**
```
Lire : ADAPTATION_NOTES.md
```
→ Détails techniques de l'adaptation

### 3. **Tester le système**
```
Lire : TEST_GUIDE.md
```
→ Guide de test pas à pas

---

## 📊 Structure de votre API

### Endpoints disponibles

| Endpoint | Méthode | Description | Utilisé par le web |
|----------|---------|-------------|-------------------|
| `/login` | POST | Authentification JWT | ✅ Oui |
| `/personnes` | GET | Liste des personnes | ✅ Oui |
| `/personnes` | POST | Créer une personne | ✅ Oui (inscription) |
| `/personnes/{id}` | GET | Info d'une personne | ✅ Oui |
| `/personnes/{id}` | DELETE | Supprimer une personne | ❌ Non |
| `/acces_log` | GET | Liste des logs | ✅ Oui |
| `/acces_log` | POST | Créer un log | ✅ Oui (urgence) |
| `/portes` | POST | Créer une porte | ❌ Non |
| `/droit_acces` | POST | Créer un droit | ❌ Non |
| `/eleves` | POST | Créer un élève | ❌ Non |
| `/personnels` | POST | Créer un personnel | ❌ Non |
| `/roles` | POST | Créer un rôle | ❌ Non |

---

## 🗄️ Structure de votre base de données

### Tables principales

#### **personne**
- Stocke toutes les personnes (élèves, personnel, visiteurs)
- Champs : `id_personne`, `prenom`, `nom`, `email`, `organisation`, `motif_demande`, `telephone`, `type_personne`, `actif`
- **Utilisée pour les inscriptions web** (`type_personne = 'visiteur'`, `actif = 0`)

#### **acces_log**
- Logs de tous les accès et événements
- Champs : `id_log`, `id_personne`, `id_porte`, `ts_event`, `evenement`, `details` (JSON)
- **Utilisée pour les demandes d'urgence** (`evenement = 'ERREUR'`, `details` contient `type: 'DEMANDE_URGENCE'`)

#### **droit_acces**
- Droits d'accès des personnes aux portes
- Champs : `id_personne`, `id_porte`, `date_debut`, `date_fin`, `raison`

#### **porte**
- Informations sur les portes
- Champs : `id_porte`, `code_porte`, `nom`, `emplacement`, `description`, `actif`

#### **eleve** / **personnel**
- Tables d'extension pour les types spécifiques de personnes
- Lien avec `personne` via `id_personne`

#### **role** / **personne_role**
- Gestion des rôles et permissions
- Association many-to-many entre personnes et rôles

---

## 🔄 Flux de données

### Inscription web → Base de données

```
Formulaire web (cardform.html)
    ↓
{fullName, email, phone, company, reason}
    ↓
api-config.js (transformation)
    ↓
{prenom, nom, email, organisation, motif_demande, telephone, type_personne: 'visiteur', actif: 0}
    ↓
POST /personnes (avec JWT)
    ↓
DAO_personne->insert()
    ↓
INSERT INTO personne (...)
    ↓
Nouvelle ligne dans la table personne
```

### Demande d'urgence → Base de données

```
Bouton urgence (login.html)
    ↓
{reason: 'Demande d\'accès d\'urgence'}
    ↓
api-config.js (transformation)
    ↓
{id_personne: null, id_porte: null, evenement: 'ERREUR', details: JSON}
    ↓
POST /acces_log (avec JWT)
    ↓
DAO_acces_log->insert()
    ↓
INSERT INTO acces_log (...)
    ↓
Nouvelle ligne dans la table acces_log
```

---

## 🔐 Authentification

### JWT (JSON Web Token)

**Votre API utilise JWT pour l'authentification** :

1. **Obtenir un token**
   ```
   POST /login
   Body: {"username": "NSC1_API", "password": "Jone_Porte!87-/"}
   Response: {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
   ```

2. **Utiliser le token**
   ```
   GET /personnes
   Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Token stocké côté client**
   ```javascript
   localStorage.setItem('jwt_token', token);
   ```

---

## 📝 Requêtes SQL utiles

### Voir les demandes d'accès en attente
```sql
SELECT * FROM personne 
WHERE type_personne = 'visiteur' AND actif = 0
ORDER BY date_creation DESC;
```

### Voir les demandes d'urgence
```sql
SELECT * FROM acces_log 
WHERE evenement = 'ERREUR' 
AND JSON_EXTRACT(details, '$.type') = 'DEMANDE_URGENCE'
ORDER BY ts_event DESC;
```

### Approuver une demande
```sql
UPDATE personne SET actif = 1 WHERE id_personne = ?;
```

### Donner accès à une porte
```sql
INSERT INTO droit_acces (id_personne, id_porte, date_debut, raison)
VALUES (?, 1, NOW(), 'Demande approuvée');
```

---

## 🧪 Tests rapides

### Test 1 : API accessible
```bash
curl http://kasalali.alwaysdata.net/API_NSC1/
```

### Test 2 : Authentification JWT
```bash
curl -X POST http://kasalali.alwaysdata.net/API_NSC1/login \
  -H "Content-Type: application/json" \
  -d '{"username":"NSC1_API","password":"Jone_Porte!87-/"}'
```

### Test 3 : Interface web
```
Ouvrir : test-api.html
Cliquer : "Tester la connexion"
```

---

## 📚 Documentation complète

### Dans le dossier parent
- **README.md** - Vue d'ensemble du projet
- **API_INTEGRATION.md** - Documentation API détaillée
- **INTEGRATION_SUMMARY.md** - Résumé de l'intégration
- **QUICK_START.md** - Guide de démarrage rapide
- **FILES_OVERVIEW.md** - Vue d'ensemble des fichiers

### Dans ce dossier (CASCADE DOCUMENTATION)
- **FINAL_SUMMARY.md** - Résumé final complet ⭐
- **ADAPTATION_NOTES.md** - Notes d'adaptation technique
- **TEST_GUIDE.md** - Guide de test complet
- **README.md** - Ce fichier

---

## ✅ État du projet

| Composant | Statut |
|-----------|--------|
| **API REST** | ✅ Fonctionnelle |
| **Base de données** | ✅ Opérationnelle |
| **Authentification JWT** | ✅ Implémentée |
| **Client web** | ✅ Adapté et fonctionnel |
| **Intégration** | ✅ 100% terminée |

---

## 🎯 Prochaines étapes (optionnel)

### Améliorations possibles

1. **Interface d'administration**
   - Page pour approuver les demandes
   - Gestion des droits d'accès
   - Consultation des logs

2. **Notifications**
   - Email lors d'une nouvelle demande
   - SMS pour les urgences

3. **Authentification multi-utilisateurs**
   - Ajouter `password_hash` dans `personne`
   - Login avec email/password

4. **Dashboard**
   - Statistiques d'accès
   - Graphiques des demandes
   - Monitoring en temps réel

---

## 📞 Support

Pour toute question :
1. Consulter `FINAL_SUMMARY.md`
2. Consulter `TEST_GUIDE.md`
3. Vérifier la console du navigateur (F12)
4. Vérifier les logs de l'API

---

© 2025 NSC1 - Système de porte sécurisée
