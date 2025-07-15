# 🧪 Guide de Test - Système de Consentement des Cookies

## 🎯 Objectif

Ce guide vous aide à tester le système de consentement des cookies de CheckPoint.

## 🚀 Tests de base

### 1. Première visite
1. Ouvrez CheckPoint dans un navigateur privé/incognito
2. **Attendu** : La popup de consentement s'affiche
3. **Vérifier** : Design cohérent avec le thème CheckPoint
4. **Vérifier** : Boutons "Accepter" et "Refuser" fonctionnels

### 2. Test d'acceptation
1. Cliquez sur "Accepter"
2. **Attendu** : Popup se ferme
3. **Vérifier** : Bouton flottant 🍪 apparaît en bas à gauche
4. **Vérifier** : Popup ne réapparaît plus

### 3. Test de refus
1. Réinitialisez le consentement (voir ci-dessous)
2. Cliquez sur "Refuser"
3. **Attendu** : Popup se ferme
4. **Vérifier** : Bouton flottant 🍪 apparaît
5. **Vérifier** : Statut "Refusés" dans le gestionnaire

### 4. Test des détails
1. Cliquez sur "Voir les détails"
2. **Attendu** : Section détaillée s'affiche
3. **Vérifier** : Liste des types de cookies
4. **Vérifier** : Note sur l'absence de tracking

## 🔧 Tests avancés

### 5. Gestionnaire de cookies
1. Cliquez sur le bouton flottant 🍪
2. **Vérifier** : Modal s'ouvre avec le statut actuel
3. **Vérifier** : Date de dernière mise à jour
4. **Vérifier** : Bouton "Modifier mes préférences"

### 6. Politique de confidentialité
1. Dans la popup de consentement, cliquez sur "politique de confidentialité"
2. **Attendu** : Modal LegalModal s'ouvre par-dessus
3. **Vérifier** : Onglet "Politique de confidentialité" actif
4. **Vérifier** : Contenu s'affiche correctement

### 7. Responsive design
1. Testez sur mobile (DevTools)
2. **Vérifier** : Popup s'adapte correctement
3. **Vérifier** : Boutons empilés verticalement
4. **Vérifier** : Texte lisible

## 🛠️ Outils de debug

### Réinitialisation du consentement
En mode développement, ouvrez la console et tapez :
```javascript
window.resetCookieConsent()
```

### Vérification du localStorage
```javascript
// Voir le statut actuel
localStorage.getItem('cookieConsent')
localStorage.getItem('cookieConsentDate')

// Réinitialiser manuellement
localStorage.removeItem('cookieConsent')
localStorage.removeItem('cookieConsentDate')
location.reload()
```

## 🎨 Tests visuels

### Design cohérent
- [ ] Couleurs : `--bleu-crystal-normal`, `--gris-fonce`
- [ ] Police : Karantina pour les titres, DM Sans pour le texte
- [ ] Bordures : 2px solid var(--bleu-crystal-normal)
- [ ] Animations : fadeIn et slideInUp fluides

### États des boutons
- [ ] Hover : transform translateY(-2px)
- [ ] Active : transform translateY(0)
- [ ] Couleurs : bleu pour accepter, rouge pour refuser

### Responsive
- [ ] Desktop : max-width 600px
- [ ] Tablet : max-width 95%
- [ ] Mobile : max-width 98%, padding réduit

## 🔒 Tests de sécurité

### Cookies techniques
- [ ] `CHECKPOINT_SESSID` : session uniquement
- [ ] `BEARER` : httpOnly, secure, sameSite
- [ ] Pas de cookies de tracking

### Stockage local
- [ ] localStorage pour la persistance
- [ ] Nettoyage automatique des données expirées
- [ ] Validation des données avant utilisation

## 📱 Tests de compatibilité

### Navigateurs
- [ ] Chrome (dernière version)
- [ ] Firefox (dernière version)
- [ ] Safari (dernière version)
- [ ] Edge (dernière version)

### Dispositifs
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## 🚨 Tests d'erreurs

### Cas limites
1. **localStorage désactivé**
   - Désactivez localStorage dans DevTools
   - **Attendu** : Popup s'affiche toujours

2. **JavaScript désactivé**
   - Désactivez JavaScript
   - **Attendu** : Pas de popup (normal)

3. **Réseau lent**
   - Simulez une connexion lente
   - **Vérifier** : Popup s'affiche rapidement

## 📊 Métriques à surveiller

### Performance
- [ ] Temps de chargement < 100ms
- [ ] Pas de re-render inutiles
- [ ] Animations fluides (60fps)

### Accessibilité
- [ ] Navigation au clavier
- [ ] Screen reader compatible
- [ ] Contraste suffisant
- [ ] Focus visible

## ✅ Checklist finale

- [ ] Popup s'affiche à la première visite
- [ ] Design cohérent avec le thème
- [ ] Politique de confidentialité s'ouvre
- [ ] Gestionnaire de cookies fonctionnel
- [ ] Responsive sur tous les écrans
- [ ] Conformité RGPD respectée
- [ ] Pas d'erreurs dans la console
- [ ] Performance optimale

---

**Note** : Ce guide doit être exécuté après chaque modification du système de cookies. 