<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use App\Services\QueryBuilderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommentController extends Controller
{
  protected $builder;

  public function __construct(QueryBuilderService $builderService)
  {
    $this->builder = $builderService;
  }

  /**
   * Display the list of posts.
   *
   * @param Request $request
   * @return Response
   */
  public function index(Comment $comment): Response
  {
    $options['allowedSorts'] = ['title', 'created_at', 'updated_at'];
    $options['eagerLoaders'] = ['replies', 'user', 'post'];

    $comments = $this->builder->query($comment, $options);

    return Inertia::render('Comments/List', ['comments' => $comments]);
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
    $comments = Comment::all();
    $posts = Post::all();

    return Inertia::render('Comments/Create', [
      'authors' => $authors,
      'comments' => $comments,
      'posts' => $posts
    ]);
  }

  /**
   * Store a new page in the database.
   *
   * @param CommentRequest $request
   * @return RedirectResponse
   */
  public function store(CommentRequest $request, Comment $comment): RedirectResponse
  {
    $comment->fill($request->validated());
    $comment->save();

    return redirect()->route('comment.index');
  }

  /**
   * Display a specific posts's information for editing.
   *
   * @param Comment $comment
   * @return Response
   */
  public function show(Comment $comment): Response
  {
    $authors = User::authors()->get();
    $comments = Comment::all();
    $posts = Post::all();

    return Inertia::render('Comments/Edit', [
      'authors' => $authors,
      'comments' => $comments,
      'posts' => $posts,
      'comment' => $comment
    ]);
  }

  /**
   * Update a specific post's information.
   *
   * @param CommentRequest $request
   * @param Comment $comment
   * @return RedirectResponse
   */
  public function update(CommentRequest $request, Comment $comment): RedirectResponse
  {
    $comment->fill($request->validated());
    $comment->update();

    return redirect()->route('comment.update', ['comment' => $comment]);
  }

  /**
   * Delete a specific post from the database.
   *
   * @param Comment $comment
   * @return RedirectResponse
   */
  public function destroy(Comment $comment): RedirectResponse
  {
    $comment->delete();
    return redirect()->route('comment.index');
  }
}
