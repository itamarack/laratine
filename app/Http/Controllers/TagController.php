<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Services\QueryBuilderService;
use App\Http\Requests\TagRequest;

class TagController extends Controller
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
  public function index(Tag $tag): Response
  {
    $options['allowedSorts'] = ['title', 'created_at', 'updated_at'];

    $tags = $this->builder->query($tag, $options);

    return Inertia::render('Tags/List', ['tags' => $tags]);
  }

  /**
   * Store a new tag in the database.
   *
   * @param TagRequest $request
   * @return RedirectResponse
   */
  public function store(TagRequest $request, Tag $tag): RedirectResponse
  {
    $tag->fill($request->validated());
    $tag->save();

    return redirect()->route('tag.index');
  }

  /**
   * Update a specific user's information.
   *
   * @param TagRequest $request
   * @param Tag $tag
   * @return RedirectResponse
   */
  public function update(TagRequest $request, Tag $tag): RedirectResponse
  {
    $tag->fill($request->validated());
    $tag->update();

    return redirect()->route('tag.index', ['tag' => $tag]);
  }

  /**
   * Delete a specific user from the database.
   *
   * @param Request $request
   * @param Tag $tag
   * @return RedirectResponse
   */
  public function destroy(Tag $tag): RedirectResponse
  {
    $tag->delete();
    return redirect()->route('tag.index');
  }
}
