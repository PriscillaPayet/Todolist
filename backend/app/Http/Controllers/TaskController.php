<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller {
  // Création de la méthode list
  public function list () {
    // Utilisation de la méthode all grâce à l'héritage
    $tasks = Task::all();
    // Retour sous format JSON
    return response()->json($tasks );
  }

  public function show($id)
  {
      // récupérér une tâche spécifique en fonction de son $id
      $task = Task::find($id);

      // gestion d'erreur 404 si la tâche n'existe pas
      if(is_null($task)) {
          return response(null, 404);
      }

      // retourn cette tâche au format JSON
      return $task;
  }

  public function create(Request $request)
  {
      // 0. on récupère les données reçues
      
     
      // au préalable, on valide les données en utilisant des contraintes de validation
      $validator = Validator::make($request->input(), [
          'name' => ['required', 'filled', 'unique:tasks,name'],
      ]);

      // et on demande au validator de tester si les contraintes ne sont pas remplies
      if($validator->fails()) {
          // l'une des contraintes a échoué
          return response()->json($validator->errors(), 422);
      }

      // la récupération :
      $name = $request->input('name');
      

      // 1. créer un nouvel objet Task
      $task = new Task();

      // 2. remplir les propriétés de cet objet
      $task->name = $name;
     

      // 3. on le sauvegarde
      if($task->save()) {
          // la sauvegarde a fonctionné
          // on retourne le json de l'objet ajouté avec le code 201 Created
          return $task;
      } else {
          // la sauvegarde a échoué, on retourne une erreur 500
          return response(null, 500);
      }
  }

  public function update(Request $request, $id)
  {
  
   
      // pour la modification, on essaye d'abord de récupérer l'objet à modifier, avant de valider les données reçues !

      // 1. récupérer l'objet Task à modifier
      //! attention, ici on doit vérifier si l'objet qu'on nous demande de modifier existe ou pas !
      $task = Task::find($id);
      if(is_null($task)) {
          // si la tâche est null, c'est qu'elle n'existe pas en BDD !
          return response(null, 404);
      }

      // 0. on récupère les données reçues

      // au préalable, on valide les données en utilisant des contraintes de validation
      $validator = Validator::make($request->input(), [
          'name' => ['required', 'filled', 'unique:tasks,name']
    
      ]);

      // et on demande au validator de tester si les contraintes ne sont pas remplies
      if($validator->fails()) {
          // l'une des contraintes a échoué
          return response()->json($validator->errors(), 422);
      }

      // la récupération :
      $name = $request->input('name');

      // 2. remplir les propriétés de cet objet
      $task->name = $name;

      // 3. on le sauvegarde
      if($task->save()) {
          // la sauvegarde a fonctionné, on retourne le json de l'objet ajouté avec le code 201 Created
          return $task;
      } else {
          // la sauvegarde a échoué, on retourne une erreur 500
          return response(null, 500);
      }
  }

  public function delete($id)
  {
      // 1. récupérer l'objet Task à supprimer
      //! attention, ici on doit vérifier si l'objet qu'on nous demande de supprimer existe ou pas !
      $task = Task::find($id);

      // gestion d'erreur 404 :
      if(is_null($task)) {
          // si la tâche est null, c'est qu'elle n'existe pas en BDD !
          return response(null, 404);
      }

      // 2. on le supprime
      if($task->delete()) {
          // tout s'est bien passé, 200 OK
          return response(null, 200);
      } else {
          // la suppression a échouée, on retourne une erreur 500
          return response(null, 500);
      }
  }
}