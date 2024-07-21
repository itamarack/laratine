<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\QueryBuilderService;
use App\Http\Requests\CategoryRequest;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;

class PermissionController extends Controller
{
  protected $builder;

  public function __construct(QueryBuilderService $builderService)
  {
    $this->builder = $builderService;
  }

  /**
   * Display a specific posts's information for editing.
   *
   * @param Role $role
   * @return Response
   */
  public function show(Role $role): Response
  {
    return Inertia::render('RolesPermissions/Permissions');
  }

  /**
   * Store a new category in the database.
   *
   * @param CategoryRequest $request
   * @return RedirectResponse
   */
  public function store(CategoryRequest $request, Category $category): RedirectResponse
  {
    $category->fill($request->validated());
    $category->save();

    return redirect()->route('category.index');
  }

  /**
   * Update a specific user's information.
   *
   * @param CategoryRequest $request
   * @param Category $category
   * @return RedirectResponse
   */
  public function update(CategoryRequest $request, Category $category): RedirectResponse
  {
    $category->fill($request->validated());
    $category->update();

    return redirect()->route('category.index', ['category' => $category]);
  }

  /**
   * Delete a specific user from the database.
   *
   * @param Request $request
   * @param Category $category
   * @return RedirectResponse
   */
  public function destroy(Category $category): RedirectResponse
  {
    $category->delete();
    return redirect()->route('category.index');
  }
}
