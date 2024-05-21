<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//affiche toutes les tâches
Route::get('/tasks', [TaskController::class, 'list']);

//affiche une tâche par son id
Route::get('/tasks/{id}', [TaskController::class, 'show'])->where('id', '[0-9]+');

//créé une tâche
Route::post('/tasks', [TaskController::class, 'create']);

// modifie quelque-chose en BDD
Route::put('/tasks/{id}', [TaskController::class, 'update'])->where('id', '[0-9]+');

// supprime quelque-chose en BDD
Route::delete('/tasks/{id}', [TaskController::class, 'delete'])->where('id', '[0-9]+');