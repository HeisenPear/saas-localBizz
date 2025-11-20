# 🚀 Guide de Déploiement Vercel - LocalBiz Engine

Ce guide vous explique comment déployer votre application LocalBiz Engine sur Vercel avec déploiement automatique depuis GitHub.

## 📋 Prérequis

- Un compte GitHub (gratuit)
- Un compte Vercel (gratuit) - https://vercel.com
- Votre projet Supabase configuré
- Vos clés Stripe prêtes

## 🔧 Étape 1 : Initialiser Git et Pousser sur GitHub

### 1.1 Initialiser Git (si ce n'est pas déjà fait)

```bash
cd /Users/antoine/Desktop/Antoine/code/SAAS\ LocalBizz/saas-localBizz
git init
git add .
git commit -m "Initial commit - LocalBiz Engine"
```

### 1.2 Créer un dépôt GitHub

1. Allez sur https://github.com
2. Cliquez sur le **+** en haut à droite → **New repository**
3. Remplissez :
   - **Repository name** : `localbiz-engine` (ou le nom de votre choix)
   - **Description** : "SaaS platform for French local businesses"
   - **Visibility** : Private (recommandé pour un projet commercial)
4. **NE COCHEZ PAS** "Add a README" (vous en avez déjà un)
5. Cliquez sur **Create repository**

### 1.3 Pousser le code sur GitHub

Copiez les commandes affichées par GitHub et exécutez-les :

```bash
git remote add origin https://github.com/VOTRE-USERNAME/localbiz-engine.git
git branch -M main
git push -u origin main
```

## 🌐 Étape 2 : Déployer sur Vercel

### 2.1 Connecter votre projet à Vercel

1. Allez sur **https://vercel.com**
2. Cliquez sur **"Log in"** et connectez-vous avec **GitHub**
3. Cliquez sur **"Add New..."** → **"Project"**
4. Dans la liste, trouvez **"localbiz-engine"** et cliquez sur **"Import"**

### 2.2 Configurer le projet

Vercel détectera automatiquement que c'est un projet Next.js. Vérifiez :

- **Framework Preset** : Next.js
- **Root Directory** : `./` (racine)
- **Build Command** : `npm run build`
- **Output Directory** : `.next`
- **Install Command** : `npm install`

### 2.3 Ajouter les variables d'environnement

⚠️ **TRÈS IMPORTANT** : Ajoutez toutes vos variables d'environnement dans Vercel :

Cliquez sur **"Environment Variables"** et ajoutez :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://scgubtrkpqchpvvzgkpx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_b3VUqAokoI95X7NyZQjN7A_TIP8AFK_
SUPABASE_SERVICE_ROLE_KEY=sb_secret_fvKwIgrrt7iqOxMOmapUvA_JDbyHCbF

# Stripe (à configurer après avoir créé les produits Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_ESSENTIAL=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_PREMIUM=price_...

# Resend (optionnel pour les emails)
RESEND_API_KEY=re_...

# App URL (sera fourni par Vercel après le déploiement)
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
```

**Pour chaque variable** :
- Nom : `NEXT_PUBLIC_SUPABASE_URL`
- Valeur : `https://scgubtrkpqchpvvzgkpx.supabase.co`
- Environnements : Cochez **Production**, **Preview**, et **Development**

### 2.4 Lancer le déploiement

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes que Vercel build et déploie votre application
3. ✅ Une fois terminé, vous verrez : **"Your project is ready!"**

## 🔗 Étape 3 : Configurer l'URL de l'application

### 3.1 Récupérer votre URL Vercel

Après le déploiement, Vercel vous donne une URL comme :
```
https://localbiz-engine.vercel.app
```

### 3.2 Mettre à jour la variable d'environnement

1. Dans Vercel, allez dans **Settings** → **Environment Variables**
2. Trouvez `NEXT_PUBLIC_APP_URL`
3. Remplacez la valeur par votre URL Vercel : `https://localbiz-engine.vercel.app`
4. Cliquez sur **Save**

### 3.3 Redéployer

1. Allez dans **Deployments**
2. Cliquez sur les **...** du dernier déploiement
3. Cliquez sur **"Redeploy"**

## ⚙️ Étape 4 : Configurer les Callbacks Supabase

Maintenant que votre app est en ligne, configurez les URLs de callback :

1. Allez dans votre **Dashboard Supabase**
2. **Authentication** → **URL Configuration**
3. Ajoutez dans **"Redirect URLs"** :
   ```
   https://localbiz-engine.vercel.app/auth/callback
   ```
4. Dans **"Site URL"** :
   ```
   https://localbiz-engine.vercel.app
   ```

## 🔄 Étape 5 : Configurer les Webhooks Stripe

### 5.1 Créer un Webhook Endpoint

1. Allez dans votre **Dashboard Stripe**
2. **Developers** → **Webhooks**
3. Cliquez sur **"Add endpoint"**
4. URL à écouter :
   ```
   https://localbiz-engine.vercel.app/api/webhooks/stripe
   ```
5. Sélectionnez les événements :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Cliquez sur **"Add endpoint"**

### 5.2 Récupérer le Webhook Secret

1. Cliquez sur le webhook que vous venez de créer
2. Dans la section **"Signing secret"**, cliquez sur **"Reveal"**
3. Copiez la valeur : `whsec_...`

### 5.3 Ajouter à Vercel

1. Retournez dans **Vercel** → **Settings** → **Environment Variables**
2. Trouvez `STRIPE_WEBHOOK_SECRET`
3. Collez la valeur
4. **Save** et **Redeploy**

## 🎉 Étape 6 : Tester le Déploiement

Visitez votre application :
```
https://localbiz-engine.vercel.app
```

Testez :
1. ✅ La page d'accueil charge correctement
2. ✅ Créer un compte
3. ✅ Se connecter
4. ✅ Accéder au dashboard
5. ✅ La connexion Google OAuth fonctionne

## 🔄 Déploiements Automatiques

🎉 **Bonne nouvelle !** Vercel est maintenant connecté à votre dépôt GitHub.

**Chaque fois que vous pushez du code sur GitHub, Vercel redéploie automatiquement !**

```bash
# Faire des modifications
git add .
git commit -m "Add new feature"
git push origin main

# 🚀 Vercel détecte le push et redéploie automatiquement !
```

### Branches Preview

Si vous créez une branche :
```bash
git checkout -b feature/nouvelle-fonctionnalite
# ... faire des modifications ...
git push origin feature/nouvelle-fonctionnalite
```

Vercel créera automatiquement un **Preview Deployment** avec une URL unique pour tester avant de merger !

## 📊 Monitoring et Logs

Dans le Dashboard Vercel :
- **Deployments** : Historique de tous les déploiements
- **Logs** : Logs en temps réel de votre application
- **Analytics** : Statistiques de trafic (plan Pro)
- **Speed Insights** : Performance de votre site

## 🌍 Étape 7 : Ajouter un Domaine Personnalisé (Optionnel)

Si vous avez un nom de domaine (ex: `localbiz-engine.fr`) :

1. Dans Vercel, allez dans **Settings** → **Domains**
2. Cliquez sur **"Add"**
3. Entrez votre domaine : `localbiz-engine.fr`
4. Suivez les instructions pour configurer les DNS
5. Vercel génère automatiquement un certificat SSL gratuit ! 🔒

## 🐛 Problèmes Courants

### Erreur de build

Si le build échoue, consultez les logs dans Vercel → Deployments → [votre build] → "Building"

Solutions :
1. Vérifiez que toutes les variables d'environnement sont présentes
2. Assurez-vous que `npm run build` fonctionne en local
3. Vérifiez qu'il n'y a pas d'erreurs TypeScript

### L'authentification ne fonctionne pas

1. Vérifiez que `NEXT_PUBLIC_APP_URL` est bien défini
2. Vérifiez les URLs de callback dans Supabase
3. Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont corrects

### Les webhooks Stripe ne fonctionnent pas

1. Vérifiez l'URL du webhook dans Stripe Dashboard
2. Testez le webhook avec le Stripe CLI :
   ```bash
   stripe listen --forward-to https://localbiz-engine.vercel.app/api/webhooks/stripe
   ```
3. Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct

## 📞 Support

- Documentation Vercel : https://vercel.com/docs
- Support Vercel : https://vercel.com/support
- GitHub Issues : https://github.com/VOTRE-USERNAME/localbiz-engine/issues

---

**Félicitations ! Votre application est maintenant en production ! 🎉**
