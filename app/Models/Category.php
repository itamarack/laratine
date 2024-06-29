<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Category extends Model
{
  use HasFactory, Searchable;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'title',
    'slug',
    'description',
    'parent_id'
  ];

  public function posts(): HasMany
  {
    return $this->hasMany(Post::class);
  }

  /**
   * Prepare the user instance for indexing in search.
   *
   * @return array
   */
  public function toSearchableArray()
  {
    return [
      'id' => $this->id,
      'title' => $this->title,
      'description' => $this->description,
    ];
  }
}
