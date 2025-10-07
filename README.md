# NSC1-SECURE-DOOR – Site Web

Ce dépôt contient **uniquement la partie site web** du projet de porte sécurisée via NFC.  
Le site a été développé en **HTML, CSS et JavaScript** avec intégration API REST.

## Nouveautés

Intégration API REST complète
- Authentification JWT
- Gestion des inscriptions/demandes d'accès
- Système de demandes d'urgence
- Refresh automatique des tokens

## Structure du site

- **Page d'accueil** (`homepage.html`)  
  Présentation du projet et navigation vers les autres pages.

- **Page de connexion** (`login.html`)  
  Formulaire de login pour les utilisateurs autorisés avec authentification API.

- **Page d'inscription** (`cardform.html`)  
  Formulaire d'inscription pour enregistrer de nouveaux utilisateurs via API.

- **Configuration API** (`api-config.js`)  
  Client API centralisé avec gestion JWT automatique.

## Technologies utilisées

- **HTML5** : structure des pages  
- **CSS3** : mise en forme et design  
- **JavaScript ES6+** : logique côté client et interactions
- **API REST** : PHP Slim Framework
- **JWT** : Authentification sécurisée

## API Configuration

L'application est connectée à une API REST PHP Slim :
- **URL** : `http://kasalali.alwaysdata.net/API_NSC1`
- **Authentification** : JWT (JSON Web Tokens)
- **Endpoints** : Login, Register, Emergency Access, User Info

Pour plus de détails sur l'intégration API, consultez [API_INTEGRATION.md](./API_INTEGRATION.md)

## Installation et utilisation

1. Cloner le dépôt
2. Ouvrir `index.html` dans un navigateur (redirige vers `homepage.html`)
3. Les credentials API sont configurés dans `api-config.js`

### Configuration (Production)

Pour la production, créer un fichier `.env` basé sur `.env.example` et adapter les credentials.

## Structure des fichiers

```
NSC1_DOOR_2/
├── index.html              # Point d'entrée (redirection)
├── homepage.html           # Page d'accueil
├── login.html              # Page de connexion
├── cardform.html           # Formulaire de demande d accès
├── style.css               # Styles globaux
├── login.js                # Logique de connexion + API
├── cardform.js             # Logique formulaire + API
├── homepage.js             # Logique page d accueil
├── api-config.js           # Client API et configuration JWT
├── API_INTEGRATION.md      # Documentation complète de l'API
├── .env.example            # Exemple de configuration
└── ASSETS/                 # Ressources (images, etc.)
```

## Sécurité

- Authentification JWT avec refresh automatique
- Tokens stockés dans localStorage
- Gestion des sessions expirées
- Important : Pour la production, utiliser HTTPS et des variables d'environnement

## Tests

### Tester la connexion
1. Ouvrir `login.html`
2. Entrer des identifiants valides
3. Vérifier dans la console (F12) les appels API

### Tester l'inscription
1. Ouvrir `cardform.html`
2. Remplir le formulaire complet
3. Soumettre et vérifier la réponse

### Déboguer
```javascript
// Console du navigateur (F12)
console.log(apiClient.token);           // Token actuel
console.log(apiClient.isAuthenticated()); // État de connexion
```

## Documentation

- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Documentation complète de l'intégration API
- Endpoints disponibles
- Exemples de requêtes/réponses
- Structure de base de données suggérée
- Guide de débogage

## Dépôt principal du projet

Ce dépôt fait partie d'un projet plus large.  
Le dépôt master, contenant l'ensemble des composants (dont la gestion NFC), est disponible ici :  
[NSC1-MasterRepo](https://github.com/Leo-RD/NSC1-MasterRepo)

## Support

- Email : support@nsc1.com
- Urgences : 01 23 45 67 89

---

 2025 Léo-RD
