<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
  /**
   * Seed the application's database.
   */
  public function run(): void
  {
    $user = User::updateOrCreate(['email' => 'laratine@email.com'], [
      'firstname' => 'Laratine',
      'lastname' => 'Admin',
      'email' => 'laratine@email.com',
      'email_verified_at' => now(),
      'password' => Hash::make('password'),
      'remember_token' => Str::random(10),
    ]);

    $user->assignRole('Administrator');
  }
}