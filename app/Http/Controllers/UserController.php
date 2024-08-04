<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\FileUploadService;
use App\Services\QueryBuilderService;
use App\Stats\UserStats;
use Illuminate\Routing\Controllers\Middleware;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Models\Role;

class UserController extends Controller implements HasMiddleware
{
  protected $uploadService;
  protected $builderService;

  public function __construct(FileUploadService $uploadService, QueryBuilderService $builderService)
  {
    $this->uploadService = $uploadService;
    $this->builderService = $builderService;
  }

  public static function middleware(): array
  {
    return [
      new Middleware(PermissionMiddleware::using('View Users'), only:['index']),
      new Middleware(PermissionMiddleware::using('Create Users'), only:['create', 'store']),
      new Middleware(PermissionMiddleware::using('Update Users'), only:['show', 'update']),
      new Middleware(PermissionMiddleware::using('Delete Users'), only:['destroy']),
    ];
  }

  /**
   * Display a list of users.
   *
   * @param Request $request
   * @param User $user
   * @return Response
   */
  public function index(Request $request, User $user): Response
  {
    $options['allowedSorts'] = ['firstname', 'created_at', 'updated_at'];
    $options['conditions'] = [['method' => 'whereNot', 'parameters' => ['id', $request->user()->id]]];

    $users = $this->builderService->query($user, $options);

    return Inertia::render('Account/Users/List', ['users' => $users]);
  }

  /**
   * Display the user creation form.
   *
   * @return Response
   */
  public function create(): Response
  {
    return Inertia::render('Account/Users/Create', [
      'roles' => Role::all()->pluck('name')
    ]);
  }

  /**
   * Store a new user in the database.
   *
   * @param UserRequest $request
   * @return RedirectResponse
   */
  public function store(UserRequest $request, User $user): RedirectResponse
  {
    $user->fill($request->validated());
    $this->uploadService->uploadAvatar($request, $user);
    $user->save();

    event(new Registered($user));
    UserStats::increase();

    return redirect()->route('user.index');
  }

  /**
   * Display a specific user's information for editing.
   *
   * @param User $user
   * @return Response
   */
  public function show(User $user): Response
  {
    return Inertia::render('Account/Users/Edit', [
      'user' => $user,
      'roles' => Role::all()->pluck('name')
    ]);
  }

  /**
   * Update a specific user's information.
   *
   * @param UserRequest $request
   * @param User $user
   * @return RedirectResponse
   */
  public function update(UserRequest $request, User $user): RedirectResponse
  {
    $user->fill($request->validated());
    $this->uploadService->uploadAvatar($request, $user);
    $user->update();
    $user->syncRoles($request->role);

    return redirect()->route('user.update', [
      'user' => $user,
      'roles' => Role::all()->pluck('name')
    ]);
  }

  /**
   * Delete a specific user from the database.
   *
   * @param Request $request
   * @param User $user
   * @return RedirectResponse
   */
  public function destroy(User $user): RedirectResponse
  {
    $user->delete();
    UserStats::decrease();

    return redirect()->route('user.index');
  }
}
