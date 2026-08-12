# Instructions de Développement - Projet Test


## 🎯 Vision & Portée

- **Approche Web-First :** Prioriser le développement web standard tout en assurant une compatibilité stricte avec **Capacitor** (Mobile) et **Tauri** (Desktop).

- **Offline-First :** Utiliser **Zustand** pour la gestion d'état locale afin de minimiser les appels réseau et permettre un fonctionnement fluide sans connexion.


## 🛠 Contraintes Techniques & Data

- **Gestion du Forfait Data :** Interdiction stricte d'installer de nouveaux packages `npm` ou de télécharger des ressources lourdes sans mon autorisation explicite.

- **Base de Données :** Utiliser exclusivement **SQLite** (`dev.db`) pour le développement local.

- **Compatibilité BDD :** Maintenir des types Prisma agnostiques (compatibles SQLite et MySQL). Éviter les types spécifiques comme `@db.Text` pour garantir une migration facile vers MySQL en production.


## 🤖 Méthodologie de l'Agent IA

1. **Analyse Systématique :** Avant chaque nouvelle fonctionnalité, analyser le fichier `schema.prisma` pour comprendre la structure de données.

2. **Planification :** Proposer une structure de fichiers et une architecture logique avant d'écrire la moindre ligne de code.

3. **Qualité :** Écrire un code propre, modulaire et documenté.

4. **Communication :** Répondre exclusivement en **français** et inclure des commentaires dans le code en **français**.

5. **Cohérence avec les Spécifications :** Garder en permanence une stricte cohérence avec le document `Spec_Fonctionelles.md`. L'objectif est d'aboutir à un résultat identique (à 95% minimum) à ce qui y est décrit.


## 📁 Organisation du Projet

- Framework : Next.js (App Router)

- UI : Tailwind CSS (Mobile-friendly)

- ORM : Prisma

- État : Zustand
