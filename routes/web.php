<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TagController;
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
  Route::prefix('profile')->group(function () {
    Route::get('/', [UserController::class, 'profileIndex'])->name('profile.index');
    Route::patch('/', [UserController::class, 'profileUpdate'])->name('profile.update');
    Route::delete('/', [UserController::class, 'profileDestroy'])->name('profile.destroy');
  });

  Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'userIndex'])->name('user.index');
    Route::get('/create', [UserController::class, 'userCreate'])->name('user.create');
    Route::post('/create', [UserController::class, 'userStore'])->name('user.store');
    Route::get('/{user}/edit/', [UserController::class, 'userShow'])->name('user.show');
    Route::patch('/{user}/edit/', [UserController::class, 'userUpdate'])->name('user.update');
    Route::delete('/{user}/delete', [UserController::class, 'userDestroy'])->name('user.destroy');
  });

  Route::prefix('posts')->group(function () {
    Route::get('/', [PostController::class, 'postIndex'])->name('post.index');
    Route::get('/create', [PostController::class, 'postCreate'])->name('post.create');
    Route::post('/create', [PostController::class, 'postStore'])->name('post.store');
  });

  Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'categoryIndex'])->name('category.index');
    Route::post('/create', [CategoryController::class, 'categoryStore'])->name('category.store');
    Route::patch('/{category}/edit/', [CategoryController::class, 'categoryUpdate'])->name('category.update');
    Route::delete('/{category}/delete', [CategoryController::class, 'categoryDestroy'])->name('category.destroy');
  });

  Route::prefix('tags')->group(function () {
    Route::get('/', [TagController::class, 'tagIndex'])->name('tag.index');
    Route::post('/create', [TagController::class, 'tagStore'])->name('tag.store');
    Route::patch('/{tag}/edit/', [TagController::class, 'tagUpdate'])->name('tag.update');
    Route::delete('/{tag}/delete', [TagController::class, 'tagDestroy'])->name('tag.destroy');
  });
});

require __DIR__.'/auth.php';
