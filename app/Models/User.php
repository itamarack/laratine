<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Scout\Searchable;

class User extends Authenticatable
{
  use HasFactory, Notifiable, Searchable;

  public $asYouType = true;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'firstname',
    'lastname',
    'email',
    'password',
    'avatar',
    'address',
    'city',
    'state',
    'postcode',
    'biography',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];

  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'email_verified_at' => 'datetime',
      'password' => 'hashed',
    ];
  }

  /**
   * Get the attributes that should be appended.
   *
   * @return array<string, string>
   */
  protected $appends = ['fullname'];

  public function getFullnameAttribute(): string
  {
    return ucwords("{$this->firstname} {$this->lastname}");
  }

  public function setPasswordAttribute($password)
  {
    if (filled($password))
      $this->attributes['password'] = Hash::make($password);
  }

  public function toSearchableArray()
  {
    return $this->toArray();
  }
}
