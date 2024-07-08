<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
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
    Route::get('/', [ProfileController::class, 'index'])->name('profile.index');
    Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
  });

  Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('user.index');
    Route::get('/create', [UserController::class, 'create'])->name('user.create');
    Route::post('/create', [UserController::class, 'store'])->name('user.store');
    Route::get('/{user}/edit/', [UserController::class, 'show'])->name('user.show');
    Route::patch('/{user}/edit/', [UserController::class, 'update'])->name('user.update');
    Route::delete('/{user}/delete', [UserController::class, 'destroy'])->name('user.destroy');
  });

  Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index'])->name('category.index');
    Route::post('/create', [CategoryController::class, 'store'])->name('category.store');
    Route::patch('/{category}/edit/', [CategoryController::class, 'update'])->name('category.update');
    Route::delete('/{category}/delete', [CategoryController::class, 'destroy'])->name('category.destroy');
  });

  Route::prefix('tags')->group(function () {
    Route::get('/', [TagController::class, 'index'])->name('tag.index');
    Route::post('/create', [TagController::class, 'store'])->name('tag.store');
    Route::patch('/{tag}/edit/', [TagController::class, 'update'])->name('tag.update');
    Route::delete('/{tag}/delete', [TagController::class, 'destroy'])->name('tag.destroy');
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

  Route::prefix('comments')->group(function () {
    Route::get('/', [CommentController::class, 'index'])->name('comment.index');
    Route::get('/create', [CommentController::class, 'create'])->name('comment.create');
    Route::post('/create', [CommentController::class, 'store'])->name('comment.store');
    Route::get('/{comment}/edit/', [CommentController::class, 'show'])->name('comment.show');
    Route::patch('/{comment}/edit/', [CommentController::class, 'update'])->name('comment.update');
    Route::delete('/{comment}/delete', [CommentController::class, 'destroy'])->name('comment.destroy');
  });
});

require __DIR__.'/auth.php';
