module.exports = {
  // Configuration pour les tests d'accessibilité
  rules: {
    // Règles critiques pour l'accessibilité
    'color-contrast': { enabled: true },
    'button-name': { enabled: true },
    'image-alt': { enabled: true },
    'link-name': { enabled: true },
    'list': { enabled: true },
    'listitem': { enabled: true },
    'heading-order': { enabled: true },
    'landmark-one-main': { enabled: true },
    'landmark-unique': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'region': { enabled: true },
    'skip-link': { enabled: true },
    'tabindex': { enabled: true },
    'valid-lang': { enabled: true },
    
    // Règles pour les formulaires
    'form-field-multiple-labels': { enabled: true },
    'label': { enabled: true },
    'select-name': { enabled: true },
    'text-input-missing-label': { enabled: true },
    
    // Règles pour les interactions
    'click-events-have-key-events': { enabled: true },
    'no-autoplay-audio': { enabled: true },
    'no-html-headings': { enabled: true },
    'object-alt': { enabled: true },
    'video-caption': { enabled: true },
    
    // Règles pour les ARIA
    'aria-allowed-attr': { enabled: true },
    'aria-allowed-role': { enabled: true },
    'aria-command-name': { enabled: true },
    'aria-hidden-body': { enabled: true },
    'aria-hidden-focus': { enabled: true },
    'aria-input-field-name': { enabled: true },
    'aria-required-attr': { enabled: true },
    'aria-required-children': { enabled: true },
    'aria-required-parent': { enabled: true },
    'aria-roles': { enabled: true },
    'aria-unsupported-elements': { enabled: true },
    'aria-valid-attr-value': { enabled: true },
    'aria-valid-attr': { enabled: true },
    'duplicate-id': { enabled: true },
    'duplicate-id-aria': { enabled: true },
    'duplicate-id-active': { enabled: true },
    'duplicate-id-stable': { enabled: true },
    
    // Règles pour les images et médias
    'image-redundant-alt': { enabled: true },
    'img-redundant-alt': { enabled: true },
    'svg-img-alt': { enabled: true },
    
    // Règles pour la navigation
    'bypass': { enabled: true },
    'focus-order-semantics': { enabled: true },
    'focusable-controls': { enabled: true },
    'frame-title': { enabled: true },
    'html-has-lang': { enabled: true },
    'html-lang-valid': { enabled: true },
    'html-xml-lang-mismatch': { enabled: true },
    'landmark-banner-is-top-level': { enabled: true },
    'landmark-complementary-is-top-level': { enabled: true },
    'landmark-contentinfo-is-top-level': { enabled: true },
    'landmark-main-is-top-level': { enabled: true },
    'landmark-no-duplicate-banner': { enabled: true },
    'landmark-no-duplicate-contentinfo': { enabled: true },
    'landmark-no-duplicate-main': { enabled: true },
    'landmark-unique': { enabled: true },
    'meta-refresh': { enabled: true },
    'meta-viewport': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'presentation-role-conflict': { enabled: true },
    'region': { enabled: true },
    'scope-attr-valid': { enabled: true },
    'skip-link': { enabled: true },
    'tabindex': { enabled: true },
    'table-duplicate-name': { enabled: true },
    'table-fake-caption': { enabled: true },
    'td-headers-attr': { enabled: true },
    'th-has-data-cells': { enabled: true },
    'valid-lang': { enabled: true },
  },
  
  // Configuration pour les tests automatisés
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'best-practice']
  },
  
  // Configuration pour les rapports
  reporter: 'v2',
  
  // Configuration pour les résultats
  resultTypes: ['violations', 'passes', 'incomplete', 'inapplicable'],
  
  // Configuration pour les métadonnées
  metadata: {
    browser: {
      name: 'chrome',
      version: 'latest'
    },
    device: 'desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}; 