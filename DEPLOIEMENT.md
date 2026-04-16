# 🚀 GUIDE DE DÉPLOIEMENT — NO KOMPLEX AI-PRODUCTOR
### Netlify + Stripe — Lesly Tech LLC

---

## ÉTAPE 1 — Préparer ton compte Stripe

### 1.1 Créer les produits Stripe

1. Va sur https://dashboard.stripe.com
2. Clique sur **Produits** → **Ajouter un produit**
3. Crée le plan **PRO** :
   - Nom : `NO KOMPLEX AI Pro`
   - Prix : `19.00 USD` / mois (récurrent)
   - Copie le **Price ID** → ressemble à `price_1Abc...`
4. Crée le plan **ELITE** :
   - Nom : `NO KOMPLEX AI Élite`
   - Prix : `49.00 USD` / mois (récurrent)
   - Copie le **Price ID**

### 1.2 Récupérer tes clés Stripe

Dans **Développeurs → Clés API** :
- Copie la **Clé secrète** : `sk_live_...` (ou `sk_test_...` pour tester)

---

## ÉTAPE 2 — Générer le hash admin

Sur ta machine, dans le dossier du projet :

```bash
node scripts/generate-admin-hash.js
```

Entre ton code secret quand demandé.
Copie les deux valeurs générées :
- `ADMIN_CODE_HASH=...`
- `ADMIN_SALT=...`

---

## ÉTAPE 3 — Pousser sur GitHub

```bash
# Dans le dossier nokomplex-ai/
git init
git add .
git commit -m "🚀 NO KOMPLEX AI-PRODUCTOR — Initial deploy"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/nokomplex-ai.git
git push -u origin main
```

---

## ÉTAPE 4 — Déployer sur Netlify

1. Va sur https://app.netlify.com
2. Clique **Add new site** → **Import an existing project**
3. Sélectionne **GitHub** → choisis ton repo `nokomplex-ai`
4. Vérifie les paramètres de build :
   - **Build command** : `npm run build`
   - **Publish directory** : `build`
5. Clique **Deploy site**

---

## ÉTAPE 5 — Ajouter les variables d'environnement

Dans **Netlify → Site settings → Environment variables** :

| Variable                  | Valeur                          |
|---------------------------|---------------------------------|
| `ANTHROPIC_API_KEY`       | `sk-ant-...`                    |
| `OPENAI_API_KEY`          | `sk-...` (optionnel)            |
| `OPENWEATHER_API_KEY`     | Clé OpenWeatherMap              |
| `ADMIN_CODE_HASH`         | Valeur générée à l'étape 2      |
| `ADMIN_SALT`              | Valeur générée à l'étape 2      |
| `STRIPE_SECRET_KEY`       | `sk_live_...`                   |
| `STRIPE_WEBHOOK_SECRET`   | (rempli à l'étape 6)            |
| `STRIPE_PRO_PRICE_ID`     | `price_...` (plan PRO)          |
| `STRIPE_ELITE_PRICE_ID`   | `price_...` (plan ELITE)        |
| `REACT_APP_URL`           | `https://ton-app.netlify.app`   |

Après avoir tout ajouté → **Trigger deploy** pour redéployer.

---

## ÉTAPE 6 — Configurer le Webhook Stripe

1. Dans Stripe → **Développeurs → Webhooks**
2. Clique **Ajouter un endpoint**
3. URL : `https://ton-app.netlify.app/.netlify/functions/stripe-webhook`
4. Événements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copie le **Signing secret** → colle-le dans `STRIPE_WEBHOOK_SECRET` sur Netlify
6. Redéploie une dernière fois

---

## ÉTAPE 7 — Vérifier que tout fonctionne

✅ Ouvre ton URL Netlify → l'app se charge
✅ Envoie un message → l'IA répond (Claude)
✅ Teste le Bluetooth / météo / export
✅ Entre ton code admin → panneau s'ouvre
✅ Clique Améliorer → redirection Stripe
✅ Paiement test avec carte `4242 4242 4242 4242`

---

## ÉTAPE 8 — Play Store (Google TWA)

Une fois l'app stable sur Netlify :

```bash
# Installer les outils
npm install -g @bubblewrap/cli

# Initialiser le TWA depuis ton manifest
bubblewrap init --manifest https://ton-app.netlify.app/manifest.json

# Builder l'APK
bubblewrap build
```

L'APK généré est prêt pour la soumission sur Google Play Console.

---

## 🔑 Récapitulatif des clés à obtenir

| Service         | Où s'inscrire                        | Gratuit ? |
|-----------------|--------------------------------------|-----------|
| Anthropic       | https://console.anthropic.com        | Crédit offert |
| OpenWeatherMap  | https://openweathermap.org/api       | ✅ Oui    |
| Stripe          | https://dashboard.stripe.com         | ✅ Oui (commission sur ventes) |
| OpenAI          | https://platform.openai.com          | Crédit offert |

---

© 2025 Lesly Tech LLC — Confidentiel
