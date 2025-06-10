# Système d'upload d'avatars CheckPoint

## 🖼️ Avatar par défaut
- **DefaultAvatar.JPG** : Avatar par défaut attribué à tous les nouveaux utilisateurs

## 📤 Upload d'avatars personnalisés

### Dossier uploads/
Les avatars uploadés par les utilisateurs sont stockés dans le dossier `uploads/` avec des noms de fichiers sécurisés.

### 🔒 Sécurités mises en place :

1. **Validation de type** : Seuls JPG, PNG et WEBP acceptés
2. **Validation de taille** : Maximum 5MB
3. **Validation de dimensions** : Entre 50x50 et 2000x2000 pixels
4. **Redimensionnement automatique** : Images redimensionnées à 300x300px max
5. **Nom de fichier sécurisé** : Utilisation de slugs + ID unique
6. **Validation d'image** : Vérification que le fichier est bien une image
7. **Suppression de l'ancien avatar** : Nettoyage automatique
8. **Protection XSS** : Nettoyage des noms de fichiers

### 🔐 Authentification
- Utilisateur connecté requis
- Token JWT vérifié
- Seul l'utilisateur peut modifier son propre avatar

### 📁 Structure des fichiers :
```
/images/avatars/
├── DefaultAvatar.JPG          # Avatar par défaut
├── uploads/                   # Avatars uploadés
│   ├── mon-avatar-12345.jpg
│   ├── photo-67890.png
│   └── ...
└── UPLOAD_INFO.md            # Ce fichier
``` 