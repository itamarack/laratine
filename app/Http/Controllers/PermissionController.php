<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\QueryBuilderService;
use App\Http\Requests\CategoryRequest;
use App\Http\Requests\PermissionRequest;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Str;

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
    $permissionList = collect(Permission::all())->groupBy(function ($item) {
      return Str::of($item->name)->explode(' ')->last();
    })->map(function ($items, $name) {
      $permissions = $items->values()->map(fn ($item) => [...$item->toArray(), 'active' => false]);
      return ['name' => $name, 'active' => false, 'permission' => $permissions];
    })->values()->toArray();

    // dd($permissions);

    return Inertia::render('RolesPermissions/Permissions', [
      'role' => $role,
      'permissionList' => $permissionList
    ]);
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
   * @param PermissionRequest $request
   * @param Role $role
   * @return RedirectResponse
   */
  public function update(PermissionRequest $request, Role $role): RedirectResponse
  {
    $validated = $request->validated();
    $role->fill($validated);
    $role->update();

    dd($validated['permissions']);

    return redirect()->route('permission.show', ['role' => $role]);
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
