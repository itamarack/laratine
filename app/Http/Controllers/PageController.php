<?php

namespace App\Http\Controllers;

use App\Http\Requests\PageRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Page;
use App\Models\Tag;
use App\Models\User;
use App\Services\FileUploadService;
use App\Services\QueryBuilderService;

class PageController extends Controller
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
   * @param Page $page
   * @return Response
   */
  public function index(Request $request, Page $page): Response
  {
    $options['allowedSorts'] = ['title', 'status', 'created_at', 'updated_at'];
    $options['eagerLoaders'] = ['user', 'category'];

    $pages = $this->builderService->query($page, $options);

    return Inertia::render('Pages/List', ['pages' => $pages]);
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
    $pages = Page::pages()->get();
    $tags = Tag::all();

    return Inertia::render('Pages/Create', [
      'authors' => $authors,
      'pages' => $pages,
      'tags' => $tags
    ]);
  }

  /**
   * Store a new page in the database.
   *
   * @param PageRequest $request
   * @return RedirectResponse
   */
  public function store(PageRequest $request, Page $page): RedirectResponse
  {
    $page->fill($request->validated());
    $this->uploadService->uploadMedia($request, $page);
    $page->save();

    return redirect()->route('page.index');
  }

  /**
   * Display a specific posts's information for editing.
   *
   * @param Page $page
   * @return Response
   */
  public function show(Page $page): Response
  {
    $authors = User::authors()->get();
    $pages = Page::pages()->get();
    $tags = Tag::all();

    return Inertia::render('Pages/Edit', [
      'page' => $page,
      'authors' => $authors,
      'pages' => $pages,
      'tags' => $tags
    ]);
  }

  /**
   * Update a specific post's information.
   *
   * @param PageRequest $request
   * @param Page $page
   * @return RedirectResponse
   */
  public function update(PageRequest $request, Page $page): RedirectResponse
  {
    $page->fill($request->validated());
    $this->uploadService->uploadMedia($request, $page);
    $page->update();

    return redirect()->route('page.update', ['page' => $page]);
  }

  /**
   * Delete a specific post from the database.
   *
   * @param Request $request
   * @param Page $page
   * @return RedirectResponse
   */
  public function destroy(Page $page): RedirectResponse
  {
    $page->delete();
    return redirect()->route('page.index');
  }
}
