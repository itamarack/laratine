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
  public function tagIndex(Tag $tag): Response
  {
    $options['allowedSorts'] = ['title', 'created_at', 'updated_at'];

    $tags = $this->builder->query($tag, $options);

    return Inertia::render('Tags/List', ['tags' => $tags]);
  }

  /**
   * Store a new category in the database.
   *
   * @param TagRequest $request
   * @return RedirectResponse
   */
  public function categoryStore(TagRequest $request, Tag $category): RedirectResponse
  {
    $category->fill($request->validated());
    $category->save();

    return redirect()->route('category.index');
  }
}
