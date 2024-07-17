<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\PostRequest;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use App\Services\FileUploadService;
use App\Services\QueryBuilderService;
use App\Stats\PostStats;

class PostController extends Controller
{
  protected $builderService;
  protected $uploadService;

  public function __construct(FileUploadService $uploadService, QueryBuilderService $builderService)
  {
    $this->uploadService = $uploadService;
    $this->builderService = $builderService;
  }

  /**
   * Display the list of posts.
   *
   * @param Request $request
   * @param Post $post
   * @return Response
   */
  public function index(Request $request, Post $post): Response
  {
    $options['allowedSorts'] = ['title', 'status', 'created_at', 'updated_at'];
    $options['eagerLoaders'] = ['user', 'category'];

    $posts = $this->builderService->query($post, $options);

    return Inertia::render('Posts/List', ['posts' => $posts]);
  }

  /**
   * Display the post creation form.
   *
   * @param Request $request
   * @return Response
   */
  public function create(Request $request): Response
  {
    $authors = User::authors()->get();
    $categories = Category::all();
    $tags = Tag::all();

    return Inertia::render('Posts/Create', [
      'authors' => $authors,
      'categories' => $categories,
      'tags' => $tags
    ]);
  }

  /**
   * Store a new user in the database.
   *
   * @param PostRequest $request
   * @return RedirectResponse
   */
  public function store(PostRequest $request, Post $post): RedirectResponse
  {
    $post->fill($request->validated());
    $this->uploadService->uploadMedia($request, $post);
    $post->save();
    PostStats::increase();

    return redirect()->route('post.index');
  }

  /**
   * Display a specific posts's information for editing.
   *
   * @param Post $post
   * @return Response
   */
  public function show(Post $post): Response
  {
    $authors = User::authors()->get();
    $categories = Category::all();
    $tags = Tag::all();

    return Inertia::render('Posts/Edit', [
      'post' => $post,
      'authors' => $authors,
      'categories' => $categories,
      'tags' => $tags
    ]);
  }

  /**
   * Update a specific post's information.
   *
   * @param PostRequest $request
   * @param Post $post
   * @return RedirectResponse
   */
  public function update(PostRequest $request, Post $post): RedirectResponse
  {
    $post->fill($request->validated());
    $this->uploadService->uploadMedia($request, $post);
    $post->update();

    return redirect()->route('post.update', ['post' => $post]);
  }

  /**
   * Delete a specific post from the database.
   *
   * @param Request $request
   * @param Post $post
   * @return RedirectResponse
   */
  public function destroy(Post $post): RedirectResponse
  {
    $post->delete();
    PostStats::decrease();
    return redirect()->route('post.index');
  }
}
