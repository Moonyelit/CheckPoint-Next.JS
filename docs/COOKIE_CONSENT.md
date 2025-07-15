# 🍪 Système de Consentement des Cookies - CheckPoint

## 📋 Vue d'ensemble

Ce document décrit l'implémentation du système de consentement des cookies pour CheckPoint, conforme au RGPD (GDPR).

## 🎯 Objectifs

- **Conformité RGPD** : Informer les utilisateurs de l'utilisation des cookies
- **Transparence** : Expliquer clairement les types de cookies utilisés
- **Contrôle utilisateur** : Permettre de modifier les préférences à tout moment
- **Expérience utilisateur** : Interface moderne et intuitive

## 🏗️ Architecture

### Composants principaux

1. **`CookieConsent.tsx`** - Popup initiale de consentement
2. **`CookieManager.tsx`** - Gestionnaire de préférences (bouton flottant)
3. **`useCookieConsent.ts`** - Hook personnalisé pour la gestion d'état
4. **Styles SCSS** - Design moderne et responsive

### Hook `useCookieConsent`

```typescript
interface CookieConsentData {
  status: 'accepted' | 'declined' | null;
  date: string | null;
}

// Fonctions disponibles
const {
  consentData,      // Données actuelles
  hasConsented,     // Boolean - consentement donné
  hasDeclined,      // Boolean - consentement refusé
  needsConsent,     // Boolean - besoin de consentement
  acceptCookies,    // Fonction - accepter
  declineCookies,   // Fonction - refuser
  resetConsent      // Fonction - réinitialiser
} = useCookieConsent();
```

## 🍪 Types de cookies utilisés

### Cookies techniques (nécessaires)

1. **Cookies de session** (`CHECKPOINT_SESSID`)
   - Maintiennent la connexion utilisateur
   - Gèrent les préférences de session
   - Durée : session du navigateur

2. **Cookies d'authentification** (`BEARER`)
   - Stockent le token JWT
   - Sécurisent l'accès à l'API
   - Durée : 1 heure (configurable)

3. **Cookies de consentement**
   - Stockent les préférences utilisateur
   - Évitent de redemander le consentement
   - Durée : 1 an

### Aucun cookie de tracking

- ❌ Pas de cookies publicitaires
- ❌ Pas de cookies de tracking
- ❌ Pas de cookies tiers
- ✅ Uniquement des cookies techniques nécessaires

## 🎨 Interface utilisateur

### Popup de consentement initiale

- **Déclenchement** : Première visite (si pas de consentement)
- **Design** : Modal moderne avec gradient
- **Options** : Accepter / Refuser / Voir les détails
- **Responsive** : Adapté mobile et desktop

### Gestionnaire de cookies

- **Accès** : Bouton flottant 🍪 (bas gauche)
- **Fonctionnalités** :
  - Voir le statut actuel
  - Modifier les préférences
  - Informations détaillées

## 🔧 Configuration

### Variables d'environnement

```env
# Configuration JWT (API)
JWT_PRIVATE_KEY_PATH=path/to/private.key
JWT_PUBLIC_KEY=path/to/public.key
JWT_PASSPHRASE=your_passphrase

# Configuration des cookies
COOKIE_SECURE=true
COOKIE_HTTPONLY=true
COOKIE_SAMESITE=lax
```

### Configuration Symfony

```yaml
# config/packages/framework.yaml
session:
    name: CHECKPOINT_SESSID
    cookie_secure: auto
    cookie_httponly: true
    cookie_samesite: lax

# config/packages/lexik_jwt_authentication.yaml
lexik_jwt_authentication:
    token_ttl: 3600 # 1 heure
    set_cookies:
        BEARER:
            lifetime: 3600
            secure: true
            httpOnly: true
            samesite: 'lax'
```

## 📱 Responsive Design

### Breakpoints

- **Desktop** : > 768px
- **Tablet** : 768px - 480px
- **Mobile** : < 480px

### Adaptations

- **Popup** : Taille réduite sur mobile
- **Boutons** : Disposition verticale sur petit écran
- **Texte** : Taille adaptée à l'écran

## 🔒 Sécurité

### Mesures implémentées

1. **Cookies sécurisés**
   - `httpOnly: true` - Protection XSS
   - `secure: true` - HTTPS uniquement
   - `sameSite: lax` - Protection CSRF

2. **Validation des données**
   - Vérification des types
   - Nettoyage automatique
   - Gestion d'erreurs

3. **Stockage local**
   - localStorage pour la persistance
   - sessionStorage pour les sessions
   - Nettoyage automatique

## 🧪 Tests

### Scénarios de test

1. **Première visite**
   - Popup s'affiche
   - Consentement non donné
   - Bouton gestionnaire caché

2. **Après acceptation**
   - Popup ne s'affiche plus
   - Bouton gestionnaire visible
   - Statut "Acceptés"

3. **Après refus**
   - Popup ne s'affiche plus
   - Bouton gestionnaire visible
   - Statut "Refusés"

4. **Modification des préférences**
   - Reset du consentement
   - Popup réapparaît
   - Nouveau choix possible

## 🚀 Déploiement

### Prérequis

1. **Configuration JWT** : Clés générées
2. **HTTPS** : Certificat SSL valide
3. **Variables d'environnement** : Configurées

### Étapes

1. **Build** : `npm run build`
2. **Test** : `npm run test`
3. **Déploiement** : `npm run start`

## 📊 Monitoring

### Métriques à surveiller

- **Taux d'acceptation** : % d'utilisateurs qui acceptent
- **Taux de refus** : % d'utilisateurs qui refusent
- **Modifications** : Fréquence des changements de préférences
- **Erreurs** : Problèmes de stockage ou d'affichage

### Logs

```javascript
// Exemple de logging
console.log('Cookie consent:', {
  status: consentData.status,
  date: consentData.date,
  userAgent: navigator.userAgent
});
```

## 🔄 Maintenance

### Nettoyage automatique

- **Cookies expirés** : Suppression automatique
- **localStorage** : Nettoyage périodique
- **Cache** : TTL configuré

### Mises à jour

- **RGPD** : Suivi des évolutions légales
- **Interface** : Améliorations UX
- **Sécurité** : Patches de sécurité

## 📚 Ressources

- [RGPD - CNIL](https://www.cnil.fr/fr/cookies-et-traceurs)
- [Next.js - Cookies](https://nextjs.org/docs/api-routes/edge-runtime)
- [Symfony - Sessions](https://symfony.com/doc/current/session.html)
- [JWT - Lexik](https://github.com/lexik/LexikJWTAuthenticationBundle)

---

**Dernière mise à jour** : $(date)
**Version** : 1.0.0
**Auteur** : CheckPoint Team 