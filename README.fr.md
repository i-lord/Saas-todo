# Application SaaS Todo

Une application Todo SaaS moderne et mono-utilisateur construite avec React, Redux Toolkit, Material-UI et Firebase. Dispose d'une interface utilisateur épurée avec mode sombre, gestion de projets/tâches et tests unitaires complets.

## ✨ Fonctionnalités

- **Gestion de Projets** : Créer et gérer plusieurs projets
- **Gestion de Tâches** : Opérations CRUD complètes pour les tâches avec suivi de statut
- **Interface Moderne** : Composants Material-UI avec support thème sombre/clair
- **Authentification** : Authentification Firebase avec connexion Google
- **Données Temps Réel** : Backend Firestore avec mises à jour en temps réel
- **Design Responsive** : Fonctionne sur ordinateur et mobile
- **Gestion d'Erreurs** : Messages d'erreur conviviaux pour toutes les erreurs API/réseau
- **Tests Unitaires** : Couverture de tests complète pour toute la logique principale et les composants

## 🚀 Démarrage

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn
- Projet Firebase avec Authentication et Firestore activés

### Installation

1. **Cloner le dépôt**
   ```bash
   git clone <votre-url-repo>
   cd saas-todo
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer Firebase**
   
   Créer un fichier `.env.local` à la racine du projet :
   ```env
   VITE_FIREBASE_API_KEY=votre_clé_api
   VITE_FIREBASE_AUTH_DOMAIN=votre_domaine_auth
   VITE_FIREBASE_PROJECT_ID=votre_id_projet
   VITE_FIREBASE_STORAGE_BUCKET=votre_bucket_storage
   VITE_FIREBASE_MESSAGING_SENDER_ID=votre_id_sender
   VITE_FIREBASE_APP_ID=votre_id_app
   VITE_FIREBASE_MEASUREMENT_ID=votre_id_measurement
   ```
   
   **⚠️ Important** : Ne jamais commiter `.env.local` dans le contrôle de version.

4. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Exécuter les tests**
   ```bash
   npm test
   ```

## 🏗️ Structure du Projet

```
src/
├── api/                 # Client Axios et configuration API
├── app/                 # Configuration du store Redux
├── components/          # Composants UI réutilisables
├── contexts/           # Contextes React (Auth, Theme)
├── features/           # Modules basés sur les fonctionnalités
│   ├── projects/       # Logique de gestion des projets
│   └── tasks/          # Logique de gestion des tâches
├── hooks/              # Hooks React personnalisés
├── pages/              # Composants de pages
├── services/           # Intégrations de services externes
├── utils/              # Fonctions utilitaires
└── routes.jsx          # Routage de l'application
```

## 🧪 Tests

Le projet inclut des tests unitaires complets pour :
- Slices Redux et thunks asynchrones
- Fonctions utilitaires
- Composants React
- Hooks personnalisés et contextes

**Exécuter tous les tests :**
```bash
npm test
```

**La couverture de tests inclut :**
- ✅ Toute la logique Redux (reducers, actions, thunks)
- ✅ Toutes les fonctions utilitaires
- ✅ Tous les composants UI principaux
- ✅ Hooks personnalisés et contextes
- ✅ Gestion d'erreurs et cas limites

## 🛠️ Stack Technique

- **Frontend** : React 18, Vite
- **Gestion d'État** : Redux Toolkit
- **Framework UI** : Material-UI (MUI)
- **Authentification** : Firebase Auth
- **Base de Données** : Firestore
- **Client HTTP** : Axios
- **Tests** : Jest, React Testing Library
- **Outil de Build** : Vite
- **Linting** : ESLint

## 📱 Scripts Disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Build pour la production
- `npm run preview` - Prévisualiser le build de production
- `npm test` - Exécuter les tests unitaires
- `npm run lint` - Exécuter ESLint

## 🎨 Fonctionnalités en Détail

### Authentification
- Intégration de connexion Google
- Routes protégées
- Gestion de session utilisateur

### Gestion de Projets
- Créer, voir et gérer des projets
- Filtrage de tâches spécifique au projet
- Changement rapide de projet

### Gestion de Tâches
- Créer, modifier et supprimer des tâches
- Suivi de statut des tâches (À faire, En cours, Terminé)
- Gestion des dates d'échéance
- Attribution de tâches

### UI/UX
- Support thème sombre et clair
- Design responsive
- Composants Material-UI modernes
- Navigation intuitive

## 🔧 Configuration

### Configuration Firebase
1. Créer un projet Firebase
2. Activer Authentication (fournisseur Google)
3. Activer Firestore Database
4. Ajouter votre configuration d'application web à `.env.local`

### Variables d'Environnement
Toutes les variables d'environnement doivent être préfixées avec `VITE_` pour être accessibles dans l'application React.

## 🤝 Contribution

1. Fork le dépôt
2. Créer une branche de fonctionnalité
3. Faire vos modifications
4. Ajouter des tests pour les nouvelles fonctionnalités
5. S'assurer que tous les tests passent
6. Soumettre une pull request

## 📄 Licence

Ce projet est sous licence MIT.

---

**Construit avec ❤️ en utilisant React, Redux et Firebase**
