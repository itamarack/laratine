<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Searchable;

class Tag extends Model
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
  ];

  public function posts(): BelongsToMany
  {
    return $this->belongsToMany(Post::class);
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
