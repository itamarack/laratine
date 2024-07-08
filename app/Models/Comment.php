<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Comment extends Model implements HasMedia
{
  use HasFactory;

  use HasFactory, InteractsWithMedia, Searchable;

  public $asYouType = true;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'post_id',
    'user_id',
    'parent_id',
    'content',
    'status'
  ];

  public function post(): BelongsTo
  {
    return $this->belongsTo(Post::class);
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function replies()
  {
    return $this->hasMany(Comment::class, 'parent_id')->with('replies');
  }

  public function parent()
  {
    return $this->belongsTo(Comment::class, 'parent_id');
  }
}
