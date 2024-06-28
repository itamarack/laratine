<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Requests\Users\UsersCreateRequest;
use App\Http\Requests\Users\UsersUpdateRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\QueryBuilder;
use App\Services\FileUploadService;

class UserController extends Controller
{
  protected $uploadService;

  public function __construct(FileUploadService $uploadService)
  {
    $this->uploadService = $uploadService;
  }

  /**
   * Display the user's profile form.
   *
   * @param Request $request
   * @return Response
   */
  public function profileIndex(Request $request): Response
  {
    return Inertia::render('Account/Profile/Profile', [
      'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
      'status' => session('status'),
    ]);
  }

  /**
   * Update the user's profile information.
   *
   * @param ProfileUpdateRequest $request
   * @return RedirectResponse
   */
  public function profileUpdate(ProfileUpdateRequest $request): RedirectResponse
  {
    $request->user()->fill($request->validated());

    if ($request->user()->isDirty('email')) {
      $request->user()->email_verified_at = null;
    }

    $this->uploadService->uploadAvatar($request, $request->user());
    $request->user()->save();

    return Redirect::route('profile.index');
  }

  /**
   * Delete the user's account.
   *
   * @param Request $request
   * @return RedirectResponse
   */
  public function profileDestroy(Request $request): RedirectResponse
  {
    $request->validate([
      'password' => ['required', 'current_password'],
    ]);

    Auth::logout();
    $request->user()->delete();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return Redirect::to('/');
  }

  /**
   * Display a list of users.
   *
   * @param Request $request
   * @return Response
   */
  public function userIndex (Request $request): Response
  {
    $allowedSorts = ['firstname', 'created_at', 'updated_at'];
    $search = User::search($request->query('search'));
    $perPage = $request->query('per_page', 15);

    $users = QueryBuilder::for(User::class)
      ->allowedSorts($allowedSorts)
      ->whereNot('id', $request->user()->id)
      ->when($request->filled('search'), fn($query) => $search->constrain($query))
      ->paginate($perPage)->appends($request->query());

    return Inertia::render('Account/Users/List', ['users' => $users]);
  }

  /**
   * Display the user creation form.
   *
   * @param Request $request
   * @return Response
   */
  public function userCreate (Request $request): Response
  {
    return Inertia::render('Account/Users/Create', []);
  }

  /**
   * Store a new user in the database.
   *
   * @param UsersCreateRequest $request
   * @return RedirectResponse
   */
  public function userStore (UsersCreateRequest $request, User $user): RedirectResponse
  {
    $user->fill($request->validated());
    $this->uploadService->uploadAvatar($request, $user);
    $user->save();

    event(new Registered($user));

    return redirect()->route('user.index');
  }

  /**
   * Display a specific user's information for editing.
   *
   * @param User $user
   * @return Response
   */
  public function userShow(User $user): Response
  {
    return Inertia::render('Account/Users/Edit', ['user' => $user]);
  }

  /**
   * Update a specific user's information.
   *
   * @param UsersUpdateRequest $request
   * @param User $user
   * @return RedirectResponse
   */
  public function userUpdate(UsersUpdateRequest $request, User $user): RedirectResponse
  {
    $user->fill($request->validated());
    $this->uploadService->uploadAvatar($request, $user);
    $user->update();

    return redirect()->route('user.update', ['user' => $user]);
  }

  /**
   * Delete a specific user from the database.
   *
   * @param Request $request
   * @param User $user
   * @return RedirectResponse
   */
  public function userDestroy(User $user): RedirectResponse
  {
    $user->delete();
    return redirect()->route('user.index');
  }
}
