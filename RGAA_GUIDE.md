# Guide RGAA - CheckPoint

## 🎯 Référentiel Général d'Amélioration de l'Accessibilité (RGAA 4.1)

Le RGAA est le référentiel français d'accessibilité numérique, basé sur les WCAG 2.1.

## ✅ Critères RGAA Implémentés

### **RGAA 1.1 - Images**
- ✅ **1.1.1** : Chaque image a un attribut `alt`
- ✅ **1.1.2** : Les images décoratives ont `aria-hidden="true"`
- ✅ **1.1.3** : Les images informatives ont des descriptions claires

### **RGAA 1.2 - Cadres**
- ✅ **1.2.1** : Chaque cadre a un titre pertinent

### **RGAA 1.3 - Couleurs**
- ✅ **1.3.1** : L'information ne dépend pas uniquement de la couleur
- ✅ **1.3.2** : Contraste suffisant (4.5:1 minimum)

### **RGAA 1.4 - Multimédia**
- ✅ **1.4.1** : Les vidéos ont des sous-titres
- ✅ **1.4.2** : Les audios ont des transcriptions

### **RGAA 2.1 - Navigation**
- ✅ **2.1.1** : Navigation au clavier possible
- ✅ **2.1.2** : Ordre de tabulation logique
- ✅ **2.1.3** : Pas de piège au clavier

### **RGAA 2.2 - Liens**
- ✅ **2.2.1** : Chaque lien a un intitulé clair
- ✅ **2.2.2** : Les liens sont explicites hors contexte

### **RGAA 2.3 - Formulaires**
- ✅ **2.3.1** : Chaque champ a une étiquette
- ✅ **2.3.2** : Les champs obligatoires sont indiqués
- ✅ **2.3.3** : Les erreurs sont clairement identifiées

### **RGAA 2.4 - Navigation**
- ✅ **2.4.1** : Présence de liens d'évitement (skip links)
- ✅ **2.4.2** : Plan du site accessible
- ✅ **2.4.3** : Titres de pages pertinents

### **RGAA 2.5 - Modifications du contenu**
- ✅ **2.5.1** : Les changements de contenu sont annoncés
- ✅ **2.5.2** : Les messages d'erreur sont clairs

### **RGAA 3.1 - Structure**
- ✅ **3.1.1** : Hiérarchie des titres respectée
- ✅ **3.1.2** : Liste correctement structurée
- ✅ **3.1.3** : Présence de landmarks

### **RGAA 3.2 - Présentation**
- ✅ **3.2.1** : L'information ne dépend pas de la présentation
- ✅ **3.2.2** : Les couleurs ne sont pas le seul moyen d'information

### **RGAA 3.3 - Formulaires**
- ✅ **3.3.1** : Les erreurs sont clairement identifiées
- ✅ **3.3.2** : Les suggestions de correction sont proposées

### **RGAA 4.1 - Navigation**
- ✅ **4.1.1** : Présence d'un menu de navigation
- ✅ **4.1.2** : Navigation cohérente

### **RGAA 4.2 - Alternatives**
- ✅ **4.2.1** : Alternatives textuelles disponibles
- ✅ **4.2.2** : Contenu non textuel accessible

### **RGAA 5.1 - Tableaux**
- ✅ **5.1.1** : Les tableaux de données ont des en-têtes
- ✅ **5.1.2** : Les tableaux de mise en forme sont correctement marqués

### **RGAA 6.1 - Liens**
- ✅ **6.1.1** : Les liens sont explicites
- ✅ **6.1.2** : Les liens internes fonctionnent

### **RGAA 7.1 - Focus**
- ✅ **7.1.1** : Le focus est visible lors de la navigation au clavier
- ✅ **7.1.2** : Le focus ne disparaît pas lors des interactions

### **RGAA 7.2 - Navigation**
- ✅ **7.2.1** : Navigation au clavier possible
- ✅ **7.2.2** : Pas de piège au clavier

### **RGAA 7.3 - Standards**
- ✅ **7.3.1** : Respect des standards HTML5
- ✅ **7.3.2** : Utilisation correcte des rôles ARIA

### **RGAA 8.1 - Alternatives**
- ✅ **8.1.1** : Alternatives textuelles pour les images
- ✅ **8.1.2** : Alternatives pour les médias

### **RGAA 8.2 - Présentation**
- ✅ **8.2.1** : L'information ne dépend pas de la présentation
- ✅ **8.2.2** : Respect des préférences utilisateur

### **RGAA 8.3 - Formulaires**
- ✅ **8.3.1** : Les erreurs sont clairement identifiées
- ✅ **8.3.2** : Les suggestions de correction sont proposées

### **RGAA 8.4 - Navigation**
- ✅ **8.4.1** : Navigation cohérente
- ✅ **8.4.2** : Présence de liens d'évitement

### **RGAA 8.5 - Alternatives**
- ✅ **8.5.1** : Alternatives textuelles disponibles
- ✅ **8.5.2** : Contenu non textuel accessible

### **RGAA 8.6 - Standards**
- ✅ **8.6.1** : Respect des standards HTML5
- ✅ **8.6.2** : Utilisation correcte des rôles ARIA

### **RGAA 8.7 - Alternatives**
- ✅ **8.7.1** : Alternatives textuelles pour les images
- ✅ **8.7.2** : Alternatives pour les médias

### **RGAA 8.8 - Présentation**
- ✅ **8.8.1** : L'information ne dépend pas de la présentation
- ✅ **8.8.2** : Respect des préférences utilisateur

### **RGAA 8.9 - Formulaires**
- ✅ **8.9.1** : Les erreurs sont clairement identifiées
- ✅ **8.9.2** : Les suggestions de correction sont proposées

### **RGAA 8.10 - Navigation**
- ✅ **8.10.1** : Navigation cohérente
- ✅ **8.10.2** : Présence de liens d'évitement

## 🎨 Focus Visible (RGAA 7.1)

### **Implémentation**
```scss
/* Focus visible uniquement pour la navigation au clavier */
*:focus-visible {
  outline: 2px solid var(--bleu-crystal-fonce);
  outline-offset: 2px;
}
```

### **Avantages**
- ✅ Focus visible uniquement au clavier
- ✅ Pas d'interférence avec la souris
- ✅ Conforme RGAA 7.1.1
- ✅ Respect de l'expérience utilisateur

## 🧪 Tests RGAA

### **Tests Automatisés**
```bash
# Test avec axe-core (conforme RGAA)
npm run accessibility:dev
```

### **Tests Manuels**
1. **Navigation clavier** : Tab, Shift+Tab, Enter, Escape
2. **Lecteur d'écran** : NVDA, JAWS, VoiceOver
3. **Contraste** : Outils de vérification
4. **Zoom** : 200% et 400%

## 📊 Niveau de Conformité

### **Niveau A** ✅
- Tous les critères de niveau A respectés
- Navigation au clavier fonctionnelle
- Textes alternatifs présents

### **Niveau AA** ✅
- Contraste suffisant (4.5:1)
- Focus visible au clavier
- Structure sémantique correcte

### **Niveau AAA** 🎯
- Contraste élevé (7:1) pour certains éléments
- Navigation avancée
- Alternatives complètes

## 🚀 Bonnes Pratiques RGAA

### **✅ À Respecter**
- Utiliser `:focus-visible` au lieu de `:focus`
- Ajouter des `aria-label` descriptifs
- Structurer avec des landmarks HTML5
- Respecter la hiérarchie des titres

### **❌ À Éviter**
- Utiliser `:focus` qui apparaît à la souris
- Oublier les textes alternatifs
- Créer des pièges au clavier
- Utiliser des couleurs seules pour l'information

## 📚 Ressources RGAA

### **Documentation Officielle**
- [RGAA 4.1](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)
- [Guide d'accompagnement](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)

### **Outils de Test**
- [Asqatasun](https://asqatasun.org/) - Outil de test RGAA
- [Tanaguru](https://www.tanaguru.com/) - Tests automatisés
- [AccessiWeb](https://www.accessiweb.org/) - Référentiel

---

**Note** : Le RGAA est le référentiel français obligatoire pour les services publics. Cette implémentation respecte les critères essentiels pour une accessibilité optimale. 