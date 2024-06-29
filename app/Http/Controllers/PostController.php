<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Spatie\QueryBuilder\QueryBuilder;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\PostRequest;
use App\Models\User;

class PostController extends Controller
{
  /**
   * Display the list of posts.
   *
   * @param Request $request
   * @return Response
   */
  public function postIndex(Request $request): Response
  {
    $allowedSorts = [];
    $search = Post::search($request->query('search'));
    $perPage = $request->query('per_page', 15);

    $posts = QueryBuilder::for(Post::class)
      ->allowedSorts($allowedSorts)
      ->when($request->filled('search'), fn($query) => $search->constrain($query))
      ->paginate($perPage)->appends($request->query());

    return Inertia::render('Posts/List', ['posts' => $posts]);
  }

  /**
   * Display the post creation form.
   *
   * @param Request $request
   * @return Response
   */
  public function postCreate (Request $request, User $user): Response
  {
    $authors = $user->authors();

    return Inertia::render('Posts/Create', [
      'authors' => $authors
    ]);
  }

  /**
   * Store a new user in the database.
   *
   * @param PostRequest $request
   * @return RedirectResponse
   */
  public function postStore (PostRequest $request, Post $post): RedirectResponse
  {
    $post->fill($request->validated());

    dd($post);

    // $this->uploadService->uploadAvatar($request, $user);
    // $user->save();

    // event(new Registered($user));

    return redirect()->route('post.index');
  }
}
