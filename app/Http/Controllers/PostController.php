<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Spatie\QueryBuilder\QueryBuilder;
use App\Services\FileUploadService;
use Inertia\Inertia;
use Inertia\Response;

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
  public function postCreate (Request $request): Response
  {
    return Inertia::render('Posts/Create', []);
  }
}
