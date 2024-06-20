<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
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
  Route::get('/profile', [UserController::class, 'profileIndex'])->name('profile.index');
  Route::patch('/profile', [UserController::class, 'profileUpdate'])->name('profile.update');
  Route::delete('/profile', [UserController::class, 'profileDestroy'])->name('profile.destroy');

  Route::get('/users', [UserController::class, 'userIndex'])->name('user.index');
  Route::get('/users/create', [UserController::class, 'userCreate'])->name('user.create');
  Route::post('/users/create', [UserController::class, 'userStore'])->name('user.store');
  Route::get('/users/{user}/edit/', [UserController::class, 'userShow'])->name('user.show');
  Route::patch('/users/{user}/edit/', [UserController::class, 'userUpdate'])->name('user.update');
  Route::delete('/users/{user}/delete', [UserController::class, 'userDestroy'])->name('user.destroy');
});

require __DIR__.'/auth.php';
