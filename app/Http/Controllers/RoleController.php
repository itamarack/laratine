<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\QueryBuilderService;
use App\Http\Requests\RoleRequest;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\Middleware;
use Spatie\Permission\Middleware\PermissionMiddleware;

class RoleController extends Controller implements HasMiddleware
{
  protected $builder;

  public function __construct(QueryBuilderService $builderService)
  {
    $this->builder = $builderService;
  }

  public static function middleware(): array
  {
    return [
      new Middleware(PermissionMiddleware::using('View Roles & Permissions'), only:['index']),
      new Middleware(PermissionMiddleware::using('Create Roles & Permissions'), only:['store']),
      new Middleware(PermissionMiddleware::using('Update Roles & Permissions'), only:['update']),
      new Middleware(PermissionMiddleware::using('Delete Roles & Permissions'), only:['destroy']),
    ];
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
