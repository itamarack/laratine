<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Page extends Model implements HasMedia
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
    'user_id',
    'content',
    'status',
    'parent_id',
    'featured_image',
    'meta_description',
    'meta_tags',
    'layout_template',
    'layout_width'
  ];

  protected $casts = [
    'meta_tags' => 'array',
    'user_id' => 'string',
    'parent_id' => 'string'
  ];

  // protected $appends = ['author'];

  public function category(): BelongsTo
  {
    return $this->belongsTo(Category::class);
  }

  public function registerMediaCollections(): void
  {
    $this->addMediaCollection('featured_image')
      ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/jpg'])
      ->singleFile();

    $this->addMediaCollection('media')
      ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/jpg']);
  }

  /**
   * Get the featuredImage attribute.
   *
   * This accessor function returns the asset URL for the avatar.
   *
   * @param  string|null  $avatar
   * @return string
   */
  public function getFeaturedImageAttribute(): string
  {
    return $this->getFirstMediaUrl('featured_image');
  }

  public function toSearchableArray(): array
  {
    return [
      'id' => $this->id,
      'title' => $this->title,
      'excerpt' => $this->excerpt,
    ];
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function scopePages(Builder $query): Builder
  {
    return $query->whereNot('id', $this->id);
  }
}
