# Task manager : frontend

Bienvenue sur le repo front du projet _Task manager_ !

⚠️ _Ce README sera à prendre en considération à partir du jour 4 (E04) de cette saison !_ ⚠️

Quelques infos concernant le code :

- Le code HTML
  - Est minimaliste,
  - est validé W3C,
  - note de 100% sur l'analyse [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=fr)
- La CSS
  - Est minimaliste aussi,
  - repose sur un petit [reset moderne](https://www.joshwcomeau.com/css/custom-css-reset/) 👀
- JS
  - A faire, mais **pas avant E04 de la saison** 😉 !

## Fonctionnement de la page

Une seule et même page permet plusieurs modes d'affichage distincts.  
Prenez le temps de tester vous-même avec les DevTools 🕵️ en modifiant les classes et attributs du DOM.

1. Mode par défaut (la page actuelle) : **liste des tâches**
2. Mode formulaire (ajout/édition d'une tâche), **quand on clique sur le bouton _nouvelle tâche_**.
   - `<header>` est grisé, grâce à l'ajout d'une classe _muted_ :`<header class="muted">`
   - le bouton _nouvelle tâche_ est caché, grâce à l'ajout d'un attribut _hidden_ : `<div class="create-task-container" hidden>`
   - la liste de tâche est cachée, de la même manière : `<ul class="tasklist" hidden>`
   - le formulaire d'ajout/édition de tâche est affiché, grâce à l'ajout d'une classe _show_ : `<div class="modal-dialog show">`
3. Mode par défaut, et **affichage des messages** _success_ ou _error_
   - **Pour revenir à l'affichage par défaut**, on annule les actions effectuées en 2.
     - `<header>`
     - `<div class="create-task-container">`
     - `<ul class="tasklist">`
     - `<div class="modal-dialog">`
   - Puis **afficher un message de succès**, on supprime l'attribut _hidden_ :
     ```html
     <div class="message success">
       La nouvelle tâche a bien été ajoutée.
     </div>
     ```
   - De même pour **un message d'erreur**, on supprime l'attribut _hidden_ :
     ```html
     <div class="message danger">
       Oups, impossible de sauvegarder la tâche.
     </div>
     ```
