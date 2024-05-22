<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Création de la classe Task héritant de toutes les capacités de Model
class Task extends Model {

    protected $table = 'tasks';
    protected $primaryKey = 'id'; // 'id' est bien la clé primaire
    public $timestamps = false;
}