
Spécifications Fonctionnelles : My_MudaPlan

1. Vision du Produit
My_MudaPlan est une application mobile de gestion de vie, fonctionnant exclusivement hors-ligne (SQLite). Elle permet une planification rigoureuse du temps avec un système de suivi d'exécution strict, une personnalisation avancée et une expérience sonore immersive.

2. Gestion des Programmes (Le Cœur)
Chaque programme est défini par : un titre, une plage horaire (Début/Fin), un lieu, une description courte et un niveau de priorité (Basse, Moyenne, Haute).
Système de Statuts Automatisés & Manuels :
• En attente : La date et l'heure de début sont dans le futur.
• En cours : L'heure actuelle se situe précisément entre l'heure de début et l'heure de fin.
• Fait : Marqué manuellement par l'utilisateur comme étant réalisé.
• En Observation : L'heure de fin est dépassée, mais l'utilisateur n'a pas encore validé la réalisation (Fait ou non).
• Reporté : Programme non réalisé, déplacé vers une nouvelle échéance (conserve un lien avec l'original).
• Abandonné : Programme annulé définitivement par l'utilisateur.

3. Interfaces et Visualisation (UI/UX)
• Mode Grille : Visualisation structurée des programmes par Jour, Semaine ou Mois.
• Sélecteur Temporel : Navigation fluide vers n'importe quelle date passée ou future.
• Tableau de bord : Vue synthétique des priorités et des statuts du jour. Si aucun programme n'est prévu, affiche le message : "Il n'y a pas de programme prévu pour aujourd'hui, veuillez en ajouter si besoin" avec un bouton d'action.

4. Système de Notifications, Rappels & Alertes Sonores
Utilisation des capacités natives du téléphone (Capacitor) :
• Gestion Audio : Utilisation des tonalités système ou sons personnalisés pour chaque alerte.
• Rappel du Matin (5h15 - 7h00) : Notification sonore avec le résumé de la journée.
• Rappel du Soir (19h30) : Bilan sonore des tâches non réalisées avec options [Reporter] ou [Abandonner].
• Signalisation : Alertes sonores au début et à la fin de chaque plage horaire.

5. Paramètres & Personnalisation
• Identité : Ton (Masculin/Féminin) et Titre (Mr, Mme, Mlle).
• Audio : Activation des sons et choix du type de tonalité.
• Langues : Français (défaut), Anglais, Swahili.
• Apparence : Mode sombre/clair et type de vue (Grille/Liste).

6. Flux d'Installation et Premier Lancement (Onboarding)
Pour guider l'utilisateur lors de sa toute première utilisation.

- Écrans d'Introduction : 2 à 3 fenêtres illustrées expliquant l'utilité de My_MudaPlan et son mode d'emploi (basées sur ces spécifications).
Appel à l'Action Initial : Un écran vide avec le message "Ajouter un programme pour commencer", accompagné d'un bouton d'ajout bien visible.
 Configuration Obligatoire : Après l'ajout du premier programme, l'utilisateur est automatiquement dirigé vers les Paramètres pour définir son identité (Ton, Langue, Heures de rappel).
Accès Final : Une fois ces étapes franchies, le tableau de bord devient accessible.

. Évolutions Futures (V2)
• Backup Cloud : Exportation/Importation de la base SQLite vers Google Drive.
• Soutien : Zone de texte discrète "Buy me a coffee" pour soutenir l'auteur.
