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
}