# 🚀 Configuration Vercel - Guide Complet

## Étape 1 : Ajouter les variables d'environnement sur Vercel

1. Allez sur votre projet Vercel : https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**

### Variables à ajouter :

#### 🔵 Supabase (OBLIGATOIRE)
```
NEXT_PUBLIC_SUPABASE_URL=(copiez depuis votre .env.local)
NEXT_PUBLIC_SUPABASE_ANON_KEY=(copiez depuis votre .env.local)
SUPABASE_SERVICE_ROLE_KEY=(copiez depuis votre .env.local)
```

#### 💳 Stripe (OBLIGATOIRE)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=(copiez depuis votre .env.local)
STRIPE_SECRET_KEY=(copiez depuis votre .env.local)
```

#### 💰 Stripe Price IDs (À ajouter après création des produits)
```
STRIPE_WEBHOOK_SECRET=(à obtenir après configuration webhook)
STRIPE_PRICE_ID_ESSENTIAL=(à obtenir depuis Stripe Dashboard)
STRIPE_PRICE_ID_PRO=(à obtenir depuis Stripe Dashboard)
STRIPE_PRICE_ID_PREMIUM=(à obtenir depuis Stripe Dashboard)
```

#### 📧 Resend (OPTIONNEL pour l'instant)
```
RESEND_API_KEY=(optionnel)
```

#### 🌐 App URL
```
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
```

### ⚠️ Important pour chaque variable :

1. Cliquez sur **Add New**
2. Entrez le **Name** (nom de la variable)
3. Entrez la **Value** (valeur)
4. Sélectionnez les environnements :
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**
5. Cliquez sur **Save**

## Étape 2 : Redéployer

Une fois toutes les variables ajoutées :

1. Allez dans l'onglet **Deployments**
2. Trouvez le dernier déploiement échoué
3. Cliquez sur les **3 points** → **Redeploy**
4. Cochez **"Use existing Build Cache"**
5. Cliquez sur **Redeploy**

## Étape 3 : Configurer le Webhook Stripe (Important !)

Une fois déployé sur Vercel :

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur **"Add endpoint"**
3. URL : `https://votre-domaine.vercel.app/api/webhooks/stripe`
4. Sélectionnez les événements :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copiez le **Signing secret** : `whsec_xxxxx`
6. Retournez dans Vercel → Settings → Environment Variables
7. Ajoutez `STRIPE_WEBHOOK_SECRET` avec la valeur copiée
8. Redéployez

## ✅ Checklist de déploiement

- [ ] Variables Supabase ajoutées
- [ ] Variables Stripe ajoutées (clés principales)
- [ ] NEXT_PUBLIC_APP_URL ajoutée
- [ ] Premier déploiement réussi
- [ ] Produits Stripe créés (voir STRIPE_SETUP.md)
- [ ] Price IDs ajoutés dans Vercel
- [ ] Webhook Stripe configuré
- [ ] STRIPE_WEBHOOK_SECRET ajouté
- [ ] Redéploiement final

## 🔧 Dépannage

### Erreur : "Secret does not exist"
→ Supprimez la section `"env"` du `vercel.json` (déjà fait)

### Erreur : "Environment variable not found"
→ Vérifiez que toutes les variables sont ajoutées pour les 3 environnements

### Le site se charge mais erreurs Supabase
→ Vérifiez que les URLs Supabase sont correctes (pas d'espaces, bon format)

### Erreurs Stripe
→ Utilisez les clés **TEST** en développement, **LIVE** en production

## 📝 Notes importantes

1. **Mode TEST vs LIVE** :
   - En développement local : utilisez les clés `pk_test_` et `sk_test_`
   - En production Vercel : utilisez les clés `pk_live_` et `sk_live_`

2. **Sécurité** :
   - Les variables `NEXT_PUBLIC_*` sont visibles côté client
   - Les autres variables sont privées (côté serveur uniquement)

3. **Mises à jour** :
   - Toute modification des variables nécessite un redéploiement
   - Utilisez la CLI Vercel pour gérer les variables : `vercel env pull`

## 🎯 Prochaines étapes après déploiement

1. Testez la connexion : `/login`
2. Créez un compte test : `/signup`
3. Vérifiez le dashboard : `/dashboard`
4. Testez la page pricing : `/pricing`
5. Configurez les produits Stripe (voir STRIPE_SETUP.md)

---

**Besoin d'aide ?**
- Documentation Vercel : https://vercel.com/docs/environment-variables
- Documentation Supabase : https://supabase.com/docs
- Documentation Stripe : https://stripe.com/docs
