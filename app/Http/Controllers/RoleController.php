<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\QueryBuilderService;
use App\Http\Requests\CategoryRequest;
use App\Http\Requests\RoleRequest;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;

class RoleController extends Controller
{
  protected $builder;

  public function __construct(QueryBuilderService $builderService)
  {
    $this->builder = $builderService;
  }

  /**
   * Display the list of roles.
   *
   * @param Request $request
   * @return Response
   */
  public function index(Role $role): Response
  {
    $options['allowedSorts'] = ['title', 'created_at', 'updated_at'];

    $roles = $this->builder->query($role, $options);

    return Inertia::render('RolesPermissions/List', ['roles' => $roles]);
  }

  /**
   * Store a new role in the database.
   *
   * @param RoleRequest $request
   * @return RedirectResponse
   */
  public function store(RoleRequest $request, Role $role): RedirectResponse
  {
    $role->fill($request->validated());
    $role->save();

    return redirect()->route('role.index');
  }

  /**
   * Update a specific Role.
   *
   * @param RoleRequest $request
   * @param Role $role
   * @return RedirectResponse
   */
  public function update(RoleRequest $request, Role $role): RedirectResponse
  {
    $role->fill($request->validated());
    $role->update();

    return redirect()->route('role.index', ['role' => $role]);
  }

  /**
   * Delete a specific role from the database.
   *
   * @param Request $request
   * @param Role $role
   * @return RedirectResponse
   */
  public function destroy(Role $role): RedirectResponse
  {
    $role->delete();
    return redirect()->route('role.index');
  }
}
