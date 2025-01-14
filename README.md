# BabyFoot Manager

Application web de gestion de parties de babyfoot en temps réel.

## Prérequis

- Node.js
- PostgreSQL

## Installation

1. Cloner le repository
2. Installer les dépendances :
```bash
npm install
```
3. Configurer la base de données PostgreSQL :
   - Créer une base de données nommée 'babyfoot'
   - Exécuter le script SQL fourni dans /db/init.sql

4. Lancer l'application :
```bash
npm start
```

5. Accéder à l'application via : http://localhost:3000

## Fonctionnalités

- Création de parties de babyfoot
- Suppression de parties
- Marquage des parties terminées
- Mise à jour en temps réel
- Compteur de parties en cours
