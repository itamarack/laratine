<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
  /**
   * The root template that is loaded on the first page visit.
   *
   * @var string
   */
  protected $rootView = 'app';

  /**
   * Determine the current asset version.
   */
  public function version(Request $request): string|null
  {
    return parent::version($request);
  }

  /**
   * Define the props that are shared by default.
   *
   * @return array<string, mixed>
   */
  public function share(Request $request): array
  {
    return [
      ...parent::share($request),
      'auth' => [
        'user' => $request->user(),
        'can' => $request->user()?->loadMissing('roles.permissions')
          ->roles->flatMap(function ($role) {
              return $role->permissions;
          })->map(function ($permission) use ($request) {
              return [$permission['name'] => $request->user()->can($permission['name'])];
          })->collapse()->all(),
      ],
      'ziggy' => fn () => [
        ...(new Ziggy)->toArray(),
        'location' => $request->url(),
      ],
    ];
  }
}
