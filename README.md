# Gestion des Heures de Travail

Application web pour calculer les heures normales et les heures supplémentaires.

## Fonctionnalités

- **Authentification** : Connexion avec matricule et mot de passe
- **Création de compte** : Inscription pour les nouveaux employés
- **Saisie des heures** : Enregistrement des heures travaillées par jour
- **Calcul automatique** :
  - Heures normales : 8h/jour (lundi-vendredi)
  - Heures supplémentaires x1.25 : au-delà de 8h en semaine + samedi
  - Heures supplémentaires x2.0 : dimanche
- **Résumé mensuel** : Calcul total avec prix personnalisé

## Structure

- `index.html` - Page de connexion
- `register.html` - Page d'inscription
- `hours-entry.html` - Saisie des heures
- `summary.html` - Résumé et calculs
- `style.css` - Styles
- `config.js` - Configuration Supabase
- `auth.js` - Authentification
- `register.js` - Inscription
- `hours-entry.js` - Gestion des heures
- `summary.js` - Calculs et affichage

## Base de données

L'application utilise Supabase avec deux tables :
- `employees` : Informations des employés
- `work_hours` : Heures travaillées par jour

## Utilisation

1. Créer un compte employé avec matricule, mot de passe, nom et prénom
2. Se connecter avec le matricule et mot de passe
3. Saisir les heures travaillées pour chaque jour
4. Consulter le résumé mensuel avec calcul des heures et paiements
