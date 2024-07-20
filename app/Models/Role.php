<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Scout\Searchable;
use Spatie\Permission\Models\Role as ModelsRole;

class Role extends ModelsRole
{
  use HasFactory, Searchable;
}
