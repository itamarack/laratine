<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
  return Inertia::render('Welcome', [
    'canLogin' => Route::has('login'),
    'canRegister' => Route::has('register'),
    'laravelVersion' => Application::VERSION,
    'phpVersion' => PHP_VERSION,
  ]);
});

Route::get('/dashboard', function () {
  return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'profileIndex'])->name('profile.index');
  Route::patch('/profile', [ProfileController::class, 'profileUpdate'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'profileDestroy'])->name('profile.destroy');

  Route::get('/users', [ProfileController::class, 'usersIndex'])->name('users.index');
  Route::get('/users/create', [ProfileController::class, 'userCreate'])->name('user.create');
});

require __DIR__.'/auth.php';
