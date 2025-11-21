# 🎯 Configuration Stripe - Guide Rapide

Vous avez déjà les clés Stripe dans `.env.local` ✅

## Prochaine Étape : Créer les Produits Stripe

### 1. Accéder au Dashboard Stripe

Allez sur : **https://dashboard.stripe.com/products**

### 2. Créer les 3 Produits

#### Produit 1 : Essential
1. Cliquez sur **"+ Ajouter un produit"**
2. **Nom** : `Essential`
3. **Description** : `Plan Essential pour démarrer`
4. **Prix** :
   - Montant : `79`
   - Devise : `EUR`
   - Type : **Récurrent**
   - Fréquence : **Mensuel**
5. Cliquez sur **"Enregistrer le produit"**
6. **COPIEZ LE PRICE ID** : `price_xxxxxxxxxxxxx`

#### Produit 2 : Pro
1. Cliquez sur **"+ Ajouter un produit"**
2. **Nom** : `Pro`
3. **Description** : `Plan Pro pour développer votre business`
4. **Prix** :
   - Montant : `149`
   - Devise : `EUR`
   - Type : **Récurrent**
   - Fréquence : **Mensuel**
5. Cliquez sur **"Enregistrer le produit"**
6. **COPIEZ LE PRICE ID** : `price_xxxxxxxxxxxxx`

#### Produit 3 : Premium
1. Cliquez sur **"+ Ajouter un produit"**
2. **Nom** : `Premium`
3. **Description** : `Plan Premium pour entreprises en croissance`
4. **Prix** :
   - Montant : `299`
   - Devise : `EUR`
   - Type : **Récurrent**
   - Fréquence : **Mensuel**
5. Cliquez sur **"Enregistrer le produit"**
6. **COPIEZ LE PRICE ID** : `price_xxxxxxxxxxxxx`

### 3. Mettre à Jour .env.local

Ajoutez les Price IDs dans votre `.env.local` :

```env
STRIPE_PRICE_ID_ESSENTIAL=price_xxxxxxxx
STRIPE_PRICE_ID_PRO=price_xxxxxxxx
STRIPE_PRICE_ID_PREMIUM=price_xxxxxxxx
```

### 4. Configurer le Webhook (Important pour Production)

1. Allez sur **https://dashboard.stripe.com/webhooks**
2. Cliquez sur **"Ajouter un endpoint"**
3. **URL du endpoint** : `https://votre-domaine.vercel.app/api/webhooks/stripe`
4. **Événements à écouter** :
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Cliquez sur **"Ajouter un endpoint"**
6. Copiez le **Signing secret** : `whsec_xxxxx`
7. Ajoutez-le à `.env.local` :
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

### 5. Redémarrer le Serveur

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez
npm run dev
```

### 6. Tester

1. Allez sur http://localhost:3000/pricing
2. Cliquez sur "Commencer" sur un plan
3. Vous serez redirigé vers Stripe Checkout
4. Utilisez une carte de test :
   - **Numéro** : `4242 4242 4242 4242`
   - **Date** : N'importe quelle date future
   - **CVC** : N'importe quel 3 chiffres

## 🧪 Mode Test vs Mode Live

⚠️ **ATTENTION** : Vos clés actuelles sont en **mode LIVE** !

```env
# Vos clés actuelles (LIVE - vrais paiements)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### Pour le développement, utilisez les clés TEST :

1. Dans Stripe Dashboard, activez le **Mode Test** (toggle en haut à droite)
2. Remplacez par les clés TEST :
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

### Quand utiliser TEST vs LIVE :

- **Mode TEST** :
  - ✅ Développement local
  - ✅ Tests
  - ✅ Staging
  - Utilise des cartes de test
  - Aucun vrai paiement

- **Mode LIVE** :
  - ✅ Production uniquement
  - Vrais paiements
  - Vrais clients

## 📚 Ressources

- **Dashboard Stripe** : https://dashboard.stripe.com
- **Produits** : https://dashboard.stripe.com/products
- **Webhooks** : https://dashboard.stripe.com/webhooks
- **Documentation** : https://stripe.com/docs

## ✅ Checklist

- [ ] Créer 3 produits dans Stripe
- [ ] Copier les 3 Price IDs
- [ ] Mettre à jour `.env.local`
- [ ] Configurer webhook (pour production)
- [ ] Redémarrer `npm run dev`
- [ ] Tester sur /pricing
- [ ] ⚠️ Passer en mode TEST pour le développement

---

**Une fois configuré, vous pourrez tester le flow complet de paiement !** 🚀
