# NO KOMPLEX AI-PRODUCTOR
### IA Multilingue Haute Performance — Lesly Tech LLC

---

## 🚀 Installation locale

```bash
# 1. Cloner le repo
git clone https://github.com/TON-USERNAME/nokomplex-ai.git
cd nokomplex-ai

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env
# → Remplir les valeurs dans .env

# 4. Générer le hash admin (une seule fois)
node scripts/generate-admin-hash.js

# 5. Lancer en développement
npm start
```

---

## 🔐 Variables d'environnement Netlify

Dans **Netlify > Site Settings > Environment Variables**, ajouter :

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Clé API Claude (Anthropic) |
| `OPENAI_API_KEY` | Clé API OpenAI (optionnel) |
| `OPENWEATHER_API_KEY` | Clé API météo |
| `ADMIN_CODE_HASH` | Hash SHA-256 du code admin |
| `ADMIN_SALT` | Sel cryptographique |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe |
| `REACT_APP_URL` | URL de l'app en production |

---

## 📦 Déploiement Netlify

```bash
# Option A : Via GitHub (recommandé)
# 1. Push sur GitHub
git add . && git commit -m "Initial deploy" && git push

# 2. Netlify > New Site > Import from GitHub
# 3. Build command : npm run build
# 4. Publish directory : build
# 5. Ajouter les variables d'environnement
# 6. Deploy !

# Option B : Netlify CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## 📱 Play Store (Google TWA)

```bash
# Prérequis : Java + Android Studio installés
npm install -g @bubblewrap/cli

bubblewrap init --manifest https://TON-URL.netlify.app/manifest.json
bubblewrap build
# → Génère un APK signé prêt pour le Play Store
```

---

## 🏗️ Structure du projet

```
nokomplex-ai/
├── public/
│   ├── index.html          # HTML principal + balises PWA
│   ├── manifest.json       # Configuration PWA
│   └── service-worker.js   # Cache offline
├── src/
│   ├── App.jsx             # Composant principal
│   ├── index.js            # Point d'entrée
│   └── index.css           # Styles Tailwind
├── netlify/
│   └── functions/
│       ├── chat.js         # Proxy IA sécurisé
│       ├── admin.js        # Auth admin
│       └── weather.js      # Météo réelle
├── scripts/
│   └── generate-admin-hash.js
├── .env.example
├── netlify.toml
└── tailwind.config.js
```

---

## 📋 Plans tarifaires

| Plan | Messages | Prix |
|---|---|---|
| FREE | 5/session | Gratuit |
| PRO | 100/session | 19$/mois |
| ELITE | Illimité | 49$/mois |

© 2025 Lesly Tech LLC — Tous droits réservés
