<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Post extends Model implements HasMedia
{
  use HasFactory, InteractsWithMedia, Searchable;

  public $asYouType = true;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'title',
    'slug',
    'excerpt',
    'author',
    'content',
    'status',
    'category_id',
    'parent_id',
    'featured_image',
    'meta_description',
    'meta_tags',
    'layout_template',
    'layout_width'
  ];

  protected $casts = [
    'meta_tags' => 'array',
    'category_id' => 'string'
  ];

  public function category(): BelongsTo
  {
    return $this->belongsTo(Category::class);
  }

  public function toSearchableArray()
  {
    return [
      'id' => $this->id,
      'title' => $this->title,
      'excerpt' => $this->excerpt,
    ];
  }

  // public function setMetaTagsAttribute($value)
  // {
  //   $this->attributes['meta_tags'] = serialize($value);
  // }

  // public function getMetaTagsAttribute($value)
  // {
  //   return unserialize($value);
  // }
}
