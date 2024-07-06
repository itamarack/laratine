<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
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
    Route::get('/', [ProfileController::class, 'profileIndex'])->name('profile.index');
    Route::patch('/', [ProfileController::class, 'profileUpdate'])->name('profile.update');
    Route::delete('/', [ProfileController::class, 'profileDestroy'])->name('profile.destroy');
  });

  Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'userIndex'])->name('user.index');
    Route::get('/create', [UserController::class, 'userCreate'])->name('user.create');
    Route::post('/create', [UserController::class, 'userStore'])->name('user.store');
    Route::get('/{user}/edit/', [UserController::class, 'userShow'])->name('user.show');
    Route::patch('/{user}/edit/', [UserController::class, 'userUpdate'])->name('user.update');
    Route::delete('/{user}/delete', [UserController::class, 'userDestroy'])->name('user.destroy');
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

  Route::prefix('posts')->group(function () {
    Route::get('/', [PostController::class, 'index'])->name('post.index');
    Route::get('/create', [PostController::class, 'create'])->name('post.create');
    Route::post('/create', [PostController::class, 'store'])->name('post.store');
    Route::get('/{post}/edit/', [PostController::class, 'show'])->name('post.show');
    Route::patch('/{post}/edit/', [PostController::class, 'update'])->name('post.update');
    Route::delete('/{post}/delete', [PostController::class, 'destroy'])->name('post.destroy');
  });

  Route::prefix('pages')->group(function () {
    Route::get('/', [PageController::class, 'index'])->name('page.index');
    Route::get('/create', [PageController::class, 'create'])->name('page.create');
    Route::post('/create', [PageController::class, 'store'])->name('page.store');
    Route::get('/{page}/edit/', [PageController::class, 'show'])->name('page.show');
    Route::patch('/{page}/edit/', [PageController::class, 'update'])->name('page.update');
    Route::delete('/{page}/delete', [PageController::class, 'destroy'])->name('page.destroy');
  });
});

require __DIR__.'/auth.php';
