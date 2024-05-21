const app = {

    init: function() {
        // code lancé au chargement de la page
        app.loadFromAPI();

        // au chargement, on ajoute les écouteurs d'évènements sur les éventuels boutons

        // bouton "Nouvelle Tâche" pour afficher le form :
        const newTaskButton = document.querySelector('.create-task-container button');
        newTaskButton.addEventListener('click', app.handleNewTaskButtonClick);

        // soumission du formulaire d'ajout d'une tâche : 
        const newTaskForm = document.querySelector('.modal-dialog form');
        newTaskForm.addEventListener('submit', app.handleNewTaskFormSubmit);

        // au chargement de l'appli, on doit remplir le select dans le form d'ajout de tâche
        app.loadCategoriesFromAPI();
    },

    handleNewTaskButtonClick: function() {
        // quand on click sur le bouton "Nouvelle tâche", on affiche le popup d'ajout

        // on sélectionne le popup
        const modal = document.querySelector('.modal-dialog');
        // on lui ajoute la classe show
        modal.classList.add('show');
    },

    handleNewTaskFormSubmit: async function(event) {
        // le form d'ajout de tâche a été soumis !

        // 0. on bloque le comportement par défaut du form
        event.preventDefault();

        // 1. on récupère les données du form
        const form = event.currentTarget;
        const title = document.querySelector('#task-title').value;
        const category_id = form.querySelector('select').value;

        //console.log("Catégorie sélectionnée : " + category_id);

        // 2. on envoi ces données via une requête HTTP POST à l'API
        try {
            const response = await fetch('http://localhost:8000/api/tasks', {
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    category_id: category_id
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            });

            // 3. on vérifie le code HTTP renvoyé par l'API
            if(response.status === 201) {
                // ajout OK !

                console.log("ajout ok !");

                // 4. si tout est OK, on ajoute la nouvelle tâche au DOM !
                // 4.1 on cache le popup d'ajout
                const modal = document.querySelector('.modal-dialog');
                modal.classList.remove('show');

                // 4.2 on récupère la task retournée par l'API
                const task = await response.json();

                // 4.3 on ajoute la tâche à la liste
                app.addTaskToList(task);

                // 4.4 on vide le form
                form.reset();

            } else if (response.status === 422) {
                //  échec d'une des contraintes de validation

                // on récupère le JSON des erreurs envoyé par Laravel
                const errors = await response.json();
                console.error("échec des contraintes de validation : ");
                console.table(errors);
            } else {
                console.error("Code erreur reçu : " + response.status);
            }
            

        } catch (error) {
            console.error("Erreur rencontrée : " + error);
        }
               
    },

    loadFromAPI: async function() {
        // ici, on fetch
        try {
            const response = await fetch("http://localhost:8000/api/tasks");
            const tasks = await response.json();

            console.log(tasks);

            // on ajoute les tâches dans le DOM
            app.updateDOM(tasks);
        } catch (error) {
            console.error("Erreur rencontrée lors du chargement : " + error);
        }
    },

    updateDOM: function(tasks) {
        // ajoute les tâches dans le DOM

        // on boucle sur les tâches
        for(const task of tasks) {
            app.addTaskToList(task);
        }
    },

    handleDelete: async function(event) {
        // on supprime la tâche

        // pour supprimer le li de notre tâche du DOM, on doit le sélectionner
        // on peut avec currentTarget récupérer le div sur lequel on a cliqué
        const div = event.currentTarget;
        // le parent de ce div est notre li, on peut donc le récupérer avec parentNode
        const li = div.parentNode;
        // on pourrait aussi utiliser .closest() :
        //const li = div.closest('li');

        // on récupère l'ID de la tâche à supprimer
        // li.dataset.id permet de récupérer la valeur de l'attribut data-id sur la balise li
        const id = li.dataset.id;

        // on met tout ça dans un try/catch pour gérer le cas où l'API ne répond pas du tout !
        try {
            // on fait une requête HTTP DELETE vers l'API
            const response = await fetch('http://localhost:8000/api/tasks/' + id, {
                method: 'DELETE'
            });
            // on vérifie le code retour HTTP de l'API
            if(response.status === 404) {
                // la tâche à supprimer n'a pas été trouvée ! 
                console.error("Impossible de supprimer la tâche : elle n'existe pas !");
                //alert("la tâche n'existe pas !");
                // donc on supprime le li
                li.remove();
            } else if (response.status === 200) {
                // 200 OK, tout s'est bien passé.
                // donc on supprime le li
                li.remove();
                // pour debug
                console.info("Suppression de la tâche effectuée avec succès.");
            } else {
                // autre erreur, probablement une erreur 500 mais ça marchera aussi pour les autres erreurs
                // erreur coté serveur (problème de connexion à la bdd par exemple)
                console.error("Impossible de supprimer la tâche : erreur serveur.");
            } 
        } catch(error) {
            // ce message d'erreur s'affiche en cas de non réponse de l'API (problème réseau, serveur HS, etc.)
            console.error("Impossible de supprimer la tâche : le serveur ne répond pas.");
        }
               
    },

    handleEdit: async function(event) {
        // console.log("on entre dans handleEdit")
        // pour modifier le li de notre tâche du DOM, on doit le sélectionner
        // on peut avec currentTarget récupérer le div sur lequel on a cliqué
        const div = event.currentTarget;
        // le parent de ce div est notre li, on peut donc le récupérer avec parentNode
        const li = div.parentNode;
        // on pourrait aussi utiliser .closest() :
        //const li = div.closest('li');

        // on récupère l'ID de la tâche à modifier
        // li.dataset.id permet de récupérer la valeur de l'attribut data-id sur la balise li
        const id = li.dataset.id;
        // console.log(id);

        //on veut ouvrir le pop-up 
        // on sélectionne le popup
        const modal = document.querySelector('.modal-dialog');
        // on lui ajoute la classe show
        modal.classList.add('show');

        //on va modifer le contenu du formulaire pour l'adapter à la modification
        const formTitle = document.querySelector('form h2');
        formTitle.textContent = "Modifier la tâche";

        const formBtn = document.querySelector('form button');
        formBtn.textContent = "Modifier";
        
        //on fait un requête get pour obtenir les informations de la tĉhe en fonction de l'id

        try {
            const response = await fetch('http://localhost:8000/api/tasks/' + id);
            if (response.status === 200) {
            const task = await response.json();

        
        //on préremplit la tâche en allant chercher les info du li
        const taskTitleInput = document.querySelector('#task-title');
        taskTitleInput.value=task.title;
        } else {
            console.error("Impossible de récupérer les détails de la tâche : code erreur " + response.status);
        }
        } catch (error) {
        console.error("Erreur rencontrée lors de la récupération des détails de la tâche : " + error);

        //on va faire une requête GET pour remplir le place older
        }
    },

    addTaskToList: function(task) {
        // cette fonction ajoute une tâche (fournie en param) à la liste ul dans le DOM

        // on sélectionne le conteneur (balise ul)
        const ul = document.querySelector('.tasklist');

        // on sélectionne notre template
        const template = document.querySelector('#task-template');

        // On clone notre template
        const clone = document.importNode(template.content, true);

        // on fait les modifs nécessaire sur notre template
        const p = clone.querySelector('p');
        p.textContent = task.title;
        const li = clone.querySelector('li');
        li.dataset.id = task.id;

        // ajout de la catégorie
        const em = clone.querySelector('em');
        // on vérifie si la tâche a une catégorie, ou si elle est nulle
        if(task.category === null) {
            em.textContent = "non catégorisé";
        } else {
            em.textContent = task.category.name;
        }
        
        // on ajoute l'écouteur d'évènement sur le bouton supprimer
        const supprBtn = clone.querySelector('.delete');
        supprBtn.addEventListener('click', app.handleDelete);

        // on ajoute l'écouteur d'évènement sur le bouton modifier
        const editBtn = clone.querySelector('.edit');
        editBtn.addEventListener('click', app.handleEdit);
      
        // on ajoute le clone à notre ul
        ul.appendChild(clone);
    },

    loadCategoriesFromAPI: async function() {

        // on sélectionne le select à remplir
        const select = document.querySelector('.modal-dialog select');

        // on envoi une requête HTTP GET vers http://127.0.0.1:8000/api/categories
        try {
            const response = await fetch('http://127.0.0.1:8000/api/categories');

            // on vérifie le status de la réponse
            if(response.status === 200) {
                // requête OK !

                // on récupère les résultats
                const categories = await response.json();

                // on parcourt les categories récupérées
                for(const category of categories) {
                    // pour chaque catégorie, on créé une nouvelle balise option
                    const option = document.createElement('option');
                    option.textContent = category.name;
                    option.value = category.id;

                    // et on l'ajoute au select !
                    select.appendChild(option);
                }

                console.info("Chargement des catégories OK !");
                
            } else {
                console.error("Erreur serveur rencontrée (500).");
            }
        } catch (error) {
            console.error("Erreur rencontrée : " + error);
        }
    }
};

document.addEventListener('DOMContentLoaded', app.init);
