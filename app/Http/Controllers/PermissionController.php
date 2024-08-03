<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\PermissionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\Middleware;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Str;
use Illuminate\Routing\Controllers\HasMiddleware;
use Spatie\Permission\Middleware\PermissionMiddleware;

class PermissionController extends Controller implements HasMiddleware
{
  public static function middleware(): array
  {
    return [
      new Middleware(PermissionMiddleware::using('Update Roles & Permissions'), only:['show', 'update']),
    ];
  }

  /**
   * Display a specific posts's information for editing.
   *
   * @param Role $role
   * @return Response
   */
  public function show(Role $role): Response
  {
    $rolePermissions = $role->getAllPermissions()->pluck('name');
    $permissionList = collect(Permission::all());

    $permissionList = $permissionList->groupBy(function ($item) {
      return Str::of($item->name)->explode(' ')->last();
    })->map(function ($items, $name) use ($rolePermissions) {
      $permissions = $items->values()->map(function ($item) use ($rolePermissions) {
        return [...$item->toArray(), 'active' => $rolePermissions->contains($item->name)];
      });

      $active = $permissions->contains('active', true);
      return ['name' => $name, 'permission' => $permissions, 'active' => $active];
    })->values();


    return Inertia::render('RolesPermissions/Permissions', [
      'role' => $role,
      'permissionList' => $permissionList,
      'rolePermissions' => $rolePermissions,
      'enable_all' => $permissionList->every('active', true),
    ]);
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
    $role->fill($validated)->update();
    $role->syncPermissions($validated['permissions']);

    return redirect()->route('permission.show', ['role' => $role]);
  }
}
