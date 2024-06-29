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

  public function category(): BelongsTo
  {
    return $this->belongsTo(Category::class);
  }
}
